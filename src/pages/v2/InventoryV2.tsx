import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { useSegment } from "../../context/SegmentContext";
import { OverviewTab } from "../../components/inventory/OverviewTab";
import { ProductsTab } from "../../components/inventory/ProductsTab";
import { WarehousesTab } from "../../components/inventory/WarehousesTab";
import { TransfersTab } from "../../components/inventory/TransfersTab";
import { SuppliersTab } from "../../components/inventory/SuppliersTab";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { inventoryService } from "../../services/inventoryService";
import { mockInventory, mockWarehouses } from "../../data/mockInventory";

export function InventoryV2() {
  const { segment } = useSegment();
  const [activeTab, setActiveTab] = useState("Overview");

  // Receive Modal states
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    inventoryId: mockInventory[0]?.id || "",
    quantity: 10,
    reference: ""
  });

  // Transfer Modal states
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferForm, setTransferForm] = useState({
    productId: mockInventory[0]?.productId || "",
    productName: mockInventory[0]?.productName || "",
    fromWarehouseId: mockWarehouses[0]?.id || "",
    toWarehouseId: mockWarehouses[1]?.id || "",
    quantity: 1
  });

  const handleReceiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReceiving(true);
    try {
      await inventoryService.receiveStock(receiveForm.inventoryId, receiveForm.quantity);
      setIsReceiveModalOpen(false);
      // Hack to force re-render of child tabs by toggling tab if needed, 
      // but in a real app we'd use a global store or React Query.
      // For now, closing the modal is enough.
      window.dispatchEvent(new Event('inventory-updated'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsReceiving(false);
    }
  };

  // Add event listener in tabs if we want them to refresh automatically, 
  // but for mock purposes we'll just reload the data.

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    try {
      await inventoryService.createTransfer(
        transferForm.fromWarehouseId,
        transferForm.toWarehouseId,
        transferForm.productId,
        transferForm.productName,
        transferForm.quantity
      );
      setIsTransferModalOpen(false);
      window.dispatchEvent(new Event('inventory-updated'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">Inventory {segment !== 'All' && <span className="text-brand-green">— {segment}</span>}</h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">Monitor stock levels, warehouse activity and inventory movements.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="flex-1 sm:flex-initial h-[42px] sm:h-[44px] px-4 sm:px-5 rounded-full border border-line bg-white text-ink font-[800] text-[13px] sm:text-[14px] hover:bg-[#fcfdfa] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Transfer Stock
          </button>
          <button 
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex-1 sm:flex-initial h-[42px] sm:h-[44px] px-4 sm:px-5 rounded-full bg-brand-green text-white font-[800] text-[13px] sm:text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-[#e4ece2] mb-6 pb-3">
        {["Overview", "Products", "Warehouses", "Transfers", "Suppliers", "Reports"].map((tab) => (
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
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Products" && <ProductsTab />}
        {activeTab === "Warehouses" && <WarehousesTab />}
        {activeTab === "Transfers" && <TransfersTab />}
        {activeTab === "Suppliers" && <SuppliersTab />}
        {activeTab === "Reports" && <div className="p-12 text-center text-[#8a949d] font-bold border border-line rounded-2xl">Reports Module Coming Soon</div>}
      </div>

      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} title="Receive Inventory">
        <form onSubmit={handleReceiveSubmit} className="space-y-4">
          <div>
            <Select 
              label="Product Inventory Record"
              required 
              value={receiveForm.inventoryId} 
              onChange={val => setReceiveForm({...receiveForm, inventoryId: val})} 
              options={mockInventory.map(inv => {
                const wh = mockWarehouses.find(w => w.id === inv.warehouseId);
                return {
                  value: inv.id,
                  label: `${inv.productName} (${inv.segment})`,
                  sublabel: `Warehouse: ${wh?.name || inv.warehouseId}`,
                };
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Quantity Received *</label>
              <input required type="number" min="1" value={receiveForm.quantity} onChange={e => setReceiveForm({...receiveForm, quantity: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Reference / PO Number</label>
              <input type="text" value={receiveForm.reference} onChange={e => setReceiveForm({...receiveForm, reference: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsReceiveModalOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isReceiving} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">
              {isReceiving ? "Saving..." : "Receive Stock"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} title="Transfer Stock">
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div>
            <Select 
              label="Product"
              required 
              value={transferForm.productId} 
              onChange={val => {
                const prod = mockInventory.find(i => i.productId === val);
                setTransferForm({...transferForm, productId: val, productName: prod?.productName || ""});
              }} 
              options={Array.from(new Set(mockInventory.map(i => i.productId))).map(pId => {
                const prod = mockInventory.find(i => i.productId === pId);
                return {
                  value: pId,
                  label: prod?.productName || pId,
                  sublabel: prod?.segment,
                };
              })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div>
              <Select 
                label="From Warehouse"
                required 
                value={transferForm.fromWarehouseId} 
                onChange={val => setTransferForm({...transferForm, fromWarehouseId: val})} 
                options={mockWarehouses.map(w => ({ value: w.id, label: w.name, sublabel: w.location }))}
              />
            </div>
            <div className="hidden sm:block pb-2 text-[#8a949d] text-center">
              <ArrowRight className="w-4 h-4 mx-auto" />
            </div>
            <div>
              <Select 
                label="To Warehouse"
                required 
                value={transferForm.toWarehouseId} 
                onChange={val => setTransferForm({...transferForm, toWarehouseId: val})} 
                options={mockWarehouses.map(w => ({ value: w.id, label: w.name, sublabel: w.location }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Quantity to Transfer *</label>
            <input required type="number" min="1" value={transferForm.quantity} onChange={e => setTransferForm({...transferForm, quantity: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          
          <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button type="button" onClick={() => setIsTransferModalOpen(false)} className="w-full sm:w-auto px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">Cancel</button>
            <button type="submit" disabled={isTransferring} className="w-full sm:w-auto px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 cursor-pointer">
              {isTransferring ? "Processing..." : "Create Transfer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
