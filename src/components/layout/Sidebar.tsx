import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/utils";
import { 
  LayoutDashboard, 
  Inbox, 
  ShoppingCart, 
  Package, 
  Folder, 
  Shield, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useSegment } from "../../context/SegmentContext";
import type { ExtendedSegmentType } from "../../context/SegmentContext";
import { Select } from "../ui/Select";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { segment, setSegment } = useSegment();
  // By default in full screen (desktop) it is collapsed with icons showing
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      aliases: ["/v2/dashboard", "/dashboard"],
      icon: LayoutDashboard,
      exact: true
    },
    { 
      name: "Requests", 
      path: "/requests", 
      aliases: ["/v2/requests"],
      icon: Inbox 
    },
    { 
      name: "Orders", 
      path: "/orders", 
      aliases: ["/v2/orders"],
      icon: ShoppingCart 
    },
    { 
      name: "Inventory", 
      path: "/inventory", 
      aliases: ["/v2/inventory"],
      icon: Package 
    },
    { 
      name: "Catalog", 
      path: "/catalog", 
      aliases: ["/v2/catalog"],
      icon: Folder 
    },
    { 
      name: "Roles & Permissions", 
      path: "/roles-permissions", 
      aliases: ["/v2/roles-permissions"],
      icon: Shield 
    },
    { 
      name: "System Settings", 
      path: "/system-settings", 
      aliases: ["/v2/system-settings"],
      icon: Settings 
    },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    const current = location.pathname;
    if (item.exact) {
      return current === "/" || item.aliases?.includes(current);
    }
    if (current === item.path || item.aliases?.includes(current)) return true;
    if (current.startsWith(`${item.path}/`)) return true;
    return item.aliases?.some(alias => current.startsWith(`${alias}/`)) ?? false;
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const renderContent = (collapsed: boolean) => (
    <>
      {/* Brand Header */}
      <div className={cn(
        "min-h-[74px] border-b border-[#e4ece2] flex items-center transition-all",
        collapsed 
          ? "p-3 flex-col justify-center gap-2" 
          : "p-3.5 px-4.5 justify-between gap-3"
      )}>
        <div className={cn("flex items-center gap-3 min-w-0", collapsed && "justify-center")}>
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b9f74e] to-brand-green2 flex-shrink-0 shadow-[0_12px_30px_rgba(0,86,66,0.16)] flex items-center justify-center font-black text-white text-xs select-none cursor-pointer"
            onClick={() => collapsed && setIsCollapsed(false)}
            title={collapsed ? "Click to expand sidebar" : "Maritama Trading"}
          >
            MT
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <b className="block leading-[1.05] tracking-[-0.02em] truncate">Maritama Trading</b>
              <span className="text-[#7a8791] text-xs font-[800] truncate block">Operations Portal</span>
            </div>
          )}
        </div>

        {/* Desktop Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          className={cn(
            "hidden lg:flex items-center justify-center rounded-lg border border-line bg-white text-[#5b6671] hover:text-ink hover:bg-[#f4f7f5] transition-colors shadow-xs flex-shrink-0 cursor-pointer",
            collapsed ? "w-7 h-7 mt-1" : "w-8 h-8"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close button for mobile drawer */}
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6671] hover:text-ink hover:bg-[#f4f7f5] transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Segment Selector */}
      {collapsed ? (
        <div className="py-2.5 px-2 border-b border-[#e4ece2] flex justify-center" title={`Current Segment: ${segment}`}>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-7 rounded-lg bg-[#f8faf9] border border-line flex items-center justify-center text-[10px] font-black text-brand-green tracking-tight hover:bg-[#eef5ed] transition-colors cursor-pointer"
            title={`Active Segment: ${segment} (Click to change)`}
          >
            {segment === "All" ? "ALL" : segment.split(" ")[0].slice(0, 3).toUpperCase()}
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 border-b border-[#e4ece2]">
          <label className="text-xs font-semibold text-[#8a949d] uppercase tracking-wider mb-1.5 block">Segment:</label>
          <Select 
            value={segment}
            onChange={(val) => setSegment(val as ExtendedSegmentType)}
            options={["All", "Solar Tech", "Luxe", "EV", "Electronics"]}
            buttonClassName="bg-[#f8faf9] py-2 font-bold text-ink"
          />
        </div>
      )}

      {/* Primary Navigation */}
      <nav className={cn("overflow-y-auto flex-1 space-y-1.5", collapsed ? "p-2.5" : "p-3.5 px-2")}>
        {navItems.map((item) => {
          const active = isItemActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              title={item.name}
              className={cn(
                "transition-all flex items-center font-[850]",
                collapsed 
                  ? "w-11 h-11 mx-auto rounded-xl justify-center text-[#5b6671] hover:bg-[#eef5ed] hover:text-brand-green" 
                  : "w-full min-h-[48px] rounded-[10px] px-3.5 gap-3 text-[#5b6671] hover:bg-[#eef5ed] hover:text-brand-green hover:translate-x-0.5",
                active && "bg-brand-green text-white shadow-[0_10px_28px_rgba(0,86,66,0.22)] hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      {collapsed ? (
        <div className="border-t border-[#e4ece2] p-2.5 flex flex-col items-center gap-2">
          <div 
            className="w-9 h-9 rounded-full bg-brand-green/10 text-brand-green font-black text-xs flex items-center justify-center border border-brand-green/20"
            title="Admin · Administrator"
          >
            AD
          </div>
          <button 
            type="button"
            onClick={() => {
              if (onClose) onClose();
              navigate('/login');
            }}
            title="Sign out"
            className="w-9 h-9 rounded-xl border border-line bg-white flex items-center justify-center text-[#8a949d] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-t border-[#e4ece2] p-4 grid gap-2.5">
          <div>
            <strong className="block text-ink truncate">Admin</strong>
            <span className="block text-[#8a949d] text-[13px] truncate">Administrator</span>
          </div>
          <button 
            type="button"
            onClick={() => {
              if (onClose) onClose();
              navigate('/login');
            }}
            className="h-[40px] px-4 rounded-full border border-line bg-white font-[800] text-sm hover:-translate-y-0.5 transition-transform shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-[#8a949d]" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Persistent Collapsible Sidebar (defaults to collapsed) */}
      <aside 
        className={cn(
          "hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-white border-r border-line z-30 flex-shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[76px]" : "w-[260px]"
        )}
      >
        {renderContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Panel (Always expanded for readability) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] sm:w-[300px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {renderContent(false)}
      </aside>
    </>
  );
}
