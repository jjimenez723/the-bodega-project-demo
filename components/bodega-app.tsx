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
      <header className="sticky top-0 z-30 border-b border-sand/80 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-mint px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-leaf sm:block">
              Newark Pilot
            </span>
            <button aria-label="Profile" className="text-forest/65 transition hover:text-forest">
              <CircleUserRound className="h-7 w-7" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-20 pt-5 sm:px-6 lg:pt-7">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1.5">
            <DesktopNav label="Feed" icon={Home} active={view === "feed"} onClick={() => handleViewChange("feed")} />
            <DesktopNav label="Local Map" icon={Map} active={view === "map"} onClick={() => handleViewChange("map")} />
            <DesktopNav
              label="My Harvest"
              icon={PackageOpen}
              active={view === "harvest"}
              onClick={() => handleViewChange("harvest")}
            />
            <div className="mt-8 rounded-2xl bg-forest p-4 text-white">
              <Sprout className="h-5 w-5 text-mint" />
              <p className="mt-4 text-sm font-extrabold">Start growing the grid.</p>
              <p className="mt-1 text-xs leading-5 text-white/60">Share what you have with Newark neighbors.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 flex items-center gap-1 text-xs font-black text-mint"
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
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-float transition hover:bg-leaf active:scale-95 sm:right-6 lg:bottom-8 lg:right-8"
      >
        <Plus className="h-7 w-7" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-sand bg-cream/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf">Fresh around Newark</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-forest">Good food, closer.</h1>
        </div>
        <button className="hidden text-xs font-black text-leaf sm:block">Filter listings</button>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[1.6rem] bg-forest p-5 text-white shadow-card">
        <div className="absolute -right-9 -top-10 h-36 w-36 rounded-full border-[22px] border-white/5" />
        <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full border-[16px] border-mint/5" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-mint">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Community impact</p>
            <p className="mt-0.5 text-xl font-black">120 lbs of CO₂e saved</p>
            <p className="mt-1 text-xs text-white/60">by Newark neighbors this week</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-forest">Available harvests</h2>
        <p className="text-xs font-bold text-forest/45">{listings.length} nearby</p>
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
      <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf">My Harvest</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-forest">Share your surplus</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-forest/60">
        Every extra bunch can become somebody&apos;s dinner. Add what you have and choose whether to donate or sell it.
      </p>

      <div className="mt-6 rounded-[1.7rem] bg-forest p-5 text-white shadow-card">
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Your contribution</p>
            <p className="mt-2 text-3xl font-black">24 lbs</p>
            <p className="text-xs text-white/55">shared since May</p>
          </div>
          <Sprout className="h-10 w-10 text-mint/70" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-xs">
          <span className="text-white/50">Neighbors reached</span>
          <span className="text-right font-black">16 people</span>
          <span className="text-white/50">Active listings</span>
          <span className="text-right font-black">{harvestListings.length} listings</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-forest">Your active harvests</h2>
        <p className="text-xs font-bold text-forest/45">Sample activity</p>
      </div>
      <div className="mt-3 space-y-2.5">
        {harvestListings.map((listing) => (
          <HarvestCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div className="mt-5 rounded-[1.7rem] border-2 border-dashed border-leaf/20 bg-white/60 px-5 py-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-leaf">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h2 className="mt-3 text-base font-black text-forest">Have another harvest?</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-forest/50">Add it to the local grid for neighbors nearby.</p>
        <button
          onClick={onAdd}
          className="mt-5 rounded-xl bg-forest px-5 py-3 text-xs font-black text-white transition hover:bg-leaf"
        >
          Add another harvest
        </button>
      </div>
    </section>
  );
}

function HarvestCard({ listing }: { listing: HarvestListing }) {
  return (
    <article className="rounded-2xl border border-white bg-white/85 p-3.5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-leaf">{listing.status}</p>
          <h3 className="mt-0.5 text-sm font-extrabold text-forest">{listing.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-cream px-2 py-1 text-xs font-extrabold text-forest">
          {listing.quantity}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-sand/70 pt-3 text-xs text-forest/50">
        <span className="flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {listing.pickupWindow}
        </span>
        <span className="font-bold text-leaf">{listing.claims} claimed</span>
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
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold transition ${
        active ? "bg-white text-forest shadow-card" : "text-forest/50 hover:bg-white/50 hover:text-forest"
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
      className={`flex min-w-[75px] flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-extrabold transition ${
        active ? "text-leaf" : "text-forest/40"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.8 : 2} />
      {label}
    </button>
  );
}
