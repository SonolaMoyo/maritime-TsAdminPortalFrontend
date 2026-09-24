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
        "relative overflow-hidden rounded-[18px] p-[18px] min-h-[108px] border border-line bg-surface shadow-[0_10px_28px_rgba(8,18,22,0.045)]",
        variant === "accent" && "border-[rgba(210,255,47,0.9)] bg-gradient-to-br from-brand-green to-[#00372e] text-white",
        variant === "lime" && "border-brand-lime bg-brand-lime text-ink",
        className
      )}
    >
      <span className="block opacity-70 text-[13px] font-black uppercase tracking-[0.06em]">
        {title}
      </span>
      <strong className="block text-[34px] leading-none mt-3.5 tracking-[-0.055em]">
        {value}
      </strong>
      <small className="block opacity-70 mt-2 text-sm">{subtitle}</small>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-surface border border-line rounded-[18px] p-5 shadow-[0_10px_28px_rgba(8,18,22,0.045)]", className)}>
      {children}
    </div>
  )
}
