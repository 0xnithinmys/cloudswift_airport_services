"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Trail } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FLYBY_EVENT, type FlybyDetail } from "@/lib/flyby";

// wall-clock seconds; the R3F clock does not advance while frameloop="demand" is idle
const now = () => performance.now() / 1000;

/*
  A procedurally built 3D jet that performs short cinematic flybys and then leaves the screen.
  A flyby is triggered on load and when a new section scrolls into view (see FlightLayer), with a cooldown,
  so the jet appears now and then instead of sitting on top of the content.
  Path points are in normalised screen space: x/y in [-1, 1] of the visible viewport, z in world units.
*/

type Pt = [number, number, number];
type Variant = { name: "swoop" | "cross" | "away"; points: [Pt, Pt, Pt, Pt]; duration: number; roll?: boolean };

// all written left-to-right; mirrored on x when the jet should fly right-to-left
const VARIANTS: Variant[] = [
  // far away and tiny, sweeps towards the camera and past the right edge
  { name: "swoop", points: [[-1.4, 0.75, -28], [-0.7, 0.55, -9], [0.25, -0.05, 2], [1.7, -0.45, 4]], duration: 3.4 },
  // crosses the screen in an arc with a graceful aileron roll in the middle
  { name: "cross", points: [[-1.6, -0.25, -3], [-0.5, 0.45, -1.5], [0.5, 0.05, -0.5], [1.6, 0.55, -3]], duration: 3.8, roll: true },
  // starts close at the bottom and climbs away into the distance until it's a speck
  { name: "away", points: [[-1.1, -0.95, 4], [-0.3, -0.35, 0.5], [0.35, 0.3, -12], [0.7, 0.55, -42]], duration: 3.6 },
];


// scratch vectors reused every frame (module scope avoids per-frame allocations)
const tmp = { p: new THREE.Vector3(), a: new THREE.Vector3(), target: new THREE.Vector3(), n0: new THREE.Vector3(), n1: new THREE.Vector3() };

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const smooth = (e0: number, e1: number, x: number) => THREE.MathUtils.smoothstep(x, e0, e1);

/* ---------------- Geometry helpers ---------------- */

function wingGeometry(
  span: number, rootFront: number, rootBack: number, tipFront: number, tipBack: number, thick: number, side: 1 | -1,
) {
  // Outline in the X/Z plane (shape y = -z), extruded upward
  const s = new THREE.Shape();
  s.moveTo(0, -rootFront);
  s.lineTo(side * span, -tipFront);
  s.lineTo(side * span, -tipBack);
  s.lineTo(0, -rootBack);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -thick / 2, 0);
  return g;
}

function useJetGeometry() {
  return useMemo(() => {
    // Fuselage: lathe profile from tail (-y) to nose (+y), then rotate so the nose points to +Z
    const profile: [number, number][] = [
      [0.0, -2.2], [0.08, -2.15], [0.2, -1.6], [0.31, -0.9], [0.34, -0.3], [0.34, 0.9],
      [0.31, 1.45], [0.24, 1.8], [0.14, 2.05], [0.0, 2.2],
    ];
    const fuselage = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 48);
    fuselage.rotateX(Math.PI / 2);

    const wingR = wingGeometry(2.3, 0.75, -0.55, -0.55, -0.95, 0.07, 1);
    const wingL = wingGeometry(2.3, 0.75, -0.55, -0.55, -0.95, 0.07, -1);
    const stabR = wingGeometry(0.9, -1.45, -2.0, -1.95, -2.2, 0.04, 1);
    const stabL = wingGeometry(0.9, -1.45, -2.0, -1.95, -2.2, 0.04, -1);

    // Vertical tail fin in the Z/Y plane
    const fin = new THREE.Shape();
    fin.moveTo(-1.25, 0.2);
    fin.lineTo(-2.15, 0.2);
    fin.lineTo(-2.35, 1.2);
    fin.lineTo(-2.0, 1.2);
    fin.closePath();
    const finGeo = new THREE.ExtrudeGeometry(fin, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.012, bevelSegments: 2 });
    finGeo.rotateY(-Math.PI / 2);
    finGeo.translate(0.025, 0, 0);

    const engine = new THREE.CylinderGeometry(0.17, 0.14, 0.75, 32, 1, true);
    engine.rotateX(Math.PI / 2);
    const intake = new THREE.CircleGeometry(0.16, 32);

    return { fuselage, wingR, wingL, stabR, stabL, finGeo, engine, intake };
  }, []);
}

/* ---------------- The jet ---------------- */

function Jet() {
  const g = useJetGeometry();
  const strobe = useRef<THREE.MeshBasicMaterial>(null);
  const fan = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (strobe.current) strobe.current.opacity = Math.sin(t * 6) > 0.85 ? 1 : 0.05;
    if (fan.current) fan.current.children.forEach((c) => (c.rotation.z = t * 20));
  });

  const body = <meshStandardMaterial color="#f4f6fb" metalness={0.35} roughness={0.22} envMapIntensity={1.2} />;
  const gold = <meshStandardMaterial color="#f4c97a" metalness={1} roughness={0.25} />;
  const dark = <meshStandardMaterial color="#0b1020" metalness={0.6} roughness={0.15} />;

  const windows = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let z = -1.1; z <= 1.25; z += 0.17) {
      out.push([0.325, 0.09, z], [-0.325, 0.09, z]);
    }
    return out;
  }, []);

  return (
    <group>
      <mesh geometry={g.fuselage} castShadow>{body}</mesh>

      {/* gold cheat line along the fuselage */}
      {[1.32, 4.82].map((theta) => (
        <mesh key={theta} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.343, 0.343, 1.2, 48, 1, true, theta, 0.14]} />
          <meshStandardMaterial color="#f4c97a" metalness={1} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* cockpit glass */}
      <mesh position={[0, 0.13, 1.62]} scale={[0.2, 0.1, 0.32]}>
        <sphereGeometry args={[1, 24, 16]} />
        {dark}
      </mesh>

      {/* cabin windows */}
      {windows.map((p, i) => (
        <mesh key={i} position={p} scale={[0.02, 0.045, 0.045]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#0b1020" emissive="#7aa7ff" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* wings with slight dihedral */}
      <group position={[0, -0.12, 0]}>
        <mesh geometry={g.wingR} rotation={[0, 0, 0.07]}>{body}</mesh>
        <mesh geometry={g.wingL} rotation={[0, 0, -0.07]}>{body}</mesh>
        {/* winglets */}
        <mesh position={[2.3, 0.3, -0.78]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.03, 0.35, 0.3]} />
          {gold}
        </mesh>
        <mesh position={[-2.3, 0.3, -0.78]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.03, 0.35, 0.3]} />
          {gold}
        </mesh>
      </group>

      {/* tail */}
      <mesh geometry={g.stabR} position={[0, 0.08, 0]}>{body}</mesh>
      <mesh geometry={g.stabL} position={[0, 0.08, 0]}>{body}</mesh>
      <mesh geometry={g.finGeo}>{gold}</mesh>

      {/* engines */}
      <group ref={fan}>
        {[1, -1].map((s) => (
          <group key={s} position={[s * 0.95, -0.36, 0.25]}>
            <mesh geometry={g.engine}>
              <meshStandardMaterial color="#e8ebf3" metalness={0.5} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh geometry={g.intake} position={[0, 0, 0.36]}>
              <meshStandardMaterial color="#141a2e" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.37]}>
              <torusGeometry args={[0.165, 0.018, 12, 40]} />
              {gold}
            </mesh>
            {/* pylon */}
            <mesh position={[0, 0.17, -0.05]}>
              <boxGeometry args={[0.05, 0.2, 0.45]} />
              {body}
            </mesh>
          </group>
        ))}
      </group>

      {/* navigation lights */}
      <mesh position={[2.32, -0.02, -0.72]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#22ff88" toneMapped={false} />
      </mesh>
      <mesh position={[-2.32, -0.02, -0.72]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#ff3355" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.22, -2.2]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial ref={strobe} color="#ffffff" transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------- Flight controller ---------------- */

type ActiveFlight = { id: number; curve: THREE.CubicBezierCurve3; variant: Variant; start: number; dir: 1 | -1 };

function Flight() {
  const group = useRef<THREE.Group>(null);
  const banker = useRef<THREE.Group>(null);
  const { viewport, size, invalidate, gl, scene, camera } = useThree();
  const flight = useRef<ActiveFlight | null>(null);
  const lastEnd = useRef(-Infinity);
  const nextVariant = useRef(0);
  const [trailKey, setTrailKey] = useState(0);
  // flybys wait until every shader is compiled, so the first one never stalls the page
  const warm = useRef(false);
  const [isWarm, setIsWarm] = useState(false);

  const scale = Math.min(viewport.width * 0.085, viewport.height * 0.06);

  // listen for flyby requests
  useEffect(() => {
    const onFlyby = (e: Event) => {
      if (!warm.current || flight.current || now() - lastEnd.current < 3) return; // one at a time, with a breather between
      const dir = (e as CustomEvent<FlybyDetail>).detail?.direction ?? 1;
      const variant = VARIANTS[nextVariant.current++ % VARIANTS.length];
      const pts = variant.points.map(
        ([x, y, z]) => new THREE.Vector3((dir * x * viewport.width) / 2, (y * viewport.height) / 2, z),
      ) as [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
      flight.current = { id: Date.now(), curve: new THREE.CubicBezierCurve3(...pts), variant, start: now(), dir };
      setTrailKey((k) => k + 1); // fresh contrail so it never connects to the previous flight
      invalidate();
    };
    window.addEventListener(FLYBY_EVENT, onFlyby);
    return () => window.removeEventListener(FLYBY_EVENT, onFlyby);
  }, [invalidate, viewport.width, viewport.height]);

  // Pre-compile every material off the main thread (KHR_parallel_shader_compile) once <Environment> has set
  // scene.environment, so the programs built here are exactly the ones the flybys use.
  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const warmUp = (tries: number) => {
      if (cancelled) return;
      if (!scene.environment && tries > 0) {
        timer = window.setTimeout(() => warmUp(tries - 1), 50);
        return;
      }
      gl.compileAsync(scene, camera).then(() => {
        if (cancelled) return;
        warm.current = true;
        setIsWarm(true);
      });
    };
    warmUp(40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [gl, scene, camera]);

  // welcome flyby as soon as the jet is ready
  useEffect(() => {
    if (!isWarm) return;
    const t = window.setTimeout(() => window.dispatchEvent(new CustomEvent(FLYBY_EVENT, { detail: { direction: 1 } })), 150);
    return () => window.clearTimeout(t);
  }, [isWarm]);
  useFrame(() => {
    const g = group.current;
    const b = banker.current;
    const f = flight.current;
    if (!g || !b) return;
    if (!f) {
      // keep rendering briefly after landing off-screen so the contrail can fade, then go fully idle
      if (now() - lastEnd.current < 1.5) invalidate();
      return;
    }

    const raw = (now() - f.start) / f.variant.duration;
    if (raw >= 1) {
      g.scale.setScalar(0);
      flight.current = null;
      lastEnd.current = now();
      invalidate();
      return;
    }

    const u = easeInOutSine(raw);
    f.curve.getPoint(u, tmp.p);
    f.curve.getPoint(Math.min(u + 0.01, 1), tmp.a);
    g.position.copy(tmp.p);
    g.lookAt(tmp.target.copy(tmp.a).sub(tmp.p).normalize().add(tmp.p));

    // bank into the turn: change of heading in screen space
    f.curve.getTangent(Math.max(u - 0.02, 0), tmp.n0);
    f.curve.getTangent(Math.min(u + 0.02, 1), tmp.n1);
    const turn = Math.atan2(tmp.n1.y, tmp.n1.x) - Math.atan2(tmp.n0.y, tmp.n0.x);
    let roll = THREE.MathUtils.clamp(turn * 4, -0.8, 0.8);
    // signature move: a smooth full roll in the middle of the cross-screen pass
    if (f.variant.roll) roll += smooth(0.35, 0.65, raw) * Math.PI * 2 * f.dir;
    b.rotation.z = roll;

    // fade in/out at the edges of the flight
    g.scale.setScalar(scale * (0.6 + 0.4 * smooth(0, 0.15, raw)));
    invalidate();
  });

  return (
    // hidden between flights with scale 0 (not `visible`), so the light count and shaders never change
    <group ref={group} scale={0}>
      <group ref={banker}>
        <Jet />
      </group>
      <Trail key={trailKey} width={2.4} length={4} decay={2.2} color="#f4c97a" attenuation={(w) => w * w * w}>
        <mesh position={[0, 0.1, -2.3]}>
          <sphereGeometry args={[0.001]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </Trail>
      <pointLight position={[0, -1, 0]} intensity={size.width < 640 ? 2 : 4} color="#7aa7ff" distance={6} />
    </group>
  );
}

export default function Plane3D() {
  // start sharp, drop resolution automatically if the device cannot hold the frame rate
  const [dpr, setDpr] = useState(1.25);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <Canvas
        // R3F sets pointer-events:auto on its wrapper by default, which would block every click on the page
        style={{ pointerEvents: "none" }}
        // only render while a flyby is running: zero GPU cost the rest of the time
        frameloop="demand"
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor onDecline={() => setDpr(0.8)} onIncline={() => setDpr(1.25)} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 8]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, -2, -4]} intensity={1.2} color="#f4c97a" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 5]} scale={[10, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2} position={[-6, 0, 2]} scale={[3, 8, 1]} color="#7aa7ff" />
          <Lightformer form="rect" intensity={2} position={[6, -1, 2]} scale={[3, 8, 1]} color="#f4c97a" />
        </Environment>
        <Flight />
      </Canvas>
    </div>
  );
}
