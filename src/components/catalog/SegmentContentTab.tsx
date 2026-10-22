import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, Download, Trash2, Check, AlertCircle } from "lucide-react";
import { catalogService } from "../../services/catalogService";
import { fileToBase64, validateFileSize, downloadBase64File } from "../../utils/fileUtils";

export function SegmentContentTab() {
  const [activeSegment, setActiveSegment] = useState("Solar Tech");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState({
    title: "Maritime Solar Tech",
    intro: "Empowering businesses with scalable, high-efficiency solar energy solutions.",
    capabilities: "Our solar division specializes in grid-tied and hybrid solar installations for commercial and industrial use cases.",
    bannerImageUrl: ""
  });

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setSaveSuccess(false);
      setBannerError(null);
      const data = await catalogService.getSegmentContent(activeSegment);
      if (data) {
        setContent({
          title: data.title || `Maritime ${activeSegment}`,
          intro: data.intro || "",
          capabilities: data.capabilities || "",
          bannerImageUrl: data.bannerImageUrl || ""
        });
      } else {
        setContent({
          title: `Maritime ${activeSegment}`,
          intro: `Premium commercial solutions for ${activeSegment}.`,
          capabilities: `High-durability installations, enterprise support, and warranties for all ${activeSegment} products.`,
          bannerImageUrl: ""
        });
      }
      setLoading(false);
    };
    loadContent();
  }, [activeSegment]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setBannerError(null);

    const validation = validateFileSize(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setBannerError(validation.error || "File exceeds 5MB limit");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setContent(prev => ({ ...prev, bannerImageUrl: base64 }));
    } catch {
      setBannerError("Failed to encode image as base64");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await catalogService.saveSegmentContent(activeSegment, content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

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
              className={`text-left px-3 py-2 rounded-lg text-[14px] font-bold transition-colors cursor-pointer ${
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-line">
          <div>
            <h2 className="text-xl font-black text-ink">{activeSegment} Content</h2>
            <p className="text-xs text-[#8a949d]">Manage public showcase and marketing banner for this segment.</p>
          </div>
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-brand-green flex items-center gap-1 bg-[#eaf4ea] px-3 py-1.5 rounded-full">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button 
              onClick={handleSave} 
              disabled={saving || loading}
              className="px-5 py-2 rounded-full bg-brand-green text-white text-[13px] font-extrabold hover:bg-brand-green2 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#8a949d] font-semibold">Loading content...</div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {/* Segment Banner Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-bold text-ink">
                  Segment Banner Image <span className="text-xs text-[#8a949d] font-normal">(Max 5MB)</span>
                </label>
                {content.bannerImageUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadBase64File(content.bannerImageUrl, `${activeSegment.toLowerCase().replace(/\s+/g, '-')}-banner.png`)}
                      className="text-xs font-bold text-brand-green flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, bannerImageUrl: "" }))}
                      className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline cursor-pointer ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                )}
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleBannerUpload} 
                accept="image/*" 
                className="hidden" 
              />

              {bannerError && (
                <div className="mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {bannerError}
                </div>
              )}

              {content.bannerImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-line h-48 bg-[#f8faf7] group">
                  <img 
                    src={content.bannerImageUrl} 
                    alt={`${activeSegment} Banner`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-full bg-white text-ink text-xs font-extrabold hover:bg-[#fcfdfa] shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Replace Banner
                    </button>
                    <button 
                      type="button"
                      onClick={() => downloadBase64File(content.bannerImageUrl, `${activeSegment.toLowerCase().replace(/\s+/g, '-')}-banner.png`)}
                      className="px-4 py-2 rounded-full bg-brand-green text-white text-xs font-extrabold hover:bg-brand-green2 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-line rounded-2xl h-44 flex flex-col items-center justify-center bg-[#fcfdfa] hover:bg-[#f8faf7] hover:border-brand-green transition-all cursor-pointer text-center p-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#eaf4ea] text-brand-green flex items-center justify-center mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-[14px] font-bold text-ink">Upload Segment Banner</div>
                  <div className="text-[12px] text-[#8a949d] mt-0.5">PNG, JPG, or WEBP up to 5MB (1920x500px recommended)</div>
                </div>
              )}
            </div>

            {/* Display Title */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">Display Title</label>
              <input 
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-brand-green bg-[#fcfdfa]" 
              />
            </div>

            {/* Intro Text */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">Introduction Text</label>
              <textarea 
                rows={3}
                value={content.intro}
                onChange={(e) => setContent({ ...content, intro: e.target.value })}
                className="w-full border border-line rounded-xl p-3.5 text-sm focus:outline-brand-green bg-[#fcfdfa] resize-y" 
              />
            </div>

            {/* Capabilities */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">Capabilities / Why Choose Us</label>
              <textarea 
                rows={4}
                value={content.capabilities}
                onChange={(e) => setContent({ ...content, capabilities: e.target.value })}
                className="w-full border border-line rounded-xl p-3.5 text-sm focus:outline-brand-green bg-[#fcfdfa] resize-y" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
