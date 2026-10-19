import type { ReactNode } from "react";
import { cn } from "../../utils/utils";

interface CardProps {
  title: string;
  value: string | number;
  subtitle: string;
  variant?: "default" | "accent" | "lime";
  className?: string;
}

export function MetricCard({ title, value, subtitle, variant = "default", className }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[18px] p-3.5 sm:p-[18px] min-h-[96px] sm:min-h-[108px] border border-line bg-surface shadow-[0_10px_28px_rgba(8,18,22,0.045)] flex flex-col justify-between",
        variant === "accent" && "border-[rgba(210,255,47,0.9)] bg-gradient-to-br from-brand-green to-[#00372e] text-white",
        variant === "lime" && "border-brand-lime bg-brand-lime text-ink",
        className
      )}
    >
      <span className="block opacity-70 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.06em] truncate">
        {title}
      </span>
      <strong className="block text-[24px] sm:text-[28px] lg:text-[34px] leading-tight my-2 tracking-[-0.04em] truncate">
        {value}
      </strong>
      <small className="block opacity-70 text-xs sm:text-sm line-clamp-1">{subtitle}</small>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-surface border border-line rounded-[18px] p-4 sm:p-5 lg:p-6 shadow-[0_10px_28px_rgba(8,18,22,0.045)]", className)}>
      {children}
    </div>
  );
}
