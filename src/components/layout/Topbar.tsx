import { Search, Bell } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 min-h-[74px] px-5.5 py-2.5 bg-white/92 backdrop-blur-[16px] border-b border-[#dce5da] grid grid-cols-[minmax(280px,560px)_1fr_auto] gap-3.5 items-center">
      <label className="h-[46px] border border-[#dce5da] rounded-xl bg-white flex items-center gap-2.5 px-3.5">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="search" 
          placeholder="Search orders, clients, products, invoices" 
          className="border-0 outline-0 bg-transparent w-full text-sm"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-0.5 px-2">
        {/* {["All branches", "Lagos Office", "Abuja Branch", "Port Harcourt", "Online Orders"].map((branch, i) => (
          <button 
            key={branch}
            className={`h-[34px] border border-[#dce5da] rounded-full px-3.5 font-[800] text-[13px] whitespace-nowrap cursor-pointer ${i === 0 ? "bg-brand-green text-white border-brand-green" : "bg-white text-[#52606b]"}`}
          >
            {branch}
          </button>
        ))} */}
      </div>

      <div className="flex items-center gap-3 text-[#66727b] font-[750] whitespace-nowrap text-sm pr-4">
        <span className="relative w-9 h-9 border border-[#dce5da] rounded-full grid place-items-center bg-white cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          <i className="absolute -right-1 -top-1.5 min-w-[20px] h-[20px] rounded-full bg-[#e53e3e] text-white text-[11px] grid place-items-center font-black not-italic">
            2
          </i>
        </span>
        <span>Admin · Administrator</span>
      </div>
    </header>
  );
}
