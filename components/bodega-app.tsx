"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleUserRound,
  Clock3,
  Home,
  Leaf,
  Map,
  PackageOpen,
  Plus,
  Sprout,
} from "lucide-react";
import { AddHarvestModal } from "@/components/add-harvest-modal";
import { CropCard } from "@/components/crop-card";
import { LocalMap } from "@/components/local-map";
import { Logo } from "@/components/logo";
import { HarvestListing, Listing, harvestListings, listings as initialListings } from "@/lib/data";

type View = "feed" | "map" | "harvest";

export function BodegaApp() {
  const [view, setView] = useState<View>("feed");
  const [modalOpen, setModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>(initialListings);

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
    handleViewChange("feed");
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
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
          {view === "feed" && <Feed listings={listings} />}
          {view === "map" && <LocalMap />}
          {view === "harvest" && <MyHarvest onAdd={() => setModalOpen(true)} />}
        </div>
      </div>

      <button
        aria-label="Add harvest"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-white shadow-float transition hover:bg-[#0077ed] active:scale-95 sm:right-6 lg:bottom-8 lg:right-8"
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
    </main>
  );
}

function Feed({ listings }: { listings: Listing[] }) {
  return (
    <section className="pb-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-leaf">Fresh around Newark</p>
          <h1 className="mt-1 max-w-xl text-5xl font-semibold tracking-tight text-forest sm:text-6xl">Good food, closer.</h1>
        </div>
        <button className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-leaf shadow-sm sm:block">Filter</button>
      </div>

      <div className="relative mt-7 overflow-hidden rounded-[1.75rem] bg-white p-6 text-forest shadow-card sm:p-8">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-mint/70 to-transparent" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold text-forest/50">Community impact</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">120 lbs</p>
            <p className="mt-2 text-sm text-forest/55">of CO2e saved by Newark neighbors this week.</p>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-forest text-white">
            <Leaf className="h-11 w-11" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-forest">Available harvests</h2>
        <p className="text-sm font-medium text-forest/45">{listings.length} nearby</p>
      </div>
      <div className="mt-3 space-y-3">
        {listings.map((listing) => (
          <CropCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
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
          className="mt-5 rounded-full bg-leaf px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#0077ed]"
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
