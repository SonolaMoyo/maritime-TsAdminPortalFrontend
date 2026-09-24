import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export function SegmentContentTab() {
  const [activeSegment, setActiveSegment] = useState("Solar Tech");

  const [content, setContent] = useState({
    title: "Maritama Solar Tech",
    intro: "Empowering businesses with scalable, high-efficiency solar energy solutions.",
    capabilities: "Our solar division specializes in grid-tied and hybrid solar installations for commercial and industrial use cases."
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Selector */}
      <div className="w-full lg:w-64 bg-white border border-line rounded-2xl p-4 shadow-sm h-max">
        <h3 className="text-[12px] font-bold text-[#8a949d] uppercase tracking-wider mb-3">Segments</h3>
        <div className="flex flex-col gap-1">
          {["Solar Tech", "Luxe", "EV", "Electronics"].map((seg) => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`text-left px-3 py-2 rounded-lg text-[14px] font-bold transition-colors ${
                activeSegment === seg 
                ? "bg-brand-green text-white" 
                : "text-ink hover:bg-[#fcfdfa]"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 bg-white border border-line rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-ink">{activeSegment} Content</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full border border-line text-[13px] font-bold text-ink hover:bg-[#fcfdfa]">Preview</button>
            <button className="px-4 py-2 rounded-full bg-brand-green text-white text-[13px] font-bold hover:bg-brand-green2">Save Changes</button>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-[13px] font-bold text-ink mb-2">Segment Banner Image</label>
            <div className="border-2 border-dashed border-line rounded-xl h-40 flex flex-col items-center justify-center bg-[#fcfdfa] relative overflow-hidden">
              <ImageIcon className="w-8 h-8 text-[#8a949d] mb-2" />
              <div className="text-[13px] font-bold text-brand-green">Upload Image</div>
              <div className="text-[12px] text-[#8a949d]">1920x400px recommended</div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-2">Display Title</label>
            <input 
              value={content.title}
              onChange={(e) => setContent({...content, title: e.target.value})}
              className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green" 
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-2">Introduction Text</label>
            <textarea 
              rows={3}
              value={content.intro}
              onChange={(e) => setContent({...content, intro: e.target.value})}
              className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green resize-y" 
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-2">Capabilities / Why Choose Us</label>
            <textarea 
              rows={4}
              value={content.capabilities}
              onChange={(e) => setContent({...content, capabilities: e.target.value})}
              className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green resize-y" 
            />
          </div>

          <div className="pt-6 border-t border-line grid grid-cols-2 gap-4">
            <div className="p-4 border border-line rounded-xl flex justify-between items-center bg-[#fcfdfa]">
              <div>
                <div className="text-[14px] font-bold text-ink mb-1">Product Categories</div>
                <div className="text-[12px] text-[#8a949d]">Manage categories shown on this page</div>
              </div>
              <button className="text-brand-green font-bold text-[13px] hover:underline">Manage</button>
            </div>
            
            <div className="p-4 border border-line rounded-xl flex justify-between items-center bg-[#fcfdfa]">
              <div>
                <div className="text-[14px] font-bold text-ink mb-1">Featured Products</div>
                <div className="text-[12px] text-[#8a949d]">Products highlighted for this segment</div>
              </div>
              <button className="text-brand-green font-bold text-[13px] hover:underline">Manage</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
