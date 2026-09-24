import { useState } from "react";
import { UsersTab } from "../../components/roles/UsersTab";
import { RolesTab } from "../../components/roles/RolesTab";
import { PermissionsTab } from "../../components/roles/PermissionsTab";
import { AuditLogTab } from "../../components/roles/AuditLogTab";

export function RolesPermissions() {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink mb-2">Roles & Permissions</h1>
          <p className="text-[#5b6671] text-[15px] font-medium">
            Manage who can access the Admin Portal, their roles, and system permissions.
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-6 border-b border-[#e4ece2] mb-6">
        {["Users", "Roles", "Permissions", "Activity / Audit Log"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[14px] font-[800] transition-all whitespace-nowrap ${
              activeTab === tab
                ? "text-brand-green border-b-2 border-brand-green"
                : "text-[#8a949d] hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === "Users" && <UsersTab />}
        {activeTab === "Roles" && <RolesTab />}
        {activeTab === "Permissions" && <PermissionsTab />}
        {activeTab === "Activity / Audit Log" && <AuditLogTab />}
      </div>
    </div>
  );
}
