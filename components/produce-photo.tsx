"use client";

import { useEffect, useState } from "react";
import { Listing } from "@/lib/data";

const cachePrefix = "tgtg-unsplash-photo:";

type UnsplashPhoto = {
  urls?: {
    regular?: string;
    small?: string;
  };
  alt_description?: string | null;
  description?: string | null;
};

async function fetchUnsplashPhoto(query: string) {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) return null;

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "1",
    content_filter: "high",
  });

  const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { results?: UnsplashPhoto[] };
  const photo = data.results?.[0];
  const src = photo?.urls?.regular ?? photo?.urls?.small;

  if (!photo || !src) return null;

  return {
    src,
    alt: photo.alt_description ?? photo.description ?? null,
  };
}

export function ProducePhoto({
  listing,
  className,
}: {
  listing: Listing;
  className?: string;
}) {
  const [photo, setPhoto] = useState({
    src: listing.imageFallback,
    alt: listing.imageAlt,
  });

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${cachePrefix}${listing.imageQuery}`;
    const cachedPhoto = window.localStorage.getItem(cacheKey);

    if (cachedPhoto) {
      setPhoto(JSON.parse(cachedPhoto));
      return;
    }

    fetchUnsplashPhoto(listing.imageQuery)
      .then((unsplashPhoto) => {
        if (!unsplashPhoto || cancelled) return;

        const nextPhoto = {
          src: unsplashPhoto.src,
          alt: unsplashPhoto.alt ?? listing.imageAlt,
        };

        window.localStorage.setItem(cacheKey, JSON.stringify(nextPhoto));
        setPhoto(nextPhoto);
      })
      .catch(() => {
        // The fallback image keeps the MVP useful without an API key or network.
      });

    return () => {
      cancelled = true;
    };
  }, [listing.imageAlt, listing.imageFallback, listing.imageQuery]);

  return (
    <img
      src={photo.src}
      alt={photo.alt}
      className={`h-full w-full object-cover ${className ?? ""}`}
      loading="lazy"
    />
  );
}
