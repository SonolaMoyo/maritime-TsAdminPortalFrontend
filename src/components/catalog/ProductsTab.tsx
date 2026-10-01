import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { CatalogProduct, ProductCategory, Brand } from "../../data/mockCatalog";
import { useSegment } from "../../context/SegmentContext";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProductsTab() {
  const { segment } = useSegment();
  const navigate = useNavigate();
  const [products, setProducts] = useState<(CatalogProduct & { stock: number })[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [p, c, b] = await Promise.all([
        catalogService.getProducts(),
        catalogService.getCategories(),
        catalogService.getBrands()
      ]);
      setProducts(p);
      setCategories(c);
      setBrands(b);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    if (segment !== "All" && p.segment !== segment) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
        <button 
          onClick={() => navigate('/catalog/products/new')}
          className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading catalog...</div>
      ) : (
        <Table headers={["Product", "Segment", "Category", "Brand", "Stock", "Status", "Action"]}>
          {filteredProducts.map((prod) => {
            const cat = categories.find(c => c.id === prod.categoryId);
            const brand = brands.find(b => b.id === prod.brandId);
            return (
              <TableRow key={prod.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => navigate(`/catalog/products/${prod.id}`)}>
                <TableCell>
                  <div className="font-bold text-ink text-[14px]">{prod.name}</div>
                  <div className="text-[12px] text-[#8a949d] font-medium">SKU: {prod.id}</div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{prod.segment}</span>
                </TableCell>
                <TableCell><div className="font-medium text-ink">{cat?.name || '-'}</div></TableCell>
                <TableCell><div className="font-medium text-ink">{brand?.name || '-'}</div></TableCell>
                <TableCell><div className="font-black text-ink">{prod.stock}</div></TableCell>
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
                  <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                    View
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredProducts.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No products found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}
    </div>
  );
}
