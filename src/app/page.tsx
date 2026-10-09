import Booking from "@/components/Booking";
import Coverage from "@/components/Coverage";
import FlightLayer from "@/components/FlightLayer";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import { Contact, FAQ, Manifesto, Services, Stats, VelocityMarquee } from "@/components/Sections";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <FlightLayer />
      <Hero />
      <VelocityMarquee />
      <Manifesto />
      <Services />
      <Stats />
      <Process />
      <Coverage />
      <Booking />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
