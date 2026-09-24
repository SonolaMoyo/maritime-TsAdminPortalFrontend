import { useState } from "react";
import { Modal } from "../ui/Modal";

export function InventorySettingsTab() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [threshold, setThreshold] = useState(10);
  const [newThreshold, setNewThreshold] = useState(10);
  
  const handleSave = () => {
    if (threshold !== newThreshold) {
      setIsConfirmOpen(true);
    }
  };

  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Inventory Settings</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Stock Thresholds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Low Stock</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8a949d]">units</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Critical Stock</label>
              <div className="relative">
                <input type="number" defaultValue="5" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8a949d]">units</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Out of Stock</label>
              <div className="relative">
                <input type="number" defaultValue="0" disabled className="w-full px-3 py-2 bg-[#f4f7f4] border border-line rounded-xl text-sm text-[#8a949d] cursor-not-allowed" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8a949d]">units</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#5b6671] mt-3 bg-[#fcfdfa] p-3 rounded-xl border border-line">
            Products with available stock at or below this quantity are considered low stock. This is the global default, but individual products can override these thresholds.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Alert Behaviour</h3>
          <div className="space-y-3 max-w-lg">
            <label className="flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-ink">Enable low-stock alerts</span>
                <span className="block text-xs text-[#5b6671]">System will monitor inventory levels against thresholds.</span>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-ink">Show low-stock alerts on dashboard</span>
                <span className="block text-xs text-[#5b6671]">Display active alerts prominently on the main dashboard.</span>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-ink">Send notification when stock reaches threshold</span>
                <span className="block text-xs text-[#5b6671]">Email and in-app notifications will be sent to the configured recipients.</span>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-ink">Notify when product becomes out of stock</span>
                <span className="block text-xs text-[#5b6671]">Immediate alert when stock hits 0.</span>
              </div>
            </label>
          </div>
        </section>

        <div className="pt-6 border-t border-line flex justify-end gap-3">
          <button className="px-5 py-2.5 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors rounded-xl hover:bg-[#fcfdfa]">
            Reset to Default
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
          >
            Save Changes
          </button>
        </div>
      </div>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Update Inventory Threshold?">
        <div className="space-y-4">
          <p className="text-sm text-ink mb-4">
            Changing this value may affect when inventory alerts are generated across all products that use the default threshold.
          </p>
          
          <div className="bg-[#fcfdfa] p-4 rounded-xl border border-line flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">Current</div>
              <div className="font-bold text-ink text-lg">{threshold} units</div>
            </div>
            <div className="text-brand-green text-xl">&rarr;</div>
            <div className="text-right">
              <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">New</div>
              <div className="font-black text-brand-green text-lg">{newThreshold} units</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
          <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink">Cancel</button>
          <button 
            onClick={() => {
              setThreshold(newThreshold);
              setIsConfirmOpen(false);
            }}
            className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold"
          >
            Confirm Change
          </button>
        </div>
      </Modal>
    </div>
  );
}
