"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { CropCategory, Listing } from "@/lib/data";

export function AddHarvestModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (listing: Listing) => void;
}) {
  const [donation, setDonation] = useState(true);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const produce = String(form.get("produce"));
    onAdd({
      id: Date.now(),
      name: produce,
      category: String(form.get("category")) as CropCategory,
      quantity: String(form.get("quantity")),
      location: String(form.get("location")),
      distance: "0.1 mi",
      available: "Just added",
      price: donation ? null : Number(form.get("price")) || 0,
      sourceType: "Community listing",
      accent: "bg-[#DDEFD5]",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="w-full max-w-lg rounded-t-[2rem] bg-cream p-5 shadow-2xl sm:rounded-[2rem]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-leaf">Grow the grid</p>
            <h2 className="mt-1 text-2xl font-black text-forest">Add your harvest</h2>
            <p className="mt-1 text-sm text-forest/55">Share surplus with neighbors nearby.</p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest transition hover:bg-mint"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-forest">Produce type</label>
            <input
              required
              name="produce"
              placeholder="e.g. Fresh collard greens"
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-forest/25 focus:border-leaf"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-forest">Quantity</label>
              <input
                required
                name="quantity"
                placeholder="e.g. 5 lbs"
                className="w-full rounded-xl border border-sand bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-forest/25 focus:border-leaf"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-forest">Category</label>
              <select
                name="category"
                className="w-full rounded-xl border border-sand bg-white px-3.5 py-3 text-sm outline-none transition focus:border-leaf"
              >
                <option value="greens">Greens</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="herbs">Herbs</option>
                <option value="roots">Roots</option>
                <option value="fruit">Fruit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-forest">Pickup location</label>
            <input
              required
              name="location"
              placeholder="e.g. Springfield Ave Community Garden"
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-forest/25 focus:border-leaf"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-forest">Exchange type</label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setDonation(true)}
                className={`rounded-lg px-3 py-2.5 text-xs font-black transition ${
                  donation ? "bg-mint text-leaf" : "text-forest/45"
                }`}
              >
                Free donation
              </button>
              <button
                type="button"
                onClick={() => setDonation(false)}
                className={`rounded-lg px-3 py-2.5 text-xs font-black transition ${
                  !donation ? "bg-[#F5E8C8] text-[#815B1B]" : "text-forest/45"
                }`}
              >
                Set a price
              </button>
            </div>
          </div>
          {!donation && (
            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-forest">Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-forest/45">$</span>
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-sand bg-white py-3 pl-7 pr-3.5 text-sm outline-none transition placeholder:text-forest/25 focus:border-leaf"
                />
              </div>
            </div>
          )}
          <button className="mt-2 w-full rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white transition hover:bg-leaf active:scale-[0.99]">
            Add harvest to the grid
          </button>
        </form>
      </div>
    </div>
  );
}
