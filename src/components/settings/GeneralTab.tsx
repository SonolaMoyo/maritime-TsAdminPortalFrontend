export function GeneralTab() {
  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">General Settings</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Portal Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Portal/Application Name</label>
              <input type="text" defaultValue="Maritama Trading Portal" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Website Name</label>
              <input type="text" defaultValue="Maritama Trading" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Default Language</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>English</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Regional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Currency</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>NGN - Nigerian Naira</option>
                <option>USD - US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Timezone</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>Africa/Lagos</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Date Format</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Time Format</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>12-hour</option>
                <option>24-hour</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Default Behaviour</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Default Request View</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>Pending</option>
                <option>All</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Default Order View</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>Pending</option>
                <option>All</option>
                <option>Dispatched</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Default Page Size</label>
              <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                <option>25 rows</option>
                <option>50 rows</option>
                <option>100 rows</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <input type="checkbox" id="autoRefresh" className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" defaultChecked />
              <label htmlFor="autoRefresh" className="text-sm font-bold text-ink">Enable automatic data refresh</label>
            </div>
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
