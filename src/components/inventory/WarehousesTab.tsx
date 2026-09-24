import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { Warehouse } from "../../data/mockInventory";
import { MapPin } from "lucide-react";

export function WarehousesTab() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await inventoryService.getWarehouses();
      setWarehouses(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-12 text-center text-[#8a949d] font-bold border border-line rounded-2xl">Loading Warehouses...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {warehouses.map((wh) => (
        <div key={wh.id} className="bg-white border border-line rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-black text-ink mb-1 group-hover:text-brand-green transition-colors">{wh.name}</h3>
              <div className="flex items-center gap-1.5 text-[13px] text-[#8a949d] font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {wh.location}
              </div>
            </div>
            <div className={`px-2 py-1 rounded-md text-[12px] font-bold ${wh.status === 'Active' ? 'bg-[#f4fce3] text-[#65a30d]' : 'bg-line text-ink'}`}>
              {wh.status}
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#e4ece2]">
            <div className="text-[13px] text-[#5b6671] mb-1"><span className="font-bold text-ink">Manager:</span> {wh.manager}</div>
            <div className="text-[13px] text-[#5b6671]"><span className="font-bold text-ink">Address:</span> {wh.address}</div>
          </div>
          
          <div className="mt-6">
            <button className="w-full py-2.5 rounded-lg border border-line text-[13px] font-black text-ink hover:bg-[#fcfdfa] transition-colors">
              View Inventory
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
