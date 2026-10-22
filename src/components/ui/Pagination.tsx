import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 5,
  onPageChange,
  className
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(totalItems, currentPage * pageSize);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#7a8791] font-semibold bg-white select-none",
        className
      )}
    >
      <div>
        Showing <span className="font-bold text-ink">{from}</span> to{" "}
        <span className="font-bold text-ink">{to}</span> of{" "}
        <span className="font-bold text-ink">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="h-8 px-2.5 rounded-lg border border-line bg-white text-ink hover:bg-[#f8faf7] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold gap-1 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 text-[#a0abb5] font-bold">
                  ...
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "min-w-[32px] h-8 px-2 rounded-lg font-[850] text-xs transition-all flex items-center justify-center cursor-pointer",
                  isCurrent
                    ? "bg-brand-green text-white shadow-sm ring-1 ring-brand-green"
                    : "border border-line bg-white text-[#5b6671] hover:bg-[#f8faf7] hover:text-ink"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="h-8 px-2.5 rounded-lg border border-line bg-white text-ink hover:bg-[#f8faf7] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold gap-1 cursor-pointer"
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-xs">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
