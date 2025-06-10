import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as React from "react";

export function AdminBadge() {
  const [show, setShow] = React.useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <Badge
        variant="outline"
        className="ml-1 px-1.5 py-0.5 bg-red-600/90 text-white border-red-600 flex items-center gap-1 cursor-pointer"
        title="Admin"
        aria-label="Admin"
      >
        <ShieldCheck className="h-3 w-3" />
      </Badge>
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white shadow-lg select-none">
          (Admin)
        </span>
      )}
    </div>
  );
}
