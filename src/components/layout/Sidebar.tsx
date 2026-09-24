import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../utils/utils";
import { LayoutDashboard, ShoppingCart, CreditCard, TrendingUp, Package, Truck, Calendar, Users, Target, LayoutList, FileText, Settings, Inbox, Folder, Shield } from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Sales", path: "/sales", icon: TrendingUp },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Distribution", path: "/distribution", icon: Truck },
    { name: "Deliveries", path: "/deliveries", icon: Truck },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Referrals", path: "/referrals", icon: Target },
    { name: "Products", path: "/products", icon: LayoutList },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const v2NavItems = [
    { name: "Dashboard", path: "/v2/dashboard", icon: LayoutDashboard },
    { name: "Requests", path: "/v2/requests", icon: Inbox },
    { name: "Orders", path: "/v2/orders", icon: ShoppingCart },
    { name: "Inventory", path: "/v2/inventory", icon: Package },
    { name: "Catalog", path: "/v2/catalog", icon: Folder },
    { name: "Roles & Permissions", path: "/v2/roles-permissions", icon: Shield },
    { name: "System Settings", path: "/v2/system-settings", icon: Settings },
  ];

  return (
    <aside className="sticky top-0 h-screen bg-white border-r border-line flex flex-col z-50 w-[270px]">
      <div className="min-h-[74px] p-3.5 px-4.5 border-b border-[#e4ece2] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b9f74e] to-brand-green2 flex-shrink-0 shadow-[0_12px_30px_rgba(0,86,66,0.16)]" />
        <div>
          <b className="block leading-[1.05] tracking-[-0.02em]">Maritama Trading</b>
          <span className="text-[#7a8791] text-xs font-[800]">Operations Portal</span>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-[#e4ece2]">
        <label className="text-xs font-semibold text-[#8a949d] uppercase tracking-wider mb-1.5 block">Segment:</label>
        <select className="w-full bg-[#f8faf9] border border-line rounded-lg px-2.5 py-2 text-sm font-bold text-ink focus:outline-none focus:border-brand-green cursor-pointer">
          <option value="all">All</option>
          <option value="solar">Solar Tech</option>
          <option value="luxe">Luxe</option>
          <option value="ev">EV</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      <nav className="p-3.5 px-2 overflow-auto flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-full min-h-[48px] rounded-[10px] px-3.5 flex items-center gap-3 text-[#5b6671] font-[850] transition-all",
                "hover:bg-[#eef5ed] hover:text-brand-green hover:translate-x-0.5",
                isActive && "bg-brand-green text-white shadow-[0_10px_28px_rgba(0,86,66,0.22)] hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}

        <hr className="my-4 border-[#e4ece2]" />
        
        <div className="px-3.5 mt-4 mb-2 text-xs font-semibold text-[#8a949d] uppercase tracking-wider">
          V2 Navigation
        </div>
        
        {v2NavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-full min-h-[48px] rounded-[10px] px-3.5 flex items-center gap-3 text-[#5b6671] font-[850] transition-all",
                "hover:bg-[#eef5ed] hover:text-brand-green hover:translate-x-0.5",
                isActive && "bg-brand-green text-white shadow-[0_10px_28px_rgba(0,86,66,0.22)] hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#e4ece2] p-4 grid gap-2.5">
        <div>
          <strong className="block text-ink">Demo Admin</strong>
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
