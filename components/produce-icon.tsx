import { Apple, Carrot, Cherry, Leaf, Sprout } from "lucide-react";
import { CropCategory } from "@/lib/data";

const icons = {
  greens: Leaf,
  tomatoes: Cherry,
  herbs: Sprout,
  roots: Carrot,
  fruit: Apple,
};

export function ProduceIcon({
  category,
  accent,
  size = "md",
}: {
  category: CropCategory;
  accent: string;
  size?: "md" | "lg";
}) {
  const Icon = icons[category];

  return (
    <div
      className={`${accent} ${
        size === "lg" ? "h-20 w-20 rounded-[1.5rem]" : "h-[74px] w-[74px] rounded-2xl"
      } flex shrink-0 items-center justify-center`}
    >
      <Icon
        className={`${size === "lg" ? "h-10 w-10" : "h-8 w-8"} text-forest`}
        strokeWidth={1.7}
      />
    </div>
  );
}
