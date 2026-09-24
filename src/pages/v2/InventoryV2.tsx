import { useState } from "react";
import { Plus } from "lucide-react";
import { useSegment } from "../../context/SegmentContext";
import { OverviewTab } from "../../components/inventory/OverviewTab";
import { ProductsTab } from "../../components/inventory/ProductsTab";
import { WarehousesTab } from "../../components/inventory/WarehousesTab";
import { IncomingTab } from "../../components/inventory/IncomingTab";
import { TransfersTab } from "../../components/inventory/TransfersTab";
import { SuppliersTab } from "../../components/inventory/SuppliersTab";
import { Modal } from "../../components/ui/Modal";
import { inventoryService } from "../../services/inventoryService";
import { mockInventory } from "../../data/mockInventory";

export function InventoryV2() {
  const { segment } = useSegment();
  const [activeTab, setActiveTab] = useState("Overview");

  // Modal states
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    inventoryId: mockInventory[0]?.id || "",
    quantity: 10,
    reference: ""
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

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">Inventory {segment !== 'All' && <span className="text-brand-green">— {segment}</span>}</h1>
          <p className="text-[#5b6671] text-[15px] font-medium">Monitor stock levels, warehouse activity and inventory movements.</p>
        </div>
        <div className="flex gap-3">
          <button className="h-[44px] px-5 rounded-full border border-line bg-white text-ink font-[800] text-[14px] hover:bg-[#fcfdfa] transition-all flex items-center gap-2 cursor-pointer">
            Transfer Stock
          </button>
          <button 
            onClick={() => setIsReceiveModalOpen(true)}
            className="h-[44px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-6 border-b border-[#e4ece2] mb-6">
        {["Overview", "Products", "Warehouses", "Incoming", "Transfers", "Suppliers", "Reports"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-[800] text-[14px] whitespace-nowrap transition-colors border-b-[3px] -mb-[1.5px] ${
              activeTab === tab ? "border-brand-green text-brand-green" : "border-transparent text-[#8a949d] hover:text-ink cursor-pointer"
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
        {activeTab === "Incoming" && <IncomingTab />}
        {activeTab === "Transfers" && <TransfersTab />}
        {activeTab === "Suppliers" && <SuppliersTab />}
        {activeTab === "Reports" && <div className="p-12 text-center text-[#8a949d] font-bold border border-line rounded-2xl">Reports Module Coming Soon</div>}
      </div>

      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} title="Receive Inventory">
        <form onSubmit={handleReceiveSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Product Inventory Record *</label>
            <select 
              required 
              value={receiveForm.inventoryId} 
              onChange={e => setReceiveForm({...receiveForm, inventoryId: e.target.value})} 
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white"
            >
              {mockInventory.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.productName} ({inv.segment}) - {inv.warehouseId === 'wh-1' ? 'Lagos' : 'Abuja'}
                </option>
              ))}
            </select>
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
    </div>
  );
}
