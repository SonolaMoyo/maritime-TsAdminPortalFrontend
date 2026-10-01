import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/utils";
import { 
  LayoutDashboard, 
  Inbox, 
  ShoppingCart, 
  Package, 
  Folder, 
  Shield, 
  Settings 
} from "lucide-react";
import { useSegment } from "../../context/SegmentContext";
import type { ExtendedSegmentType } from "../../context/SegmentContext";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { segment, setSegment } = useSegment();

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

  return (
    <aside className="sticky top-0 h-screen bg-white border-r border-line flex flex-col z-50 w-[270px]">
      {/* Brand Header */}
      <div className="min-h-[74px] p-3.5 px-4.5 border-b border-[#e4ece2] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b9f74e] to-brand-green2 flex-shrink-0 shadow-[0_12px_30px_rgba(0,86,66,0.16)]" />
        <div>
          <b className="block leading-[1.05] tracking-[-0.02em]">Maritama Trading</b>
          <span className="text-[#7a8791] text-xs font-[800]">Operations Portal</span>
        </div>
      </div>

      {/* Segment Selector */}
      <div className="px-4 py-3 border-b border-[#e4ece2]">
        <label className="text-xs font-semibold text-[#8a949d] uppercase tracking-wider mb-1.5 block">Segment:</label>
        <select 
          value={segment}
          onChange={(e) => setSegment(e.target.value as ExtendedSegmentType)}
          className="w-full bg-[#f8faf9] border border-line rounded-lg px-2.5 py-2 text-sm font-bold text-ink focus:outline-none focus:border-brand-green cursor-pointer"
        >
          <option value="All">All</option>
          <option value="Solar Tech">Solar Tech</option>
          <option value="Luxe">Luxe</option>
          <option value="EV">EV</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>

      {/* Primary Navigation */}
      <nav className="p-3.5 px-2 overflow-auto flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isItemActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full min-h-[48px] rounded-[10px] px-3.5 flex items-center gap-3 text-[#5b6671] font-[850] transition-all",
                "hover:bg-[#eef5ed] hover:text-brand-green hover:translate-x-0.5",
                active && "bg-brand-green text-white shadow-[0_10px_28px_rgba(0,86,66,0.22)] hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      <div className="border-t border-[#e4ece2] p-4 grid gap-2.5">
        <div>
          <strong className="block text-ink">Admin</strong>
          <span className="block text-[#8a949d] text-[13px]">Administrator</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="h-[40px] px-4 rounded-full border border-line bg-white font-[800] text-sm hover:-translate-y-0.5 transition-transform shadow-sm cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
