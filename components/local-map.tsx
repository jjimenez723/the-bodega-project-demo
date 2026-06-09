"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { Building2, MapPin, Navigation, Sprout, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapNode, MapNodeType, mapNodes } from "@/lib/data";

const NEWARK_CENTER = { lat: 40.7357, lng: -74.1724 };
const NODE_COLORS = {
  bodega: "#8C6042", // earth
  grower: "#2F7548", // leaf
  garden: "#E59F43", // warm orange/yellow
} as const;

const MAP_STYLES = [
  {
    elementType: "geometry",
    stylers: [{ color: "#F8F6EE" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#F8F6EE" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#173D2B" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2F7548" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#EAE4D7" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#E2F2DF" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#EAE4D7" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#CCE8CC" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#173D2B" }],
  },
];

type MapStatus = "loading" | "ready" | "error";
let configuredApiKey: string | undefined;

export function LocalMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const boundaryBounds = useRef<google.maps.LatLngBounds | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [selectedNodeId, setSelectedNodeId] = useState(mapNodes[0].id);
  const selectedNode = mapNodes.find((node) => node.id === selectedNodeId) ?? mapNodes[0];
  const growerCount = mapNodes.filter((node) => node.type === "grower").length;
  const bodegaCount = mapNodes.filter((node) => node.type === "bodega").length;

  useEffect(() => {
    if (!apiKey || !mapElement.current) {
      return;
    }

    const googleMapsApiKey = apiKey;
    let active = true;

    async function initializeMap() {
      try {
        configureGoogleMaps(googleMapsApiKey);

        const [{ Map }, { Place }] = await Promise.all([importLibrary("maps"), importLibrary("places")]);

        if (!active || !mapElement.current) {
          return;
        }

        const map = new Map(mapElement.current, {
          center: NEWARK_CENTER,
          zoom: 12,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: MAP_STYLES,
        });

        mapInstance.current = map;
        addNodeMarkers(map, setSelectedNodeId);
        await centerFromGooglePlaces(map, Place);

        try {
          await addNewarkBoundary(map);
        } catch (error) {
          console.warn("Unable to draw Newark city boundary", error);
        }

        if (active) {
          setStatus("ready");
        }
      } catch (error) {
        console.error("Unable to initialize Google map", error);
        if (active) {
          setStatus("error");
        }
      }
    }

    void initializeMap();

    return () => {
      active = false;
      mapInstance.current = null;
      boundaryBounds.current = null;
    };
  }, [apiKey]);

  async function addNewarkBoundary(map: google.maps.Map) {
    const response = await fetch("api/newark-boundary");

    if (!response.ok) {
      throw new Error("Unable to fetch Newark city boundary");
    }

    const geoJson = await response.json();
    map.data.addGeoJson(geoJson);
    map.data.setStyle({
      fillColor: "#3F7C4D",
      fillOpacity: 0.12,
      strokeColor: "#2F653D",
      strokeOpacity: 0.9,
      strokeWeight: 3,
    });

    const bounds = new google.maps.LatLngBounds();
    map.data.forEach((feature) => {
      feature.getGeometry()?.forEachLatLng((latLng) => bounds.extend(latLng));
    });

    if (!bounds.isEmpty()) {
      boundaryBounds.current = bounds;
      map.fitBounds(bounds, 18);
    }
  }

  function fitNewarkBoundary() {
    const map = mapInstance.current;
    const bounds = boundaryBounds.current;

    if (map && bounds) {
      map.fitBounds(bounds, 18);
      return;
    }

    map?.setCenter(NEWARK_CENTER);
    map?.setZoom(12);
  }

  function selectNode(node: MapNode) {
    setSelectedNodeId(node.id);
    mapInstance.current?.panTo({ lat: node.lat, lng: node.lng });
  }

  return (
    <section className="pb-28">
      <div className="mb-6">
        <p className="text-sm font-semibold text-leaf">Node Mapping</p>
        <h1 className="mt-1 text-5xl font-semibold tracking-tight text-forest sm:text-6xl">What&apos;s growing nearby.</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-forest/60">
          Explore fresh surplus and neighborhood food nodes across Newark. Zoom in to explore your block.
        </p>
      </div>

      <div className="relative h-[435px] overflow-hidden rounded-[1.75rem] border border-black/[0.04] bg-[#E9EEF5] shadow-card">
        {apiKey ? <div ref={mapElement} className="absolute inset-0" /> : <SampleMapPreview selectedNode={selectedNode} onSelect={selectNode} />}

        {apiKey && status === "loading" && <MapMessage title="Loading Newark map" detail="Drawing the city boundary..." />}
        {apiKey && status === "error" && (
          <MapMessage title="Map unavailable" detail="Check the Google Maps key and try again." />
        )}

        <div className="absolute left-3 top-3 rounded-2xl bg-white/85 px-3 py-2 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leaf">Newark, NJ</p>
          <p className="text-xs font-semibold text-forest">City boundary</p>
        </div>

        {apiKey && status === "ready" && (
          <button
            aria-label="Fit Newark city boundary"
            onClick={fitNewarkBoundary}
            className="absolute bottom-6 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest shadow-md transition hover:bg-mint"
          >
            <Navigation className="h-4 w-4" fill="currentColor" />
          </button>
        )}

        {apiKey && (
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-1 left-2 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-forest/65"
          >
            Boundary data © OpenStreetMap contributors
          </a>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MapStat icon={Sprout} value={String(growerCount)} label="Growers" />
        <MapStat icon={Building2} value={String(bodegaCount)} label="Bodegas" />
        <MapStat icon={Users} value="18" label="Neighbors" />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-black/[0.04] bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-forest/60">
          <Legend color="bg-leaf" label="Grower" />
          <Legend color="bg-earth" label="Bodega" />
          <Legend color="bg-[#E59F43]" label="Garden" />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-forest">Sample food nodes</h2>
        <p className="text-xs font-medium text-forest/45">{mapNodes.length} mapped</p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {mapNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => selectNode(node)}
            className={`rounded-[1.25rem] border bg-white p-3 text-left transition hover:border-leaf/40 ${
              node.id === selectedNodeId ? "border-leaf/50 shadow-card" : "border-black/[0.04] shadow-sm"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                style={{ backgroundColor: NODE_COLORS[node.type] }}
              />
              <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-leaf">
                  {formatNodeType(node.type)}
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-forest">{node.label}</span>
                <span className="mt-1 block text-xs leading-4 text-forest/50">{node.detail}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function configureGoogleMaps(apiKey: string) {
  if (!configuredApiKey) {
    configuredApiKey = apiKey;
    setOptions({ key: apiKey, v: "weekly" });
    return;
  }

  if (configuredApiKey !== apiKey) {
    throw new Error("Google Maps was initialized with a different API key");
  }
}

async function centerFromGooglePlaces(map: google.maps.Map, Place: typeof google.maps.places.Place) {
  try {
    const { places } = await Place.searchByText({
      textQuery: "Newark, New Jersey",
      fields: ["location", "viewport"],
      includedType: "locality",
      maxResultCount: 1,
    });

    const newark = places[0];

    if (newark?.viewport) {
      map.fitBounds(newark.viewport);
    } else if (newark?.location) {
      map.setCenter(newark.location);
    }
  } catch (error) {
    console.warn("Unable to center Newark using Google Places", error);
  }
}

function addNodeMarkers(map: google.maps.Map, onSelect: (nodeId: number) => void) {
  const infoWindow = new google.maps.InfoWindow();

  for (const node of mapNodes) {
    const marker = new google.maps.Marker({
      map,
      position: { lat: node.lat, lng: node.lng },
      title: node.label,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: NODE_COLORS[node.type],
        fillOpacity: 1,
        scale: 8,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
      },
    });

    marker.addListener("click", () => {
      onSelect(node.id);
      infoWindow.setContent(createInfoWindowContent(node));
      infoWindow.open({ anchor: marker, map });
    });
  }
}

function createInfoWindowContent(node: MapNode) {
  const container = document.createElement("div");
  const type = document.createElement("p");
  const title = document.createElement("strong");
  const address = document.createElement("p");
  const detail = document.createElement("p");

  type.textContent = formatNodeType(node.type);
  type.style.cssText = "margin:0 0 3px;color:#3F7C4D;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;";
  title.textContent = node.label;
  title.style.cssText = "color:#173D2B;font-size:14px;";
  address.textContent = node.address;
  address.style.cssText = "margin:4px 0 0;color:#61766A;font-size:11px;";
  detail.textContent = node.detail;
  detail.style.cssText = "margin:5px 0 0;color:#3E584A;font-size:12px;max-width:190px;";
  container.append(type, title, address, detail);

  return container;
}

function SampleMapPreview({
  selectedNode,
  onSelect,
}: {
  selectedNode: MapNode;
  onSelect: (node: MapNode) => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#E9EEF5]">
      <div className="absolute left-[8%] top-[15%] h-[1px] w-[92%] rotate-[18deg] bg-white/65" />
      <div className="absolute -left-[8%] top-[37%] h-[2px] w-[120%] -rotate-[12deg] bg-white/70" />
      <div className="absolute -left-[2%] top-[62%] h-[1px] w-[112%] rotate-[7deg] bg-white/70" />
      <div className="absolute -left-[6%] top-[81%] h-[2px] w-[110%] -rotate-[18deg] bg-white/60" />
      <div className="absolute left-[19%] top-[-12%] h-[125%] w-[2px] rotate-[8deg] bg-white/55" />
      <div className="absolute left-[47%] top-[-12%] h-[125%] w-[1px] -rotate-[7deg] bg-white/65" />
      <div className="absolute left-[72%] top-[-12%] h-[125%] w-[2px] rotate-[13deg] bg-white/55" />

      {mapNodes.map((node) => (
        <button
          key={node.id}
          aria-label={`Select ${node.label}`}
          onClick={() => onSelect(node)}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={node.previewPosition}
        >
          {node.id === selectedNode.id && (
            <span
              className="map-ring absolute -inset-2 rounded-full"
              style={{ backgroundColor: NODE_COLORS[node.type] }}
            />
          )}
          <span
            className="relative block h-4 w-4 rounded-full border-[3px] border-white shadow-md"
            style={{ backgroundColor: NODE_COLORS[node.type] }}
          />
        </button>
      ))}

      <div className="absolute bottom-3 left-3 right-3 rounded-[1.35rem] bg-white/90 p-3 shadow-md backdrop-blur-xl">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leaf">
              Sample map preview - {formatNodeType(selectedNode.type)}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-forest">{selectedNode.label}</p>
            <p className="text-xs text-forest/55">{selectedNode.address}</p>
            <p className="mt-1 text-xs text-forest/70">{selectedNode.detail}</p>
          </div>
        </div>
        <p className="mt-2 border-t border-sand pt-2 text-[10px] font-medium text-forest/45">
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for the live street map.
        </p>
      </div>
    </div>
  );
}

function formatNodeType(type: MapNodeType) {
  return type === "bodega" ? "Bodega" : type === "garden" ? "Community garden" : "Grower";
}

function MapMessage({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#E9EEF5]/95 px-6 text-center">
      <div className="max-w-xs">
        <Sprout className="mx-auto h-7 w-7 text-leaf" />
        <p className="mt-3 text-sm font-semibold text-forest">{title}</p>
        <p className="mt-1 text-xs leading-5 text-forest/60">{detail}</p>
      </div>
    </div>
  );
}

function MapStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Sprout;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-black/[0.04] bg-white p-3 shadow-card">
      <Icon className="h-4 w-4 text-leaf" />
      <p className="mt-3 text-xl font-semibold text-forest">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-forest/45">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
