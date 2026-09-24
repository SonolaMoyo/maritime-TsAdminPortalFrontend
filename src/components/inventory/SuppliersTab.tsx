import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { Supplier } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", contactPerson: "", email: "", phone: "" });
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await inventoryService.getSuppliers();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await inventoryService.addSupplier(addForm);
    setIsAddOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if(!selectedSupplier) return;
    if(confirm(`Are you sure you want to delete ${selectedSupplier.name}?`)) {
      await inventoryService.deleteSupplier(selectedSupplier.id);
      setSelectedSupplier(null);
      loadData();
    }
  };

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-end bg-[#fcfdfa]">
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> New Supplier
        </button>
      </div>
      
      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading suppliers...</div>
      ) : (
        <Table headers={["Supplier Name", "Contact", "Products Supplied", "Active Orders", "Status", "Action"]}>
          {suppliers.map((sup) => (
            <TableRow key={sup.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell><div className="font-bold text-ink">{sup.name}</div></TableCell>
              <TableCell>
                <div className="font-bold text-[#5b6671] text-[14px]">{sup.contactPerson}</div>
                <div className="text-[12px] text-[#8a949d]">{sup.email}</div>
              </TableCell>
              <TableCell><div className="font-black text-ink">{sup.productsSupplied}</div></TableCell>
              <TableCell>
                <div className="text-[14px] font-bold text-ink">{sup.activeOrders} POs</div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${sup.status === 'Active' ? 'bg-[#f4fce3] text-[#65a30d]' : 'bg-line text-ink'}`}>
                  {sup.status}
                </div>
              </TableCell>
              <TableCell>
                <button onClick={() => setSelectedSupplier(sup)} className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  Manage
                </button>
              </TableCell>
            </TableRow>
          ))}
          {suppliers.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No suppliers found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      {/* Add Supplier Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Supplier">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Supplier Name *</label>
            <input required value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Contact Person *</label>
            <input required value={addForm.contactPerson} onChange={e => setAddForm({...addForm, contactPerson: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Email</label>
              <input type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Phone</label>
              <input type="text" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Add Supplier</button>
          </div>
        </form>
      </Modal>

      {/* Manage Supplier Modal */}
      <Modal isOpen={!!selectedSupplier} onClose={() => setSelectedSupplier(null)} title="Manage Supplier">
        {selectedSupplier && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-ink text-lg">{selectedSupplier.name}</h4>
              <p className="text-[#8a949d] text-sm">Contact: {selectedSupplier.contactPerson}</p>
              <p className="text-[#8a949d] text-sm">{selectedSupplier.email} • {selectedSupplier.phone}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg text-center">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Products Supplied</div>
                <div className="text-xl font-black text-ink">{selectedSupplier.productsSupplied}</div>
              </div>
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg text-center">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Active POs</div>
                <div className="text-xl font-black text-brand-green">{selectedSupplier.activeOrders}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-between items-center">
              <button onClick={handleDelete} className="text-red-500 font-bold flex items-center gap-2 text-sm hover:underline">
                <Trash2 className="w-4 h-4" /> Delete Supplier
              </button>
              <button onClick={() => setSelectedSupplier(null)} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Done</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
