export function PortalConfigTab() {
  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Portal Configuration</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Public Website</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-line rounded-xl hover:border-brand-green transition-colors cursor-pointer">
                <span className="text-sm font-bold text-ink">Website Status</span>
                <select className="px-2 py-1 bg-[#f4f7f4] text-brand-green font-bold text-xs rounded border border-transparent focus:outline-none focus:border-brand-green">
                  <option>Live</option>
                  <option>Maintenance</option>
                  <option>Offline</option>
                </select>
              </label>
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
              <label className="block text-sm font-bold text-ink mb-1.5">Default Request Status</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>New</option>
                <option>Pending</option>
                <option>Assigned</option>
              </select>
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
