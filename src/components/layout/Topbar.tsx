import { Search, Menu } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 min-h-[64px] sm:min-h-[74px] px-3.5 sm:px-5.5 py-2.5 bg-white/95 backdrop-blur-[16px] border-b border-[#dce5da] flex items-center justify-between gap-3">
      {/* Left side: Hamburger button + Search */}
      <div className="flex items-center gap-2.5 flex-1 max-w-[560px] min-w-0">
        {onToggleMobileMenu && (
          <button 
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden w-10 h-10 rounded-xl border border-line flex items-center justify-center text-ink hover:bg-[#f4f7f5] transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>
        )}

        <label className="h-[42px] sm:h-[46px] border border-[#dce5da] rounded-xl bg-white flex items-center gap-2.5 px-3 sm:px-3.5 flex-1 min-w-0 focus-within:border-brand-green transition-colors">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
          <input 
            type="search" 
            placeholder="Search orders, clients, products..." 
            className="border-0 outline-0 bg-transparent w-full text-xs sm:text-sm min-w-0 placeholder:text-gray-400 text-ink"
          />
        </label>
      </div>

      {/* Right side: Bell & User Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 text-[#66727b] font-[750] whitespace-nowrap text-sm flex-shrink-0">
        <NotificationDropdown />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green font-black text-xs flex items-center justify-center border border-brand-green/20">
            AD
          </div>
          <span className="hidden md:inline text-ink text-sm">Admin · Operations</span>
        </div>
      </div>
    </header>
  );
}
