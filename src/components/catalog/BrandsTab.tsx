import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { Brand } from "../../data/mockCatalog";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus } from "lucide-react";
import { Modal } from "../ui/Modal";

export function BrandsTab() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", website: "" });

  const loadData = async () => {
    setLoading(true);
    const data = await catalogService.getBrands();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await catalogService.addBrand({ ...addForm, segments: ["Solar Tech"], status: "Active" });
    setIsAddOpen(false);
    loadData();
  };

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-end bg-[#fcfdfa]">
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading brands...</div>
      ) : (
        <Table headers={["Brand", "Products", "Segments", "Status", "Action"]}>
          {brands.map((br) => (
            <TableRow key={br.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell>
                <div className="font-bold text-ink text-[14px]">{br.name}</div>
                {br.website && <div className="text-[12px] text-brand-green">{br.website}</div>}
              </TableCell>
              <TableCell><div className="font-black text-ink">{br.productCount}</div></TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {br.segments.map(seg => (
                    <span key={seg} className="text-[12px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-0.5 rounded">{seg}</span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  br.status === 'Active' ? 'bg-[#f4fce3] text-[#65a30d]' : 'bg-[#fef2f2] text-[#ef4444]'
                }`}>
                  {br.status}
                </div>
              </TableCell>
              <TableCell>
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
          {brands.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No brands found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Brand">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Brand Name *</label>
            <input required value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Description</label>
            <input value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Website</label>
            <input type="url" value={addForm.website} onChange={e => setAddForm({...addForm, website: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Create Brand</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
