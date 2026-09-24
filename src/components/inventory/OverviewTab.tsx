import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { ProductInventory, InventoryActivity } from "../../data/mockInventory";
import { MetricCard, Panel } from "../ui/Card";
import { useSegment } from "../../context/SegmentContext";
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle } from "lucide-react";

export function OverviewTab() {
  const { segment } = useSegment();
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [activities, setActivities] = useState<InventoryActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [inv, acts] = await Promise.all([
        inventoryService.getInventory(),
        inventoryService.getActivities()
      ]);
      setInventory(inv);
      setActivities(acts);
      setLoading(false);
    };
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const filteredInv = inventory.filter(i => segment === "All" || i.segment === segment);
  
  const totalProducts = new Set(filteredInv.map(i => i.productId)).size;
  const totalStock = filteredInv.reduce((sum, i) => sum + i.quantity, 0);
  const allocatedStock = filteredInv.reduce((sum, i) => sum + i.allocatedQuantity, 0);
  const lowStockCount = filteredInv.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length;
  
  // Health % mock calculation
  const healthyCount = filteredInv.filter(i => i.status === "Healthy").length;
  const healthyPct = filteredInv.length ? Math.round((healthyCount / filteredInv.length) * 100) : 0;
  const lowPct = filteredInv.length ? Math.round((filteredInv.filter(i => i.status === "Low Stock").length / filteredInv.length) * 100) : 0;
  const outPct = filteredInv.length ? Math.round((filteredInv.filter(i => i.status === "Out of Stock").length / filteredInv.length) * 100) : 0;

  if (loading) return <div className="p-12 text-center text-[#8a949d] font-bold border border-line rounded-2xl">Loading Overview...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard title="Total Products" value={totalProducts} subtitle="Active SKUs" />
        <MetricCard title="Total Stock" value={`${totalStock.toLocaleString()} units`} subtitle="Across warehouses" variant="lime" />
        <MetricCard title="Low Stock" value={lowStockCount} subtitle="Requires attention" />
        <MetricCard title="Incoming" value="4,250 units" subtitle="Expected this week" />
        <MetricCard title="Allocated" value={`${allocatedStock.toLocaleString()} units`} subtitle="Reserved for orders" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel>
            <h3 className="text-lg font-black text-ink mb-4">Inventory Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-[#3b82f6]">Healthy</span>
                  <span>{healthyPct}%</span>
                </div>
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6]" style={{ width: `${healthyPct}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-[#f59e0b]">Low Stock</span>
                  <span>{lowPct}%</span>
                </div>
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-[#f59e0b]" style={{ width: `${lowPct}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-[#ef4444]">Out of Stock</span>
                  <span>{outPct}%</span>
                </div>
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-[#ef4444]" style={{ width: `${outPct}%` }}></div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-ink">Low Stock Alerts</h3>
              <button className="text-brand-green text-sm font-bold hover:underline">View All Alerts</button>
            </div>
            <div className="space-y-0">
              {filteredInv.filter(i => i.status !== "Healthy").map((item, idx) => (
                <div key={item.id} className={`flex items-center justify-between py-3 ${idx !== 0 ? 'border-t border-line' : ''}`}>
                  <div>
                    <div className="font-bold text-ink text-[14px]">{item.productName}</div>
                    <div className="text-[13px] text-[#8a949d]">Available: {item.availableQuantity} • Threshold: {item.reorderThreshold}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[12px] font-bold ${item.status === 'Out of Stock' ? 'bg-[#fef2f2] text-[#ef4444]' : 'bg-[#fffbeb] text-[#f59e0b]'}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div>
          <Panel>
            <h3 className="text-lg font-black text-ink mb-4">Recent Activity</h3>
            <div className="space-y-6">
              {activities.slice(0, 5).map(act => (
                <div key={act.id} className="flex gap-4">
                  <div className="mt-1">
                    {act.type === "Received" ? <div className="w-8 h-8 rounded-full bg-[#f4fce3] flex items-center justify-center text-[#65a30d]"><ArrowDownRight className="w-4 h-4" /></div> :
                     act.type === "Transfer" ? <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]"><RefreshCw className="w-4 h-4" /></div> :
                     act.type === "Allocation" ? <div className="w-8 h-8 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#ef4444]"><ArrowUpRight className="w-4 h-4" /></div> :
                     <div className="w-8 h-8 rounded-full bg-[#fcfdfa] border border-line flex items-center justify-center text-[#8a949d]"><AlertTriangle className="w-4 h-4" /></div>}
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#8a949d] mb-0.5">{new Date(act.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[14px] font-bold text-ink leading-tight mb-1">{act.description}</div>
                    <div className="text-[13px] text-[#5b6671]">{act.warehouse}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
