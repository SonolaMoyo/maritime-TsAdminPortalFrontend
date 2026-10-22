import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { ProductInventory, InventoryActivity, InventoryReceipt, Warehouse } from "../../data/mockInventory";
import { MetricCard, Panel } from "../ui/Card";
import { useSegment } from "../../context/SegmentContext";
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, PackageCheck } from "lucide-react";

export function OverviewTab() {
  const { segment } = useSegment();
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [activities, setActivities] = useState<InventoryActivity[]>([]);
  const [receipts, setReceipts] = useState<InventoryReceipt[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inv, acts, recs, whs] = await Promise.all([
        inventoryService.getInventory(),
        inventoryService.getActivities(),
        inventoryService.getReceipts(),
        inventoryService.getWarehouses()
      ]);
      setInventory(inv);
      setActivities(acts);
      setReceipts(recs);
      setWarehouses(whs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w.id === id);
    return wh ? wh.name : id;
  };

  const getReceiptProduct = (rec: InventoryReceipt) => {
    if (rec.productName) return rec.productName;
    if (rec.items && rec.items.length > 0) {
      return rec.items.map(i => i.productName).join(", ");
    }
    return "Stock Consignment";
  };

  const getReceiptQty = (rec: InventoryReceipt) => {
    if (typeof rec.quantity === "number") return rec.quantity;
    if (rec.items && rec.items.length > 0) {
      return rec.items.reduce((acc, i) => acc + (i.receivedQuantity || i.expectedQuantity || 0), 0);
    }
    return 0;
  };

  const getReceiptRef = (rec: InventoryReceipt) => {
    return rec.referenceNumber || rec.receiptNumber || rec.id;
  };

  const getReceiptDate = (rec: InventoryReceipt) => {
    const d = rec.date || rec.expectedDate || rec.createdAt;
    if (!d) return "Recent";
    try {
      return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
      return d;
    }
  };

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
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        <MetricCard title="Total Products" value={totalProducts} subtitle="Active Products" />
        <MetricCard title="Total Stock" value={`${totalStock.toLocaleString()} units`} subtitle="Across warehouses" variant="lime" />
        <MetricCard title="Low Stock" value={lowStockCount} subtitle="Requires attention" />
        <MetricCard title="Allocated" value={`${allocatedStock.toLocaleString()} units`} subtitle="Reserved for orders" />
      </div>

      {/* Row 2: Recent Stockings beside Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stockings */}
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-black text-ink">Recent Stockings</h3>
              <p className="text-xs text-[#8a949d] font-medium">Latest stock receipts added to warehouse pile</p>
            </div>
            <span className="text-xs font-bold text-brand-green bg-[#eaf4ea] px-2.5 py-1 rounded-full">
              Latest 5
            </span>
          </div>

          <div className="space-y-3">
            {receipts.slice(0, 5).map((rec) => {
              const prodName = getReceiptProduct(rec);
              const refNo = getReceiptRef(rec);
              const whName = getWarehouseName(rec.warehouseId);
              const qty = getReceiptQty(rec);
              const dateStr = getReceiptDate(rec);

              return (
                <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-[#fcfdfa] border border-line hover:border-brand-green/30 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#eaf4ea] text-brand-green flex items-center justify-center shrink-0">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-ink text-[14px] truncate">{prodName}</div>
                      <div className="text-[12px] text-[#8a949d] flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-ink/80">{refNo}</span>
                        <span>•</span>
                        <span>{whName}</span>
                        <span>•</span>
                        <span>{dateStr}</span>
                      </div>
                      {rec.description && (
                        <div className="text-[11px] text-[#5b6671] truncate italic mt-0.5 max-w-[320px]">
                          "{rec.description}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-black bg-[#eaf4ea] text-brand-green">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      +{qty}
                    </span>
                  </div>
                </div>
              );
            })}
            {receipts.length === 0 && (
              <div className="p-8 text-center text-[#8a949d] font-semibold text-sm">
                No recent stockings recorded yet.
              </div>
            )}
          </div>
        </Panel>

        {/* Recent Activities */}
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-black text-ink">Recent Activity</h3>
              <p className="text-xs text-[#8a949d] font-medium">Live warehouse actions & stock updates</p>
            </div>
            <span className="text-xs font-bold text-[#5b6671] bg-[#f8faf7] px-2.5 py-1 rounded-full border border-line">
              Audit log
            </span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="flex gap-3 p-3 rounded-xl bg-[#fcfdfa] border border-line hover:border-brand-green/30 transition-all">
                <div className="mt-0.5 shrink-0">
                  {act.type === "Received" || act.type === "Stock Received" ? (
                    <div className="w-8 h-8 rounded-xl bg-[#f4fce3] flex items-center justify-center text-[#65a30d]">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                  ) : act.type === "Transfer" || act.type === "Transfer Initiated" ? (
                    <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  ) : act.type === "Allocation" ? (
                    <div className="w-8 h-8 rounded-xl bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#fcfdfa] border border-line flex items-center justify-center text-[#8a949d]">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8a949d] mb-0.5">
                    <span>{act.warehouse}</span>
                    <span>{new Date(act.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-[13px] font-bold text-ink leading-snug">{act.description}</div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="p-8 text-center text-[#8a949d] font-semibold text-sm">
                No recent activities found.
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* Row 3: Inventory Health and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {/* "View All Alerts" button removed per user request */}
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
            {filteredInv.filter(i => i.status !== "Healthy").length === 0 && (
              <div className="p-8 text-center text-brand-green font-bold text-sm">
                All inventory levels are currently healthy!
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
