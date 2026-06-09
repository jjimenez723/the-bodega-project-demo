import { Clock3, MapPin } from "lucide-react";
import { Listing } from "@/lib/data";
import { ProduceIcon } from "@/components/produce-icon";

export function CropCard({ listing }: { listing: Listing }) {
  const donation = listing.price === null;

  return (
    <article className="rounded-[1.35rem] border border-black/[0.04] bg-white p-3.5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex gap-3.5">
        <ProduceIcon category={listing.category} accent={listing.accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forest/45">
                {listing.sourceType}
              </p>
              <h3 className="mt-0.5 text-base font-semibold leading-tight text-forest">
                {listing.name}
              </h3>
            </div>
            <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-forest">
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
            className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
              donation ? "bg-mint text-leaf" : "bg-[#FFF4D8] text-[#7A4F00]"
            }`}
          >
            {donation ? "Free donation" : `$${listing.price?.toFixed(2)}`}
          </span>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-forest/50">
            <Clock3 className="h-3 w-3" />
            {listing.available}
          </p>
        </div>
        <button className="rounded-full bg-leaf px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0077ed] active:scale-95">
          {donation ? "Claim" : "Purchase"}
        </button>
      </div>
    </article>
  );
}
