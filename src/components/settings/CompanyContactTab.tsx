import { useState } from "react";
import { Upload } from "lucide-react";
import { Modal } from "../ui/Modal";

export function CompanyContactTab() {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Company & Contact</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Company Name</label>
                <input type="text" defaultValue="Maritama Trading" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Company Registration Number</label>
                <input type="text" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Company Description</label>
                <textarea className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green h-24 resize-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#f4f7f4] border border-line rounded-xl flex items-center justify-center">
                    {/* Placeholder for Logo */}
                  </div>
                  <button 
                    onClick={() => setIsLogoModalOpen(true)}
                    className="px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]"
                  >
                    Upload Logo
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5 mt-2">Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f4f7f4] border border-line rounded-xl flex items-center justify-center">
                    {/* Placeholder for Favicon */}
                  </div>
                  <button className="px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
                    Upload Favicon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Primary Phone</label>
              <input type="text" defaultValue="+234 ..." className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Secondary Phone</label>
              <input type="text" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Primary Email</label>
              <input type="email" defaultValue="info@maritama.com" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Sales Email</label>
              <input type="email" defaultValue="sales@maritama.com" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Support Email</label>
              <input type="email" defaultValue="support@maritama.com" className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-ink mb-1.5">Physical Address</label>
              <textarea className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green h-20 resize-none" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Business Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 max-w-2xl">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink w-24">{day}</span>
                <div className="flex items-center gap-2">
                  <input type="time" defaultValue={day === "Sunday" ? "" : "08:00"} className="px-2 py-1 bg-white border border-line rounded text-sm w-24 focus:outline-none focus:border-brand-green" disabled={day === "Sunday"} />
                  <span className="text-[#8a949d]">-</span>
                  <input type="time" defaultValue={day === "Sunday" ? "" : "17:00"} className="px-2 py-1 bg-white border border-line rounded text-sm w-24 focus:outline-none focus:border-brand-green" disabled={day === "Sunday"} />
                </div>
              </div>
            ))}
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

      <Modal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} title="Upload Company Logo">
        <div className="border-2 border-dashed border-line rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#fcfdfa]">
          <div className="w-12 h-12 bg-[#eff5ed] rounded-full flex items-center justify-center text-brand-green mb-4">
            <Upload className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-ink mb-1">Drag & Drop</h4>
          <p className="text-sm text-[#5b6671] mb-4">or</p>
          <button className="px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-gray-50">
            Browse Files
          </button>
          
          <div className="mt-6 pt-6 border-t border-line w-full">
            <p className="text-xs text-[#8a949d] mb-1">Supported formats: PNG, JPG, SVG</p>
            <p className="text-xs text-[#8a949d]">Recommended: Transparent PNG / SVG</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
          <button onClick={() => setIsLogoModalOpen(false)} className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink">Cancel</button>
          <button className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold">Upload</button>
        </div>
      </Modal>
    </div>
  );
}
