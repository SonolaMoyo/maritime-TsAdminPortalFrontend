import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import { mockWarehouses } from "../../data/mockInventory";
import type { ProductInventory } from "../../data/mockInventory";
import { useSegment } from "../../context/SegmentContext";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Search, Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";

export function ProductsTab() {
  const { segment } = useSegment();
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ productName: "", segment: "Solar Tech" as any, quantity: 0, reorderThreshold: 10, warehouseId: "wh-1" });
  
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await inventoryService.getInventory();
    setInventory(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await inventoryService.addProduct(addForm);
    setIsAddOpen(false);
    loadData();
    window.dispatchEvent(new Event('inventory-updated')); // trigger overview refresh
  };

  const handleDelete = async () => {
    if(!selectedProduct) return;
    if(confirm(`Are you sure you want to delete ${selectedProduct.productName}?`)) {
      await inventoryService.deleteProduct(selectedProduct.id);
      setSelectedProduct(null);
      loadData();
      window.dispatchEvent(new Event('inventory-updated'));
    }
  };

  const filteredInv = inventory.filter(i => {
    if (segment !== "All" && i.segment !== segment) return false;
    if (searchQuery && !i.productName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-between items-center bg-[#fcfdfa]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a949d]" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[40px] pl-10 pr-4 rounded-full border border-line bg-white text-[14px] font-medium text-ink w-[260px] focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading stock...</div>
      ) : (
        <Table headers={["Product", "Segment", "Total Stock", "Allocated", "Available", "Warehouse", "Status", "Action"]}>
          {filteredInv.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell>
                <div className="font-bold text-ink text-[14px]">{item.productName}</div>
                <div className="text-[12px] text-[#8a949d] font-medium">SKU: {item.productId}</div>
              </TableCell>
              <TableCell>
                <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{item.segment}</span>
              </TableCell>
              <TableCell>
                <div className="font-black text-ink">{item.quantity}</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-[#5b6671]">{item.allocatedQuantity}</div>
              </TableCell>
              <TableCell>
                <div className="font-black text-brand-green">{item.availableQuantity}</div>
              </TableCell>
              <TableCell>
                <div className="text-[14px] font-medium text-ink">
                  {item.warehouseId === "wh-1" ? "Lagos" : item.warehouseId === "wh-2" ? "Abuja" : "Port Harcourt"}
                </div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  item.status === 'Healthy' ? 'bg-[#f4fce3] text-[#65a30d]' :
                  item.status === 'Low Stock' ? 'bg-[#fffbeb] text-[#f59e0b]' :
                  'bg-[#fef2f2] text-[#ef4444]'
                }`}>
                  {item.status}
                </div>
              </TableCell>
              <TableCell>
                <button onClick={() => setSelectedProduct(item)} className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  Manage
                </button>
              </TableCell>
            </TableRow>
          ))}
          {filteredInv.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No products found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Product">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Product Name *</label>
            <input required value={addForm.productName} onChange={e => setAddForm({...addForm, productName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Segment</label>
              <select value={addForm.segment} onChange={e => setAddForm({...addForm, segment: e.target.value as any})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option value="Solar Tech">Solar Tech</option>
                <option value="Luxe">Luxe</option>
                <option value="EV">EV</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Warehouse</label>
              <select value={addForm.warehouseId} onChange={e => setAddForm({...addForm, warehouseId: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                {mockWarehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Initial Quantity</label>
            <input type="number" min="0" value={addForm.quantity} onChange={e => setAddForm({...addForm, quantity: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Add Product</button>
          </div>
        </form>
      </Modal>

      {/* Manage Product Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Manage Product">
        {selectedProduct && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-ink text-lg">{selectedProduct.productName}</h4>
              <p className="text-[#8a949d] text-sm">SKU: {selectedProduct.productId} • Warehouse: {selectedProduct.warehouseId}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg text-center">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Stock</div>
                <div className="text-xl font-black text-ink">{selectedProduct.quantity}</div>
              </div>
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg text-center">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Allocated</div>
                <div className="text-xl font-black text-[#f59e0b]">{selectedProduct.allocatedQuantity}</div>
              </div>
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg text-center">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Available</div>
                <div className="text-xl font-black text-brand-green">{selectedProduct.availableQuantity}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-between items-center">
              <button onClick={handleDelete} className="text-red-500 font-bold flex items-center gap-2 text-sm hover:underline">
                <Trash2 className="w-4 h-4" /> Delete Product
              </button>
              <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Done</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
