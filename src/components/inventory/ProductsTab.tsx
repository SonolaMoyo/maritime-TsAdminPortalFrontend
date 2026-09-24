import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { ProductInventory } from "../../data/mockInventory";
import { useSegment } from "../../context/SegmentContext";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Search } from "lucide-react";

export function ProductsTab() {
  const { segment } = useSegment();
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await inventoryService.getInventory();
      setInventory(data);
      setLoading(false);
    };
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

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
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
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
    </div>
  );
}
