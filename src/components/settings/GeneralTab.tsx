import { useState } from "react";
import { Select } from "../ui/Select";

export function GeneralTab() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("NGN - Nigerian Naira");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12-hour");
  const [defaultRequestView, setDefaultRequestView] = useState("Pending");
  const [defaultOrderView, setDefaultOrderView] = useState("Pending");
  const [defaultPageSize, setDefaultPageSize] = useState("25 rows");

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
              <Select
                label="Default Language"
                options={["English", "French"]}
                value={language}
                onChange={setLanguage}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Regional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                label="Currency"
                options={["NGN - Nigerian Naira", "USD - US Dollar"]}
                value={currency}
                onChange={setCurrency}
              />
            </div>
            <div>
              <Select
                label="Timezone"
                options={["Africa/Lagos", "UTC"]}
                value={timezone}
                onChange={setTimezone}
              />
            </div>
            <div>
              <Select
                label="Date Format"
                options={["DD/MM/YYYY", "MM/DD/YYYY"]}
                value={dateFormat}
                onChange={setDateFormat}
              />
            </div>
            <div>
              <Select
                label="Time Format"
                options={["12-hour", "24-hour"]}
                value={timeFormat}
                onChange={setTimeFormat}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Default Behaviour</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Default Request View"
                options={["Pending", "All", "Completed"]}
                value={defaultRequestView}
                onChange={setDefaultRequestView}
              />
            </div>
            <div>
              <Select
                label="Default Order View"
                options={["Pending", "All", "Dispatched"]}
                value={defaultOrderView}
                onChange={setDefaultOrderView}
              />
            </div>
            <div>
              <Select
                label="Default Page Size"
                options={["25 rows", "50 rows", "100 rows"]}
                value={defaultPageSize}
                onChange={setDefaultPageSize}
              />
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
