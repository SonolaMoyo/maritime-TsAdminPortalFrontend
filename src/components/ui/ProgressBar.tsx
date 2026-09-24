import { cn } from "../../utils/utils";

interface ProgressBarProps {
  label: string;
  value: string | number;
  percentage: number;
}

export function ProgressBar({ label, value, percentage }: ProgressBarProps) {
  return (
    <div className="grid gap-1.5">
      <div className="flex justify-between text-[#54606b] text-[14px] font-[750]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-[10px] bg-[#e8eee6] rounded-full overflow-hidden">
        <i
          className="block h-full rounded-full bg-gradient-to-r from-brand-green to-brand-lime"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
}
