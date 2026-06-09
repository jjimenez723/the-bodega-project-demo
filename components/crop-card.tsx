import { Clock3, MapPin } from "lucide-react";
import { Listing } from "@/lib/data";
import { ProducePhoto } from "@/components/produce-photo";

export function CropCard({
  listing,
  onSelect,
}: {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
}) {
  const donation = listing.price === null;

  return (
    <article
      onClick={() => !listing.claimed && onSelect?.(listing)}
      className={`group relative rounded-[1.4rem] border border-white/80 bg-white/90 p-3.5 shadow-card transition-all duration-300 ${
        listing.claimed
          ? "opacity-60 cursor-default"
          : "cursor-pointer hover:-translate-y-0.5 hover:border-leaf/20 hover:shadow-lg active:scale-[0.99]"
      }`}
    >
      <div className="flex gap-3.5">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-sand">
          <ProducePhoto listing={listing} />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/50" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-leaf">
                {listing.sourceType}
              </p>
              <h3 className="mt-0.5 text-base font-extrabold leading-tight text-forest group-hover:text-leaf transition-colors duration-200">
                {listing.name}
              </h3>
            </div>
            <span className="shrink-0 rounded-full bg-cream px-2 py-1 text-xs font-extrabold text-forest">
              {listing.quantity}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-forest/60">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{listing.location}</span>
            <span className="shrink-0 font-semibold text-leaf">{listing.distance}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-sand/70 pt-3">
        <div>
          <span
            className={`inline-block rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
              listing.claimed
                ? "bg-sand text-forest/50"
                : donation
                ? "bg-mint text-leaf"
                : "bg-[#F5E8C8] text-[#815B1B]"
            }`}
          >
            {listing.claimed ? "Claimed" : donation ? "Free donation" : `$${listing.price?.toFixed(2)}`}
          </span>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-forest/50">
            <Clock3 className="h-3 w-3" />
            {listing.claimed ? "Completed" : listing.available}
          </p>
        </div>
        <button
          disabled={listing.claimed}
          onClick={(e) => {
            e.stopPropagation(); // Avoid double click trigger
            if (!listing.claimed) onSelect?.(listing);
          }}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 ${
            listing.claimed
              ? "bg-sand text-forest/40 cursor-not-allowed"
              : "bg-forest text-white hover:bg-leaf active:scale-95 group-hover:bg-leaf"
          }`}
        >
          {listing.claimed ? "Claimed" : donation ? "Claim" : "Purchase"}
        </button>
      </div>
    </article>
  );
}
