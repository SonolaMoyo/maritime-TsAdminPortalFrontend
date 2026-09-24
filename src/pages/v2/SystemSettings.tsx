import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { OverviewTab } from "../../components/settings/OverviewTab";
import { GeneralTab } from "../../components/settings/GeneralTab";
import { CompanyContactTab } from "../../components/settings/CompanyContactTab";
import { NotificationsTab } from "../../components/settings/NotificationsTab";
import { InventorySettingsTab } from "../../components/settings/InventorySettingsTab";
import { SegmentsTab } from "../../components/settings/SegmentsTab";
import { PortalConfigTab } from "../../components/settings/PortalConfigTab";

export function SystemSettings() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderSection = () => {
    switch (activeSection) {
      case "General":
        return <GeneralTab />;
      case "Company & Contact":
        return <CompanyContactTab />;
      case "Notifications":
        return <NotificationsTab />;
      case "Inventory":
        return <InventorySettingsTab />;
      case "Segments":
        return <SegmentsTab />;
      case "Portal Configuration":
        return <PortalConfigTab />;
      default:
        return <OverviewTab onSelect={setActiveSection} />;
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {activeSection && (
              <button 
                onClick={() => setActiveSection(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-line text-[#5b6671] hover:text-ink hover:bg-[#fcfdfa] transition-colors"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-2xl font-black text-ink">System Settings</h1>
          </div>
          <p className="text-[#5b6671] text-[15px] font-medium ml-11">
            Configure your platform and business preferences.
          </p>
        </div>
      </div>

      <div className="min-h-[500px] pt-2">
        {renderSection()}
      </div>
    </div>
  );
}
