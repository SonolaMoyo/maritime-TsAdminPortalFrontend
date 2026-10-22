import { useState } from "react";
import { ProductsTab } from "../../components/catalog/ProductsTab";
import { FeaturedTab } from "../../components/catalog/FeaturedTab";
import { SegmentContentTab } from "../../components/catalog/SegmentContentTab";
import { MediaTab } from "../../components/catalog/MediaTab";

export function Catalog() {
  const [activeTab, setActiveTab] = useState("Products");

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink mb-1">Catalog</h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">Manage the products, media assets and segment content across Maritime Trading.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-[#e4ece2] mb-6 pb-3">
        {["Products", "Featured Products", "Segment Content", "Media Library"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-[800] text-[13px] sm:text-[14px] whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-brand-green text-white border-brand-green shadow-sm ring-2 ring-brand-green/20"
                : "bg-white text-[#5b6671] border-line hover:border-brand-green/40 hover:bg-[#f8faf7] hover:text-ink shadow-xs cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === "Products" && <ProductsTab />}
        {activeTab === "Featured Products" && <FeaturedTab />}
        {activeTab === "Segment Content" && <SegmentContentTab />}
        {activeTab === "Media Library" && <MediaTab />}
      </div>
    </div>
  );
}
