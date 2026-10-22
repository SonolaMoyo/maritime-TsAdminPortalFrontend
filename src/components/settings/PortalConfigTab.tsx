import { useState } from "react";
import { Select } from "../ui/Select";

export function PortalConfigTab() {
  const [siteStatus, setSiteStatus] = useState("Live");
  const [defaultReqStatus, setDefaultReqStatus] = useState("New");

  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Portal Configuration</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Public Website</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-line rounded-xl bg-white gap-3">
                <span className="text-sm font-bold text-ink whitespace-nowrap">Website Status</span>
                <div className="w-36">
                  <Select
                    options={["Live", "Maintenance", "Offline"]}
                    value={siteStatus}
                    onChange={setSiteStatus}
                    searchable={false}
                    buttonClassName="py-1 px-2.5 text-xs font-bold text-brand-green bg-[#f4f7f4]"
                  />
                </div>
              </div>
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer bg-[#fcfdfa]">
                <span className="text-sm font-bold text-ink">Allow Quote Requests</span>
                <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer bg-[#fcfdfa]">
                <span className="text-sm font-bold text-ink">Allow Cart / Orders</span>
                <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              </label>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer bg-[#fcfdfa]">
                <span className="text-sm font-bold text-ink">Show Product Prices</span>
                <input type="checkbox" className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer bg-[#fcfdfa]">
                <span className="text-sm font-bold text-ink">Show Out-of-Stock Products</span>
                <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer bg-[#fcfdfa]">
                <span className="text-sm font-bold text-ink">Show Featured Products</span>
                <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Quote Requests</h3>
          <div className="space-y-3 max-w-lg">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Allow customers to submit requests</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Send confirmation to customer</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Create lead automatically</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Notify sales team</span>
            </label>
            
            <div className="pt-4 mt-4 border-t border-dashed border-line">
              <Select
                label="Default Request Status"
                options={["New", "Pending", "Assigned"]}
                value={defaultReqStatus}
                onChange={setDefaultReqStatus}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Product Visibility</h3>
          <div className="space-y-3 max-w-lg">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Show published products</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Show featured products on homepage</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Show related products</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-medium text-ink">Allow brochure downloads</span>
            </label>
          </div>
        </section>

        <div className="pt-6 border-t border-line flex justify-end gap-3">
          <button className="px-5 py-2.5 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors rounded-xl hover:bg-[#fcfdfa]">
            Cancel
          </button>
          <button className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
