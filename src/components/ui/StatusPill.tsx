import { cn } from "../../utils/utils";

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const value = String(status || "").toLowerCase();
  
  let variantClass = "bg-[#eff5ed] text-brand-green"; 
  
  if (value === "paid" || value === "completed" || value === "delivered" || value === "won") {
    variantClass = "bg-[#eff5ed] text-brand-green"; 
  } else if (value.includes("unpaid") || value.includes("awaiting") || value.includes("warn") || value.includes("low")) {
    variantClass = "bg-[#fff1f1] text-[#a11f1f]";
  } else if (value.includes("failed") || value.includes("cancel") || value.includes("danger") || value === "lost") {
    variantClass = "bg-[#fff1f1] text-[#a11f1f]";
  } else if (value === "new" || value === "assigned") {
    variantClass = "bg-[#f0f4f8] text-[#334e68]"; // blue-gray
  } else if (value === "contacted" || value === "quote sent" || value === "negotiation") {
    variantClass = "bg-[#fff8e6] text-[#996600]"; // yellow-amber
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-h-[30px] px-3 rounded-full text-[12px] font-black capitalize",
        variantClass,
        className
      )}
    >
      {status || "pending"}
    </span>
  );
}
