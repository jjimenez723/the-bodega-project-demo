import Image from "next/image";
import logo from "@/app/icon.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={logo}
        alt="The Bodega Project"
        className="h-10 w-10 rounded-full object-cover shadow-sm border border-sand/50"
        priority
      />
      {!compact && (
        <div>
          <p className="text-[13px] font-semibold tracking-tight text-forest">
            Bodega Project
          </p>
        </div>
      )}
    </div>
  );
}
