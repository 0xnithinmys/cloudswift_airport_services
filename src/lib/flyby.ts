// Tiny shared contract between the page (which requests flybys) and the lazy-loaded 3D jet.
export const FLYBY_EVENT = "cloudswift:flyby";
export type FlybyDetail = { direction?: 1 | -1 };

export function requestFlyby(direction: 1 | -1 = 1) {
  window.dispatchEvent(new CustomEvent<FlybyDetail>(FLYBY_EVENT, { detail: { direction } }));
}
