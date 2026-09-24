import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { Warehouse, ProductInventory } from "../../data/mockInventory";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Table, TableRow, TableCell } from "../ui/Table";

export function WarehousesTab() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", location: "", address: "", manager: "" });

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [warehouseInventory, setWarehouseInventory] = useState<ProductInventory[]>([]);

  const loadData = async () => {
    setLoading(true);
    const data = await inventoryService.getWarehouses();
    setWarehouses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await inventoryService.addWarehouse(addForm);
    setIsAddOpen(false);
    loadData();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this warehouse?")) {
      await inventoryService.deleteWarehouse(id);
      loadData();
    }
  };

  const handleViewInventory = async (wh: Warehouse) => {
    setSelectedWarehouse(wh);
    const allInv = await inventoryService.getInventory();
    setWarehouseInventory(allInv.filter(i => i.warehouseId === wh.id));
  };

  if (loading) return <div className="p-12 text-center text-[#8a949d] font-bold border border-line rounded-2xl">Loading Warehouses...</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <div key={wh.id} className="bg-white border border-line rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative">
            <button onClick={(e) => handleDelete(wh.id, e)} className="absolute top-4 right-4 p-2 text-[#8a949d] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex justify-between items-start mb-4 pr-10">
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
              <button onClick={() => handleViewInventory(wh)} className="w-full py-2.5 rounded-lg border border-line text-[13px] font-black text-ink hover:bg-[#fcfdfa] transition-colors">
                View Inventory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Warehouse Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Warehouse">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Warehouse Name *</label>
            <input required value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Location / City *</label>
            <input required value={addForm.location} onChange={e => setAddForm({...addForm, location: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Full Address</label>
            <input value={addForm.address} onChange={e => setAddForm({...addForm, address: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Manager</label>
            <input value={addForm.manager} onChange={e => setAddForm({...addForm, manager: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Add Warehouse</button>
          </div>
        </form>
      </Modal>

      {/* View Inventory Modal */}
      <Modal isOpen={!!selectedWarehouse} onClose={() => setSelectedWarehouse(null)} title={`${selectedWarehouse?.name} Inventory`}>
        <div className="space-y-4">
          <Table headers={["Product", "Total Stock", "Status"]}>
            {warehouseInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-bold text-ink text-[14px]">{item.productName}</div>
                  <div className="text-[12px] text-[#8a949d] font-medium">SKU: {item.productId}</div>
                </TableCell>
                <TableCell>
                  <div className="font-black text-ink">{item.quantity}</div>
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
              </TableRow>
            ))}
            {warehouseInventory.length === 0 && (
              <TableRow>
                <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No inventory found in this warehouse.</div></TableCell>
              </TableRow>
            )}
          </Table>
          
          <div className="pt-4 flex justify-end">
            <button onClick={() => setSelectedWarehouse(null)} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
