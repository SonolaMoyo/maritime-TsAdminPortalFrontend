import type { ReactNode } from "react";
import { cn } from "../../utils/utils";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export function Table({ headers, children }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="py-3 px-3.5 border-b border-line text-[#85929c] font-black text-[13px] tracking-[0.03em] uppercase bg-[#fcfdfa] whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr className={cn("border-b border-line hover:bg-black/[0.02] transition-colors", className)} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <td className={cn("py-3.5 px-3.5 align-middle", className)} onClick={onClick}>
      {children}
    </td>
  );
}
