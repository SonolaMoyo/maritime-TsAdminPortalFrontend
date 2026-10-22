import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { CatalogProduct } from "../../data/mockCatalog";
import { useSegment } from "../../context/SegmentContext";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../ui/Pagination";

export function ProductsTab() {
  const { segment } = useSegment();
  const navigate = useNavigate();
  const [products, setProducts] = useState<(CatalogProduct & { stock: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const p = await catalogService.getProducts();
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    if (segment !== "All" && p.segment !== segment) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-3 sm:p-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfdfa]">
        <div className="relative w-full sm:w-auto flex-1 max-w-[320px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a949d]" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[40px] pl-10 pr-4 rounded-full border border-line bg-white text-[13px] sm:text-[14px] font-medium text-ink w-full focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>
        <button 
          onClick={() => navigate('/catalog/products/new')}
          className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-green2 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading catalog...</div>
      ) : (
        <>
          <Table headers={["Product", "Segment", "Stock", "Status", "Action"]}>
            {paginatedProducts.map((prod) => (
              <TableRow key={prod.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => navigate(`/catalog/products/${prod.id}`)}>
                <TableCell>
                  <div className="font-bold text-ink text-[14px]">{prod.name}</div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2.5 py-1 rounded-md">{prod.segment}</span>
                </TableCell>
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
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No products found.</div></TableCell>
              </TableRow>
            )}
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
