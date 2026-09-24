import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { Supplier } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await inventoryService.getSuppliers();
      setSuppliers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
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
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
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
    </div>
  );
}
