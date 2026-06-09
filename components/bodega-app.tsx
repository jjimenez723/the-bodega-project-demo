"use client";

import { useEffect, useState } from "react";
import {
  Apple,
  ArrowRight,
  CalendarDays,
  Carrot,
  Check,
  Cherry,
  CircleUserRound,
  Clock3,
  Home,
  LayoutGrid,
  Leaf,
  Map,
  MapPin,
  PackageOpen,
  Plus,
  Sprout,
  X,
} from "lucide-react";
import { AddHarvestModal } from "@/components/add-harvest-modal";
import { CropCard } from "@/components/crop-card";
import { LocalMap } from "@/components/local-map";
import { Logo } from "@/components/logo";
import { HarvestListing, Listing, harvestListings, listings as initialListings } from "@/lib/data";
import { ProduceIcon } from "@/components/produce-icon";
import { ProducePhoto } from "@/components/produce-photo";

type View = "feed" | "map" | "harvest";

export function BodegaApp() {
  const [view, setView] = useState<View>("feed");
  const [modalOpen, setModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  function handleViewChange(newView: View) {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        setView(newView);
      });
    } else {
      setView(newView);
    }
  }

  function addListing(listing: Listing) {
    setListings((current) => [listing, ...current]);
    setToastMessage(`Success: "${listing.name}" added to the grid!`);
    handleViewChange("feed");
  }

  function claimListing(listingId: number) {
    setListings((current) =>
      current.map((item) => {
        if (item.id === listingId) {
          return { ...item, available: "Claimed by you", claimed: true };
        }
        return item;
      })
    );
  }

  return (
    <main className="min-h-screen">
      {toastMessage && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-leaf/20 bg-mint px-5 py-3.5 text-xs font-bold text-leaf shadow-lg backdrop-blur flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sprout className="h-4 w-4 text-leaf animate-bounce" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-leaf/60 hover:text-leaf"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-black/[0.04] px-3 py-1.5 text-[11px] font-medium text-forest/70 sm:block">
              Newark Pilot
            </span>
            <button aria-label="Profile" className="text-forest/55 transition hover:text-forest">
              <CircleUserRound className="h-6 w-6" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-20 pt-5 sm:px-6 lg:pt-7">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1.5">
            <DesktopNav label="Feed" icon={Home} active={view === "feed"} onClick={() => handleViewChange("feed")} />
            <DesktopNav label="Local Map" icon={Map} active={view === "map"} onClick={() => handleViewChange("map")} />
            <DesktopNav
              label="My Harvest"
              icon={PackageOpen}
              active={view === "harvest"}
              onClick={() => handleViewChange("harvest")}
            />
            <div className="mt-8 rounded-[1.35rem] bg-forest p-4 text-white shadow-card">
              <Sprout className="h-5 w-5 text-white/65" />
              <p className="mt-4 text-sm font-semibold">Start growing the grid.</p>
              <p className="mt-1 text-xs leading-5 text-white/60">Share what you have with Newark neighbors.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#69B8FF]"
              >
                Add harvest <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </nav>
        </aside>

        <div className="mx-auto w-full max-w-2xl">
          {view === "feed" && (
            <Feed
              listings={listings}
              onSelectListing={setSelectedListing}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}
          {view === "map" && <LocalMap />}
          {view === "harvest" && <MyHarvest onAdd={() => setModalOpen(true)} />}
        </div>
      </div>

      <button
        aria-label="Add harvest"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-white shadow-float transition hover:bg-forest active:scale-95 sm:right-6 lg:bottom-8 lg:right-8"
      >
        <Plus className="h-7 w-7" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.06] bg-white/80 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-sm justify-around">
          <MobileNav label="Feed" icon={Home} active={view === "feed"} onClick={() => handleViewChange("feed")} />
          <MobileNav label="Local Map" icon={Map} active={view === "map"} onClick={() => handleViewChange("map")} />
          <MobileNav label="My Harvest" icon={PackageOpen} active={view === "harvest"} onClick={() => handleViewChange("harvest")} />
        </div>
      </nav>

      <AddHarvestModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addListing} />

      <CropDetailDrawer listing={selectedListing} onClose={() => setSelectedListing(null)} onClaim={claimListing} />
    </main>
  );
}
function Feed({
  listings,
  onSelectListing,
  activeCategory,
  setActiveCategory,
}: {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}) {
  const filteredListings = activeCategory === "all"
    ? listings
    : listings.filter((l) => l.category === activeCategory);

  return (
    <section className="pb-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-leaf">Fresh around Newark</p>
          <h1 className="mt-1 max-w-xl text-5xl font-semibold tracking-tight text-forest sm:text-6xl">Good food, closer.</h1>
        </div>
      </div>

      {/* Community Impact Card */}
      <div className="relative mt-7 overflow-hidden rounded-[1.75rem] bg-forest p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-leaf/30 to-transparent" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold text-mint/80">Community impact</p>
            <p className="mt-1 text-4xl font-black tracking-tight sm:text-5xl animate-pulse">120 lbs</p>
            <p className="mt-2 text-sm text-mint/60">of CO₂e saved by Newark neighbors this week.</p>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/10 text-mint">
            <Leaf className="h-11 w-11" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Horizontal Category Selectors */}
      <div className="mt-7 flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <CategoryChip
          label="All crops"
          icon={LayoutGrid}
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        <CategoryChip
          label="Greens"
          icon={Leaf}
          active={activeCategory === "greens"}
          onClick={() => setActiveCategory("greens")}
        />
        <CategoryChip
          label="Tomatoes"
          icon={Cherry}
          active={activeCategory === "tomatoes"}
          onClick={() => setActiveCategory("tomatoes")}
        />
        <CategoryChip
          label="Herbs"
          icon={Sprout}
          active={activeCategory === "herbs"}
          onClick={() => setActiveCategory("herbs")}
        />
        <CategoryChip
          label="Roots"
          icon={Carrot}
          active={activeCategory === "roots"}
          onClick={() => setActiveCategory("roots")}
        />
        <CategoryChip
          label="Fruit"
          icon={Apple}
          active={activeCategory === "fruit"}
          onClick={() => setActiveCategory("fruit")}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-forest">Available harvests</h2>
        <p className="text-sm font-medium text-forest/45">{filteredListings.length} nearby</p>
      </div>

      {filteredListings.length > 0 ? (
        <div className="mt-3 space-y-3">
          {filteredListings.map((listing) => (
            <CropCard key={listing.id} listing={listing} onSelect={onSelectListing} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-sand bg-white/40 p-8 text-center">
          <Sprout className="mx-auto h-8 w-8 text-forest/25" />
          <h3 className="mt-3 text-sm font-bold text-forest/65">No harvests available</h3>
          <p className="mt-1 text-xs text-forest/40">Be the first to list a crop in this category!</p>
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Leaf;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-extrabold transition-all duration-200 active:scale-95 ${
        active
          ? "bg-forest border-forest text-white shadow-sm scale-105"
          : "bg-white border-sand text-forest/60 hover:bg-cream hover:text-forest"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function MyHarvest({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="pb-28">
      <p className="text-sm font-semibold text-leaf">My Harvest</p>
      <h1 className="mt-1 text-5xl font-semibold tracking-tight text-forest sm:text-6xl">Share your surplus.</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-forest/60">
        Every extra bunch can become somebody&apos;s dinner. Add what you have and choose whether to donate or sell it.
      </p>

      <div className="mt-7 rounded-[1.75rem] bg-forest p-6 text-white shadow-card">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold text-white/55">Your contribution</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">24 lbs</p>
            <p className="text-xs text-white/55">shared since May</p>
          </div>
          <Sprout className="h-10 w-10 text-white/55" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-xs">
          <span className="text-white/50">Neighbors reached</span>
          <span className="text-right font-black">16 people</span>
          <span className="text-white/50">Active listings</span>
          <span className="text-right font-black">{harvestListings.length} listings</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-forest">Your active harvests</h2>
        <p className="text-xs font-bold text-forest/45">Sample activity</p>
      </div>
      <div className="mt-3 space-y-2.5">
        {harvestListings.map((listing) => (
          <HarvestCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-black/[0.04] bg-white px-5 py-6 text-center shadow-card">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[1rem] bg-mint text-leaf">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h2 className="mt-3 text-base font-semibold text-forest">Have another harvest?</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-forest/50">Add it to the local grid for neighbors nearby.</p>
        <button
          onClick={onAdd}
          className="mt-5 rounded-full bg-leaf px-5 py-3 text-xs font-semibold text-white transition hover:bg-forest"
        >
          Add another harvest
        </button>
      </div>
    </section>
  );
}

function HarvestCard({ listing }: { listing: HarvestListing }) {
  return (
    <article className="rounded-[1.25rem] border border-black/[0.04] bg-white p-3.5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leaf">{listing.status}</p>
          <h3 className="mt-0.5 text-sm font-semibold text-forest">{listing.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-forest">
          {listing.quantity}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-sand/70 pt-3 text-xs text-forest/50">
        <span className="flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {listing.pickupWindow}
        </span>
        <span className="font-semibold text-leaf">{listing.claims} claimed</span>
      </div>
    </article>
  );
}

function DesktopNav({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Home;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-full px-3 py-3 text-sm font-semibold transition ${
        active ? "bg-white text-forest shadow-sm" : "text-forest/50 hover:bg-white/70 hover:text-forest"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={active ? 2.6 : 2} />
      {label}
    </button>
  );
}

function MobileNav({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Home;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[75px] flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold transition ${
        active ? "text-leaf" : "text-forest/40"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.8 : 2} />
      {label}
    </button>
  );
}

function CropDetailDrawer({
  listing,
  onClose,
  onClaim,
}: {
  listing: Listing | null;
  onClose: () => void;
  onClaim: (listingId: number) => void;
}) {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (listing) {
      setClaimed(false);
    }
  }, [listing]);

  if (!listing) return null;

  const donation = listing.price === null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg rounded-t-[2rem] bg-cream p-6 shadow-2xl transition-all duration-300 sm:rounded-[2rem] border-t border-sand sm:border">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-sm transition hover:bg-mint"
        >
          <X className="h-4 w-4" />
        </button>

        {!claimed ? (
          <div>
            <div className="overflow-hidden rounded-[1.4rem] bg-sand shadow-card">
              <div className="h-48 w-full">
                <ProducePhoto listing={listing} />
              </div>
            </div>

            <div className="mt-5 flex gap-4">
              <ProduceIcon category={listing.category} accent={listing.accent} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-leaf">
                  {listing.sourceType}
                </p>
                <h3 className="mt-1 text-2xl font-black text-forest leading-tight">
                  {listing.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-forest/60">
                  <MapPin className="h-3.5 w-3.5 text-leaf" />
                  <span className="truncate">{listing.location}</span>
                  <span className="font-bold text-leaf shrink-0">{listing.distance}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-forest/50">Details</h4>
                <p className="mt-1.5 text-sm leading-6 text-forest/70">
                  This surplus was freshly harvested in Newark. Supporting local growers helps lower food transport emissions and brings organic, highly nutritious food directly to your neighborhood.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-4 border border-sand">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.1em] text-forest/40">Pickup Window</h5>
                  <p className="mt-1 text-xs font-bold text-forest flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5 text-leaf" />
                    {listing.available}
                  </p>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.1em] text-forest/40">Reputation</h5>
                  <p className="mt-1 text-xs font-bold text-forest">5.0 ★ (Verified Grower)</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-sand/70 pt-4 mt-6">
                <div>
                  <span className="text-xs text-forest/55">Value</span>
                  <p className="text-2xl font-black text-forest mt-0.5">
                    {donation ? "Free donation" : `$${listing.price?.toFixed(2)}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setClaimed(true);
                    onClaim(listing.id);
                  }}
                  className="rounded-xl bg-forest px-8 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-leaf active:scale-95"
                >
                  {donation ? "Confirm Claim" : "Confirm Purchase"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-leaf">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-2xl font-black text-forest">
              {donation ? "Harvest Claimed!" : "Purchase Completed!"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-forest/60 max-w-sm mx-auto">
              We&apos;ve reserved <strong className="text-forest font-bold">{listing.quantity} of {listing.name}</strong> for you at <strong className="text-forest font-bold">{listing.location}</strong>. Please show this confirmation to the grower when picking up.
            </p>
            <div className="mt-6 rounded-xl bg-mint/50 border border-leaf/10 p-3 text-xs text-leaf font-bold max-w-xs mx-auto">
              Pickup Ticket ID: #BP-{listing.id.toString().slice(-4)}
            </div>
            <button
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white transition hover:bg-leaf"
            >
              Got it, back to feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
