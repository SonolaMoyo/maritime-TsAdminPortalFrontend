import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { CatalogProduct } from "../../data/mockCatalog";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus, GripVertical } from "lucide-react";
import { Modal } from "../ui/Modal";

export function FeaturedTab() {
  const [featuredProducts, setFeaturedProducts] = useState<CatalogProduct[]>([]);
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await catalogService.getProducts();
    setAllProducts(data);
    setFeaturedProducts(data.filter(p => p.isFeatured));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedProductId) {
      await catalogService.updateProduct(selectedProductId, { isFeatured: true });
      setIsAddOpen(false);
      setSelectedProductId("");
      loadData();
    }
  };

  const handleRemove = async (id: string) => {
    if(confirm("Remove this product from the featured list?")) {
      await catalogService.updateProduct(id, { isFeatured: false });
      loadData();
    }
  };

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-between items-center bg-[#fcfdfa]">
        <div>
          <h2 className="text-[15px] font-bold text-ink">Homepage Featured Products</h2>
          <p className="text-[13px] text-[#8a949d]">Drag to reorder the products displayed on the main landing page.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> Add Featured Product
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading featured products...</div>
      ) : (
        <Table headers={["Order", "Product", "Segment", "Status", "Action"]}>
          {featuredProducts.map((prod, index) => (
            <TableRow key={prod.id} className="cursor-grab active:cursor-grabbing hover:bg-[#fcfdfa]">
              <TableCell>
                <div className="flex items-center gap-3 text-[#8a949d] font-black">
                  <GripVertical className="w-4 h-4 text-line" />
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-ink text-[14px]">{prod.name}</div>
                <div className="text-[12px] text-[#8a949d] font-medium">SKU: {prod.id}</div>
              </TableCell>
              <TableCell>
                <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{prod.segment}</span>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  prod.status === 'Published' ? 'bg-[#f4fce3] text-[#65a30d]' :
                  prod.status === 'Draft' ? 'bg-[#f8fafc] text-[#64748b] border border-[#cbd5e1]' :
                  'bg-[#fef2f2] text-[#ef4444]'
                }`}>
                  {prod.status}
                </div>
              </TableCell>
              <TableCell>
                <button onClick={() => handleRemove(prod.id)} className="text-[13px] font-[800] text-red-500 hover:underline cursor-pointer">
                  Remove
                </button>
              </TableCell>
            </TableRow>
          ))}
          {featuredProducts.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No featured products.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Featured Product">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Select Product</label>
            <select required value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="" disabled>Select a product...</option>
              {allProducts.filter(p => !p.isFeatured).map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.segment})</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={!selectedProductId} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Add to Featured</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
