import { useState } from "react";
import { ProductsTab } from "../../components/catalog/ProductsTab";
import { FeaturedTab } from "../../components/catalog/FeaturedTab";
import { SegmentContentTab } from "../../components/catalog/SegmentContentTab";

export function Catalog() {
  const [activeTab, setActiveTab] = useState("Products");

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink mb-1">Catalog</h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">Manage the products and content displayed across the Maritama Trading website.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-6 border-b border-[#e4ece2] mb-6 pb-1">
        {["Products", "Featured Products", "Segment Content"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[14px] font-[800] transition-all whitespace-nowrap ${
              activeTab === tab
                ? "text-brand-green border-b-2 border-brand-green"
                : "text-[#8a949d] hover:text-ink"
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
      </div>
    </div>
  );
}
