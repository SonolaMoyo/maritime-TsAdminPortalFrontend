import { useState } from "react";
import { ProductsTab } from "../../components/catalog/ProductsTab";
import { CategoriesTab } from "../../components/catalog/CategoriesTab";
import { BrandsTab } from "../../components/catalog/BrandsTab";
import { MediaTab } from "../../components/catalog/MediaTab";
import { FeaturedTab } from "../../components/catalog/FeaturedTab";
import { SegmentContentTab } from "../../components/catalog/SegmentContentTab";

export function Catalog() {
  const [activeTab, setActiveTab] = useState("Products");

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink mb-2">Catalog</h1>
          <p className="text-[#5b6671] text-[15px] font-medium">Manage the products and content displayed across the Maritama Trading website.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-6 border-b border-[#e4ece2] mb-6">
        {["Products", "Categories", "Brands", "Media", "Featured Products", "Segment Content"].map((tab) => (
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
        {activeTab === "Categories" && <CategoriesTab />}
        {activeTab === "Brands" && <BrandsTab />}
        {activeTab === "Media" && <MediaTab />}
        {activeTab === "Featured Products" && <FeaturedTab />}
        {activeTab === "Segment Content" && <SegmentContentTab />}
      </div>
    </div>
  );
}
