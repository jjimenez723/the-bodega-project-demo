"use client";

import { FormEvent, useState } from "react";
import { Apple, Carrot, Cherry, Leaf, Sprout, X } from "lucide-react";
import { CropCategory, Listing } from "@/lib/data";

const categories: { value: CropCategory; label: string; icon: typeof Leaf; accent: string }[] = [
  { value: "greens", label: "Greens", icon: Leaf, accent: "bg-[#DDEFD5]" },
  { value: "tomatoes", label: "Tomatoes", icon: Cherry, accent: "bg-[#F8D8C7]" },
  { value: "herbs", label: "Herbs", icon: Sprout, accent: "bg-[#D8ECE0]" },
  { value: "roots", label: "Roots", icon: Carrot, accent: "bg-[#F3E3C1]" },
  { value: "fruit", label: "Fruit", icon: Apple, accent: "bg-[#F3DBD8]" },
];

const categoryPhotos: Record<CropCategory, Pick<Listing, "imageQuery" | "imageFallback" | "imageAlt">> = {
  greens: {
    imageQuery: "fresh leafy greens produce",
    imageFallback:
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh leafy greens",
  },
  tomatoes: {
    imageQuery: "fresh tomatoes produce",
    imageFallback:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh tomatoes",
  },
  herbs: {
    imageQuery: "fresh herbs produce",
    imageFallback:
      "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh herbs",
  },
  roots: {
    imageQuery: "root vegetables produce",
    imageFallback:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh root vegetables",
  },
  fruit: {
    imageQuery: "fresh fruit produce",
    imageFallback:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh fruit",
  },
};

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
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>("greens");

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const produce = String(form.get("produce"));
    const quantity = String(form.get("quantity"));
    const location = String(form.get("location"));
    const pickupWindow = String(form.get("pickupWindow"));

    const catObj = categories.find((c) => c.value === selectedCategory);

    onAdd({
      id: Date.now(),
      name: produce,
      category: selectedCategory,
      quantity,
      location,
      distance: "0.1 mi",
      available: pickupWindow || "Available now",
      price: donation ? null : Number(form.get("price")) || 0,
      sourceType: "Community listing",
      accent: catObj?.accent || "bg-[#DDEFD5]",
      ...categoryPhotos[selectedCategory],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="w-full max-w-lg rounded-t-[2rem] bg-cream p-6 shadow-2xl sm:rounded-[2rem] border-t border-sand sm:border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2rem] text-leaf">Grow the grid</p>
            <h2 className="mt-1 text-2xl font-black text-forest">Add your harvest</h2>
            <p className="mt-1 text-sm text-forest/55">Share surplus with neighbors nearby.</p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-sm transition hover:bg-mint"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
              <label className="mb-1.5 block text-xs font-extrabold text-forest">Pickup Window</label>
              <input
                required
                name="pickupWindow"
                placeholder="e.g. Today, 4-7 PM"
                className="w-full rounded-xl border border-sand bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-forest/25 focus:border-leaf"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-forest">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? `${cat.accent} border-leaf text-forest shadow-sm scale-105`
                        : "border-sand bg-white text-forest/65 hover:bg-cream"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                );
              })}
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
                className={`rounded-lg px-3 py-2.5 text-xs font-black transition-all ${
                  donation ? "bg-mint text-leaf shadow-sm" : "text-forest/45 hover:text-forest"
                }`}
              >
                Free donation
              </button>
              <button
                type="button"
                onClick={() => setDonation(false)}
                className={`rounded-lg px-3 py-2.5 text-xs font-black transition-all ${
                  !donation ? "bg-[#F5E8C8] text-[#815B1B] shadow-sm" : "text-forest/45 hover:text-forest"
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

          <button className="mt-2 w-full rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white transition hover:bg-leaf active:scale-[0.99] shadow-md">
            Add harvest to the grid
          </button>
        </form>
      </div>
    </div>
  );
}
