const NEWARK_BOUNDARY_URL =
  "https://nominatim.openstreetmap.org/search?city=Newark&state=New%20Jersey&country=United%20States&format=geojson&polygon_geojson=1&limit=1";

export const revalidate = 86400;

export async function GET() {
  try {
    const response = await fetch(NEWARK_BOUNDARY_URL, {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": "The Bodega Project Newark map prototype",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error(`OpenStreetMap boundary lookup returned ${response.status}`);
    }

    const collection = await response.json();

    if (!Array.isArray(collection.features) || collection.features.length === 0) {
      throw new Error("OpenStreetMap boundary lookup returned no Newark feature");
    }

    return Response.json(
      {
        type: "FeatureCollection",
        features: collection.features,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    console.error("Unable to load Newark boundary", error);
    return Response.json({ error: "Unable to load Newark boundary" }, { status: 502 });
  }
}
