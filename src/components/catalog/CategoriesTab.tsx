import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { ProductCategory } from "../../data/mockCatalog";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus } from "lucide-react";
import { Modal } from "../ui/Modal";

export function CategoriesTab() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", segment: "Solar Tech" as any, status: "Active" as any });

  const loadData = async () => {
    setLoading(true);
    const data = await catalogService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await catalogService.addCategory(addForm);
    setIsAddOpen(false);
    loadData();
  };

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-end bg-[#fcfdfa]">
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading categories...</div>
      ) : (
        <Table headers={["Category", "Segment", "Products", "Status", "Action"]}>
          {categories.map((cat) => (
            <TableRow key={cat.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell><div className="font-bold text-ink">{cat.name}</div></TableCell>
              <TableCell>
                <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{cat.segment}</span>
              </TableCell>
              <TableCell><div className="font-black text-ink">{cat.productCount}</div></TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${cat.status === 'Active' ? 'bg-[#f4fce3] text-[#65a30d]' : 'bg-[#fef2f2] text-[#ef4444]'
                  }`}>
                  {cat.status}
                </div>
              </TableCell>
              <TableCell>
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No categories found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Category">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Category Name *</label>
            <input required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Segment *</label>
            <select value={addForm.segment} onChange={e => setAddForm({ ...addForm, segment: e.target.value as any })} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="Solar Tech">Solar Tech</option>
              <option value="Luxe">Luxe</option>
              <option value="EV">EV</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Status</label>
            <select value={addForm.status} onChange={e => setAddForm({ ...addForm, status: e.target.value as any })} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Create Category</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
