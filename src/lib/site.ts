// Central content for the site. Edit brand, contact details and copy here.

export const site = {
  name: "CloudSwift",
  fullName: "CloudSwift Airport Assist",
  tagline: "Seamless airport assistance, every time.",
  description:
    "Premium meet & greet, VIP fast track, transit, lounge, porter and transfer services across 60+ airports in India, the Middle East, Asia, Europe and the USA.",
  // TODO: replace with your real contact details
  phone: "+91 00000 00000",
  whatsapp: "+91 00000 00000",
  email: "hello@cloudswift.example",
  address: "Your office address, City, Country",
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  /** Anime-style illustration in /public/images (optional) */
  image?: string;
  includes: string[];
  idealFor: string[];
};

export const services: Service[] = [
  {
    slug: "meet-and-greet-arrival",
    image: "/images/arrival.jpg",
    title: "Meet & Greet — Arrival",
    short: "Welcomed at the aircraft door or gate with your name board, then escorted all the way to your car.",
    description:
      "Our representative meets you at the gate, aerobridge or designated terminal point holding a personalised name board. We guide you through immigration and customs, help collect your baggage and walk you to your waiting transfer.",
    icon: "PlaneLanding",
    includes: [
      "Personal name-board welcome at gate or terminal",
      "Escort through immigration & customs",
      "Baggage claim assistance with porter",
      "Hand-off to your chauffeur or taxi",
    ],
    idealFor: ["First-time visitors", "Senior travellers", "Families with children"],
  },
  {
    slug: "meet-and-greet-departure",
    image: "/images/departure.jpg",
    title: "Meet & Greet — Departure",
    short: "Met at the curb, helped through check-in, security and emigration, and escorted to your gate.",
    description:
      "From the moment your car pulls up, we take over. Our agent assists with check-in and bag drop, guides you through security and emigration, and escorts you to the lounge or boarding gate in good time.",
    icon: "PlaneTakeoff",
    includes: [
      "Curbside meeting at terminal entrance",
      "Check-in and bag-drop support",
      "Guidance through security & emigration",
      "Escort to lounge or boarding gate",
    ],
    idealFor: ["Business travellers", "Large families", "Travellers with heavy luggage"],
  },
  {
    slug: "transit-assistance",
    image: "/images/transit.jpg",
    title: "Transit Assistance",
    short: "Tight connection? We meet you off the plane and make sure you reach your next flight on time.",
    description:
      "Connections at large hubs can be confusing and stressful. Our transit team meets you on arrival, handles transfer desks and re-checks, escorts you between terminals and makes sure you board your onward flight comfortably.",
    icon: "Repeat",
    includes: [
      "Meet at arrival gate",
      "Transfer desk and boarding-pass support",
      "Inter-terminal escort & buggy where available",
      "Lounge access during long layovers",
    ],
    idealFor: ["Tight connections", "Unaccompanied seniors", "Multi-leg journeys"],
  },
  {
    slug: "vip-fast-track",
    image: "/images/fast-track.jpg",
    title: "VIP Fast Track",
    short: "Skip the queues at passport control, security and customs wherever fast-track lanes are available.",
    description:
      "Save valuable time with priority processing. Where airport regulations allow, we take you through dedicated fast-track lanes for immigration, security and customs, so you spend less time queuing and more time relaxing.",
    icon: "Zap",
    includes: [
      "Priority immigration lanes (where available)",
      "Fast-track security screening",
      "Expedited customs clearance",
      "Dedicated agent throughout",
    ],
    idealFor: ["Executives", "VIP & celebrity guests", "Time-critical trips"],
  },
  {
    slug: "lounge-access",
    image: "/images/lounge.jpg",
    title: "Airport Lounge Access",
    short: "Relax before your flight or during a layover with lounge access booked around your schedule.",
    description:
      "We book the right lounge for your terminal, layover length and airline, so you can enjoy quiet seating, refreshments, Wi-Fi and showers before you fly.",
    icon: "Armchair",
    includes: [
      "Lounge chosen for your terminal & airline",
      "Food, drinks and Wi-Fi",
      "Showers & rest areas (lounge dependent)",
      "Flexible durations for long layovers",
    ],
    idealFor: ["Long layovers", "Red-eye flights", "Remote workers"],
  },
  {
    slug: "porter-and-baggage",
    image: "/images/porter.jpg",
    title: "Porter & Baggage Handling",
    short: "Hands-free travel — porters move your luggage from the car to check-in, and from the belt to your ride.",
    description:
      "Heavy suitcases, strollers or sports equipment are no problem. Our porters handle your bags from vehicle to check-in on departure and from baggage claim to your vehicle on arrival.",
    icon: "Luggage",
    includes: [
      "Curb-to-counter luggage handling",
      "Belt-to-car assistance on arrival",
      "Trolley and oversized-item support",
      "Buggy assistance where available",
    ],
    idealFor: ["Heavy luggage", "Families", "Elderly travellers"],
  },
  {
    slug: "airport-transfers",
    image: "/images/transfers.jpg",
    title: "Airport Transfers",
    short: "Private, punctual car service between airports, hotels, homes and cities worldwide.",
    description:
      "Arrange a chauffeur-driven car to meet you at arrivals or pick you up for departure. Choose from sedans, SUVs and vans, with flight tracking so your driver adjusts to delays.",
    icon: "Car",
    includes: [
      "Sedan, SUV and van options",
      "Flight-tracked pickups",
      "Airport ↔ hotel, home or city",
      "Combines with meet & greet",
    ],
    idealFor: ["Business arrivals", "Groups", "Late-night landings"],
  },
  {
    slug: "special-assistance",
    image: "/images/special-assistance.jpg",
    title: "Special Assistance",
    short: "Thoughtful, patient support for seniors, passengers with reduced mobility and families with young kids.",
    description:
      "Our trained staff provide extra care for travellers who need it — wheelchair coordination, buggy rides, help with forms and announcements, and a reassuring presence from curb to gate.",
    icon: "HeartHandshake",
    includes: [
      "Wheelchair & buggy coordination",
      "Help with forms and procedures",
      "Escort for unaccompanied seniors",
      "Family and stroller support",
    ],
    idealFor: ["Senior citizens", "Reduced-mobility passengers", "Parents with infants"],
  },
  {
    slug: "corporate-and-groups",
    image: "/images/corporate.jpg",
    title: "Corporate & Group Travel",
    short: "Coordinated assistance for delegations, events, sports teams and family groups of any size.",
    description:
      "One point of contact for every traveller in your group. We coordinate arrivals and departures, manage baggage, arrange transfers and keep your team moving together — with consolidated invoicing for companies.",
    icon: "Users",
    includes: [
      "Dedicated account coordinator",
      "Multi-passenger meet & greet",
      "Group baggage & transfer logistics",
      "Corporate billing",
    ],
    idealFor: ["Corporate delegations", "Events & conferences", "Weddings & family groups"],
  },
];

export const regions: { name: string; airports: string[] }[] = [
  {
    name: "India",
    airports: [
      "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
      "Kochi", "Trivandrum", "Goa", "Pune", "Ahmedabad", "Jaipur",
      "Lucknow", "Guwahati", "Mangalore", "Visakhapatnam",
    ],
  },
  {
    name: "Middle East",
    airports: [
      "Dubai", "Abu Dhabi", "Doha", "Riyadh", "Jeddah", "Madinah",
      "Muscat", "Kuwait City",
    ],
  },
  {
    name: "Asia",
    airports: [
      "Singapore Changi", "Kuala Lumpur", "Penang", "Langkawi", "Kota Kinabalu",
      "Kuching", "Colombo", "Malé",
    ],
  },
  {
    name: "Europe",
    airports: [
      "London Heathrow", "Paris CDG", "Frankfurt", "Amsterdam", "Geneva", "Brussels",
    ],
  },
  {
    name: "USA",
    airports: [
      "Newark (EWR)", "Chicago O'Hare", "Dallas/Fort Worth", "Washington Dulles", "Houston (IAH)",
    ],
  },
];

export const steps = [
  { title: "Book your service", text: "Pick your airport, service and flight details online in under two minutes." },
  { title: "Get confirmation", text: "Receive instant confirmation with your agent's details by email and WhatsApp." },
  { title: "Meet your agent", text: "Your representative waits with a name board at the agreed meeting point." },
  { title: "Travel effortlessly", text: "Glide through the airport while we handle queues, bags and connections." },
];

// TODO: replace with genuine customer reviews before going live
export const testimonials = [
  { quote: "Our connection was tight, but the agent met us at the gate and got us to the next flight with time to spare.", name: "Sample review", place: "Paris CDG" },
  { quote: "My mother travelled alone for the first time. The staff stayed with her from check-in to boarding — she felt completely at ease.", name: "Sample review", place: "Chennai" },
  { quote: "Prompt, professional and easy to book. Fast track at Dubai saved us almost an hour.", name: "Sample review", place: "Dubai" },
  { quote: "We booked arrival assistance for a 14-person delegation. Everything ran like clockwork.", name: "Sample review", place: "Delhi" },
];

export const faqs = [
  { q: "How far in advance should I book?", a: "We recommend booking at least 48 hours before your flight. Last-minute requests are often possible — message us on WhatsApp and we'll do our best." },
  { q: "Where will the agent meet me?", a: "Depending on the airport, your agent meets you at the aircraft gate, aerobridge, arrival hall or terminal entrance, holding a name board. Exact details are in your confirmation." },
  { q: "Is fast track available at every airport?", a: "Fast-track lanes depend on local airport regulations. Where they're unavailable, your agent still guides you through each step as quickly as possible." },
  { q: "What if my flight is delayed?", a: "We track your flight in real time and adjust automatically. There's no extra charge for reasonable delays." },
  { q: "Can I book for someone else, like a parent?", a: "Absolutely. Many customers book for elderly parents, children or guests. Just add the traveller's details and a contact number." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before the service. Later cancellations may be partially charged depending on the airport." },
];

// [lat, lng] for globe markers; first entry is the hub that arcs originate from
export const globePoints: { name: string; loc: [number, number] }[] = [
  { name: "Dubai", loc: [25.25, 55.36] },
  { name: "Delhi", loc: [28.56, 77.1] },
  { name: "Mumbai", loc: [19.09, 72.87] },
  { name: "Chennai", loc: [12.99, 80.17] },
  { name: "Bengaluru", loc: [13.2, 77.71] },
  { name: "Kolkata", loc: [22.65, 88.45] },
  { name: "Doha", loc: [25.27, 51.61] },
  { name: "Riyadh", loc: [24.96, 46.7] },
  { name: "Jeddah", loc: [21.68, 39.16] },
  { name: "Muscat", loc: [23.59, 58.28] },
  { name: "Kuwait", loc: [29.24, 47.97] },
  { name: "Singapore", loc: [1.36, 103.99] },
  { name: "Kuala Lumpur", loc: [2.74, 101.71] },
  { name: "Colombo", loc: [7.18, 79.88] },
  { name: "Malé", loc: [4.19, 73.53] },
  { name: "London", loc: [51.47, -0.45] },
  { name: "Paris", loc: [49.01, 2.55] },
  { name: "Frankfurt", loc: [50.04, 8.56] },
  { name: "Amsterdam", loc: [52.31, 4.76] },
  { name: "Geneva", loc: [46.24, 6.11] },
  { name: "Newark", loc: [40.69, -74.17] },
  { name: "Chicago", loc: [41.97, -87.9] },
  { name: "Dallas", loc: [32.9, -97.04] },
  { name: "Washington", loc: [38.95, -77.46] },
  { name: "Houston", loc: [29.99, -95.34] },
];
