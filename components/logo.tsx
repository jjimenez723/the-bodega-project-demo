import Image from "next/image";
import logo from "@/app/icon.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={logo}
        alt="The Bodega Project"
        className="h-12 w-12 rounded-full object-cover shadow-sm"
        priority
      />
      {!compact && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-leaf">
            The
          </p>
          <p className="-mt-0.5 text-sm font-black tracking-tight text-forest">
            Bodega Project
          </p>
        </div>
      )}
    </div>
  );
}
