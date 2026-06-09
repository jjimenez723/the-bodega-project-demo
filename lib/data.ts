export type CropCategory = "greens" | "tomatoes" | "herbs" | "roots" | "fruit";

export type Listing = {
  id: number;
  name: string;
  category: CropCategory;
  quantity: string;
  location: string;
  distance: string;
  available: string;
  price: number | null;
  sourceType: string;
  accent: string;
  imageQuery: string;
  imageFallback: string;
  imageAlt: string;
  claimed?: boolean;
};

export type MapNodeType = "bodega" | "grower" | "garden";

export type MapNode = {
  id: number;
  lat: number;
  lng: number;
  label: string;
  type: MapNodeType;
  address: string;
  detail: string;
  previewPosition: {
    left: string;
    top: string;
  };
};

export type HarvestListing = {
  id: number;
  name: string;
  quantity: string;
  status: string;
  pickupWindow: string;
  claims: number;
};

export const listings: Listing[] = [
  {
    id: 1,
    name: "Hydroponic Tomatoes",
    category: "tomatoes",
    quantity: "8 lbs",
    location: "Green Newark Bodega",
    distance: "0.2 mi",
    available: "Picked this morning",
    price: 3,
    sourceType: "Bodega rooftop",
    accent: "bg-[#F8D8C7]",
    imageQuery: "fresh hydroponic tomatoes",
    imageFallback:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh red tomatoes on the vine",
  },
  {
    id: 2,
    name: "Surplus Kale",
    category: "greens",
    quantity: "5 lbs",
    location: "St. Mary's Church Garden",
    distance: "0.4 mi",
    available: "Available until 6 PM",
    price: null,
    sourceType: "Raised-bed garden",
    accent: "bg-[#DDEFD5]",
    imageQuery: "fresh kale leaves",
    imageFallback:
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh green kale leaves",
  },
  {
    id: 3,
    name: "Fresh Basil Bundles",
    category: "herbs",
    quantity: "12 bundles",
    location: "Ironbound Hydro Co-op",
    distance: "0.7 mi",
    available: "Picked yesterday",
    price: null,
    sourceType: "Indoor hydroponics",
    accent: "bg-[#D8ECE0]",
    imageQuery: "fresh basil herbs",
    imageFallback:
      "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh basil leaves",
  },
  {
    id: 4,
    name: "Rainbow Carrots",
    category: "roots",
    quantity: "6 lbs",
    location: "Lincoln Park Community Plot",
    distance: "0.9 mi",
    available: "Available all day",
    price: 2.5,
    sourceType: "Community garden",
    accent: "bg-[#F3E3C1]",
    imageQuery: "rainbow carrots produce",
    imageFallback:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Colorful fresh carrots",
  },
  {
    id: 5,
    name: "Backyard Strawberries",
    category: "fruit",
    quantity: "4 pints",
    location: "South Ward Grow Share",
    distance: "1.0 mi",
    available: "Just added",
    price: 4,
    sourceType: "Home grower",
    accent: "bg-[#F3DBD8]",
    imageQuery: "fresh strawberries",
    imageFallback:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh ripe strawberries",
  },
];

export const mapNodes: MapNode[] = [
  {
    id: 1,
    lat: 40.7359,
    lng: -74.1726,
    label: "Green Newark Bodega",
    type: "bodega",
    address: "91 Halsey St",
    detail: "Rooftop tomatoes and weekly pantry pickup",
    previewPosition: { left: "49%", top: "43%" },
  },
  {
    id: 2,
    lat: 40.7484,
    lng: -74.1862,
    label: "St. Mary's Church Garden",
    type: "grower",
    address: "520 Dr. Martin Luther King Jr Blvd",
    detail: "Surplus kale available until 6 PM",
    previewPosition: { left: "34%", top: "22%" },
  },
  {
    id: 3,
    lat: 40.7294,
    lng: -74.1581,
    label: "Ironbound Hydro Co-op",
    type: "grower",
    address: "184 Ferry St",
    detail: "Fresh basil from indoor hydroponics",
    previewPosition: { left: "67%", top: "54%" },
  },
  {
    id: 4,
    lat: 40.7226,
    lng: -74.1802,
    label: "Lincoln Park Community Plot",
    type: "garden",
    address: "3 Lincoln Park",
    detail: "Rainbow carrots and seasonal produce",
    previewPosition: { left: "41%", top: "70%" },
  },
  {
    id: 5,
    lat: 40.7312,
    lng: -74.1516,
    label: "Ferry St. Pantry",
    type: "bodega",
    address: "295 Ferry St",
    detail: "Neighborhood pantry and produce exchange",
    previewPosition: { left: "76%", top: "59%" },
  },
  {
    id: 6,
    lat: 40.7448,
    lng: -74.2011,
    label: "Central Ward Grow Share",
    type: "garden",
    address: "32 Norfolk St",
    detail: "Community garden with weekly harvest drops",
    previewPosition: { left: "21%", top: "31%" },
  },
  {
    id: 7,
    lat: 40.7247,
    lng: -74.211,
    label: "South Ward Grow Share",
    type: "grower",
    address: "742 Clinton Ave",
    detail: "Backyard strawberries and herb bundles",
    previewPosition: { left: "16%", top: "72%" },
  },
];

export const harvestListings: HarvestListing[] = [
  {
    id: 1,
    name: "Collard Green Bundles",
    quantity: "6 bundles",
    status: "Ready for pickup",
    pickupWindow: "Today, 4-7 PM",
    claims: 2,
  },
  {
    id: 2,
    name: "Cherry Tomatoes",
    quantity: "3 pints",
    status: "2 pints left",
    pickupWindow: "Tomorrow, 10 AM-1 PM",
    claims: 1,
  },
];
