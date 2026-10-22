import { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, Layers } from "lucide-react";
import { useSegment } from "../../context/SegmentContext";
import { OverviewTab } from "../../components/inventory/OverviewTab";
import { ProductsTab } from "../../components/inventory/ProductsTab";
import { WarehousesTab } from "../../components/inventory/WarehousesTab";
import { TransfersTab } from "../../components/inventory/TransfersTab";
import { ReceiveStockTab } from "../../components/inventory/ReceiveStockTab";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { inventoryService } from "../../services/inventoryService";
import type { ProductInventory, Warehouse } from "../../data/mockInventory";

export function InventoryV2() {
  const { segment } = useSegment();
  const [activeTab, setActiveTab] = useState("Overview");

  // Live data for modals & selection
  const [inventoryList, setInventoryList] = useState<ProductInventory[]>([]);
  const [warehousesList, setWarehousesList] = useState<Warehouse[]>([]);

  // Receive Modal states
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    productId: "",
    productName: "",
    warehouseId: "",
    quantity: 10,
    reference: "",
    description: "",
  });

  const loadBaseData = async () => {
    try {
      const [inv, whs] = await Promise.all([
        inventoryService.getInventory(),
        inventoryService.getWarehouses()
      ]);
      setInventoryList(inv);
      setWarehousesList(whs);

      // Initialize default selections if empty
      if (inv.length > 0 && !receiveForm.productId) {
        const first = inv[0];
        setReceiveForm(prev => ({
          ...prev,
          productId: first.productId,
          productName: first.productName,
          warehouseId: prev.warehouseId || first.warehouseId || whs[0]?.id || "",
          reference: prev.reference || `REC-${Math.floor(100000 + Math.random() * 900000)}`
        }));
      } else if (whs.length > 0 && !receiveForm.warehouseId) {
        setReceiveForm(prev => ({ ...prev, warehouseId: whs[0].id }));
      }
    } catch (e) {
      console.error("Error loading base inventory data:", e);
    }
  };

  useEffect(() => {
    loadBaseData();

    const handleUpdate = () => {
      loadBaseData();
    };
    window.addEventListener("inventory-updated", handleUpdate);
    return () => window.removeEventListener("inventory-updated", handleUpdate);
  }, []);

  // Distinct products from inventory list
  const distinctProducts = Array.from(
    new Map(
      inventoryList.map(item => [item.productId, { id: item.productId, name: item.productName, segment: item.segment }])
    ).values()
  );

  // When opening modal, refresh reference number
  const handleOpenReceiveModal = () => {
    const selectedProd = distinctProducts.find(p => p.id === receiveForm.productId) || distinctProducts[0];
    const selectedWh = warehousesList.find(w => w.id === receiveForm.warehouseId) || warehousesList[0];

    setReceiveForm({
      productId: selectedProd ? selectedProd.id : "",
      productName: selectedProd ? selectedProd.name : "",
      warehouseId: selectedWh ? selectedWh.id : "",
      quantity: 10,
      reference: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      description: "",
    });
    setIsReceiveModalOpen(true);
  };

  // Find loaded product details
  const selectedProductInfo = distinctProducts.find(p => p.id === receiveForm.productId);
  const selectedProductInventories = inventoryList.filter(i => i.productId === receiveForm.productId);
  const totalExistingStock = selectedProductInventories.reduce((acc, i) => acc + i.quantity, 0);

  // Existing pile in the chosen warehouse
  const currentWarehouseRecord = inventoryList.find(
    i => i.productId === receiveForm.productId && i.warehouseId === receiveForm.warehouseId
  );
  const currentWarehouseQty = currentWarehouseRecord ? currentWarehouseRecord.quantity : 0;
  const currentWarehouseAvailable = currentWarehouseRecord ? currentWarehouseRecord.availableQuantity : 0;

  const handleReceiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveForm.productId || !receiveForm.warehouseId) return;

    setIsReceiving(true);
    try {
      await inventoryService.receiveStock(
        currentWarehouseRecord?.id,
        Number(receiveForm.quantity),
        receiveForm.reference,
        receiveForm.description,
        receiveForm.productId,
        receiveForm.warehouseId
      );
      setIsReceiveModalOpen(false);
      window.dispatchEvent(new Event("inventory-updated"));
    } catch (err) {
      console.error("Receive stock error:", err);
    } finally {
      setIsReceiving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">
            Inventory {segment !== "All" && <span className="text-brand-green">— {segment}</span>}
          </h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">
            Monitor stock levels, warehouse activity and inventory movements.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Transfer Stock button removed as requested */}
          <button 
            onClick={handleOpenReceiveModal}
            className="flex-1 sm:flex-initial h-[42px] sm:h-[44px] px-5 rounded-full bg-brand-green text-white font-[800] text-[13px] sm:text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>
        </div>
      </div>

      {/* Tabs navigation: Suppliers and Reports hidden per user request */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#e4ece2] mb-6 pb-3">
        {["Overview", "Products", "Warehouses", "Transfers", "Receive Stock"].map((tab) => (
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

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Products" && <ProductsTab />}
        {activeTab === "Warehouses" && <WarehousesTab />}
        {activeTab === "Transfers" && <TransfersTab />}
        {activeTab === "Receive Stock" && <ReceiveStockTab onOpenReceiveModal={handleOpenReceiveModal} />}
      </div>

      {/* Enhanced, Spacious Receive Stock Modal */}
      <Modal 
        isOpen={isReceiveModalOpen} 
        onClose={() => setIsReceiveModalOpen(false)} 
        title="Receive Inventory Stock"
        size="md"
      >
        <form onSubmit={handleReceiveSubmit} className="space-y-5">
          {/* Top Info Banner */}
          <div className="bg-[#f8faf7] border border-[#e4ece2] rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#eaf4ea] text-brand-green flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-ink text-sm">Add Quantity to Existing Pile</div>
              <div className="text-xs text-[#5b6671] mt-0.5">
                Select an existing product and its target warehouse. The received quantity will be automatically added to the current warehouse pile and overall company inventory.
              </div>
            </div>
          </div>

          {/* Product & Warehouse Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Selection */}
            <div>
              <Select 
                label="Product"
                required 
                value={receiveForm.productId} 
                onChange={(val) => {
                  const prod = distinctProducts.find(p => p.id === val);
                  setReceiveForm({
                    ...receiveForm,
                    productId: val,
                    productName: prod?.name || ""
                  });
                }} 
                options={distinctProducts.map(p => {
                  const total = inventoryList
                    .filter(i => i.productId === p.id)
                    .reduce((sum, i) => sum + i.quantity, 0);
                  return {
                    value: p.id,
                    label: p.name,
                    sublabel: `${p.segment} • Total Stock: ${total} units`
                  };
                })}
              />
            </div>

            {/* Warehouse Destination */}
            <div>
              <Select 
                label="Destination Warehouse"
                required 
                value={receiveForm.warehouseId} 
                onChange={(val) => setReceiveForm({ ...receiveForm, warehouseId: val })} 
                options={warehousesList.map(w => {
                  const itemInWh = inventoryList.find(i => i.productId === receiveForm.productId && i.warehouseId === w.id);
                  return {
                    value: w.id,
                    label: w.name,
                    sublabel: itemInWh ? `Current in WH: ${itemInWh.quantity} units` : `${w.location} • New allocation`
                  };
                })}
              />
            </div>
          </div>

          {/* Product Live Context Card */}
          {selectedProductInfo && (
            <div className="bg-white border border-line rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink text-sm">{selectedProductInfo.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#eaf4ea] text-brand-green">
                    {selectedProductInfo.segment}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#8a949d] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Total in All Warehouses: <strong className="text-ink">{totalExistingStock.toLocaleString()} units</strong>
                </div>
              </div>

              {/* Dynamic Pile Math Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center sm:text-left">
                <div className="p-2.5 rounded-xl bg-[#fcfdfa] border border-line">
                  <div className="text-[11px] font-bold text-[#8a949d] uppercase tracking-wider">Current in WH</div>
                  <div className="text-base font-black text-ink mt-0.5">
                    {currentWarehouseQty.toLocaleString()} <span className="text-xs font-semibold text-[#8a949d]">units</span>
                  </div>
                  <div className="text-[11px] text-[#5b6671]">({currentWarehouseAvailable} available)</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#eaf4ea]/60 border border-brand-green/20">
                  <div className="text-[11px] font-bold text-brand-green uppercase tracking-wider">Adding to Pile</div>
                  <div className="text-base font-black text-brand-green mt-0.5">
                    +{Number(receiveForm.quantity || 0).toLocaleString()} <span className="text-xs font-semibold text-brand-green/80">units</span>
                  </div>
                  <div className="text-[11px] text-brand-green font-medium">To target warehouse</div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#f8faf7] border border-line">
                  <div className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-green" /> New WH Pile
                  </div>
                  <div className="text-base font-black text-ink mt-0.5">
                    {(currentWarehouseQty + Number(receiveForm.quantity || 0)).toLocaleString()} <span className="text-xs font-semibold text-[#8a949d]">units</span>
                  </div>
                  <div className="text-[11px] text-[#5b6671]">New Total: {(totalExistingStock + Number(receiveForm.quantity || 0)).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#5b6671] mb-1.5">
                Quantity to Add *
              </label>
              <input 
                required 
                type="number" 
                min="1" 
                value={receiveForm.quantity} 
                onChange={(e) => setReceiveForm({ ...receiveForm, quantity: Math.max(1, Number(e.target.value)) })} 
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-brand-green bg-[#fcfdfa]" 
                placeholder="e.g. 50"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#5b6671] mb-1.5">
                Reference / PO Number *
              </label>
              <input 
                required
                type="text" 
                value={receiveForm.reference} 
                onChange={(e) => setReceiveForm({ ...receiveForm, reference: e.target.value })} 
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-brand-green bg-[#fcfdfa]" 
                placeholder="e.g. REC-98412 or PO-2026-01"
              />
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-[12px] font-bold text-[#5b6671] mb-1.5">
              Stocking Description / Notes
            </label>
            <textarea
              rows={3}
              value={receiveForm.description}
              onChange={(e) => setReceiveForm({ ...receiveForm, description: e.target.value })}
              className="w-full border border-line rounded-xl p-3 text-sm focus:outline-brand-green bg-[#fcfdfa]"
              placeholder="e.g. Inbound consignment from manufacturer batch #49, sea shipment cleared at Lagos customs."
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-line flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsReceiveModalOpen(false)} 
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isReceiving || !receiveForm.productId || !receiveForm.warehouseId} 
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-green text-white text-sm font-extrabold hover:bg-brand-green2 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isReceiving ? "Recording Stocking..." : "Confirm & Receive Stock"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
