// Elohim "Rising Ichthys" mark geometry. The fish, eye and contrails are drawn pointing right in local units;
// MARK.transform tilts them into a climb inside the 120×120 full mark.
export const MARK = {
  fish: "M8 -12Q34 20 56 0Q34 -20 8 12Q15 0 8 -12Z",
  eye: "M44 -5.5L45.1 -2.6L48 -1.5L45.1 -0.4L44 2.5L42.9 -0.4L40 -1.5L42.9 -2.6Z",
  trails: ["M10 0H-12", "M5 -7H-4", "M5 7H-4"],
  sparkle: "M102 9L103.8 15.2L110 17L103.8 18.8L102 25L100.2 18.8L94 17L100.2 15.2Z",
  transform: "translate(70 54) rotate(-28) scale(1.6) translate(-32 0)",
};

// "full" includes the halo rings and guiding star; "compact" crops to the fish and contrails for small spaces.
export const MARK_VIEWBOX = { full: "0 0 120 120", compact: "1 9.5 108 108" };

// sessionStorage key marking that the intro logo reveal has already played this session.
export const INTRO_KEY = "elohim:intro";
