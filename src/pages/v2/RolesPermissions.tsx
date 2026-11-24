import { useState } from "react";
import { UsersTab } from "../../components/roles/UsersTab";

export function RolesPermissions() {
  const [activeTab] = useState("Users");

  const tabs = [
    { id: "Users", label: "Users", enabled: true },
    { id: "Roles", label: "Roles", enabled: false },
    { id: "Permissions", label: "Permissions", enabled: false },
    { id: "Activity Logs", label: "Activity Logs", enabled: false },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink mb-1">Roles & Permissions</h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">
            Manage who can access the Admin Portal, their roles, and system permissions.
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-[#e4ece2] mb-6 pb-3">
        {tabs.map((tab) => {
          if (!tab.enabled) {
            return (
              <div key={tab.id} className="relative group inline-block">
                <button
                  type="button"
                  disabled={true}
                  title="Feature coming soon"
                  className="px-4 py-2 rounded-xl font-[800] text-[13px] sm:text-[14px] whitespace-nowrap transition-all border bg-[#f3f4f6] text-[#9ca3af] border-[#e5e7eb] cursor-not-allowed opacity-60 inline-flex items-center gap-2 select-none"
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e5e7eb] text-[#6b7280]">
                    Coming soon
                  </span>
                </button>
                {/* Hover Caption Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30">
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-[#1e293b] shadow-lg rounded-md font-semibold">
                    Feature coming soon
                  </span>
                  <div className="w-2 h-2 -mt-1 rotate-45 bg-[#1e293b]"></div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              className="px-4 py-2 rounded-xl font-[800] text-[13px] sm:text-[14px] whitespace-nowrap transition-all border bg-brand-green text-white border-brand-green shadow-sm ring-2 ring-brand-green/20 cursor-pointer"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {activeTab === "Users" && <UsersTab />}
      </div>
    </div>
  );
}
