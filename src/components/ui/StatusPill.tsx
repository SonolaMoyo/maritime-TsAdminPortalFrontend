import { cn } from "../../utils/utils";

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const value = String(status || "").toLowerCase();
  
  let variantClass = "bg-[#eff5ed] text-brand-green"; 
  
  if (value === "paid" || value === "completed" || value === "delivered") {
    variantClass = "bg-[#eff5ed] text-brand-green"; 
  } else if (value.includes("unpaid") || value.includes("awaiting") || value.includes("warn") || value.includes("low")) {
    variantClass = "bg-[#fff1f1] text-[#a11f1f]";
  } else if (value.includes("failed") || value.includes("cancel") || value.includes("danger")) {
    variantClass = "bg-[#fff1f1] text-[#a11f1f]";
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
