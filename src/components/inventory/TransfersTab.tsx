import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { InventoryTransfer } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";
import { ArrowRight } from "lucide-react";

export function TransfersTab() {
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await inventoryService.getTransfers();
      setTransfers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading transfers...</div>
      ) : (
        <Table headers={["Transfer ID", "Product", "Quantity", "Route", "Date", "Status", "Action"]}>
          {transfers.map((trf) => (
            <TableRow key={trf.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell><div className="font-bold text-ink">{trf.transferNumber}</div></TableCell>
              <TableCell><div className="font-bold text-[#5b6671] text-[14px]">{trf.productName}</div></TableCell>
              <TableCell><div className="font-black text-ink">{trf.quantity}</div></TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
                  {trf.fromWarehouseId === "wh-1" ? "Lagos" : "Abuja"}
                  <ArrowRight className="w-3.5 h-3.5 text-[#8a949d]" />
                  {trf.toWarehouseId === "wh-1" ? "Lagos" : "Abuja"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-[14px] font-medium text-ink">
                  {new Date(trf.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  trf.status === 'Completed' ? 'bg-[#f4fce3] text-[#65a30d]' :
                  trf.status === 'In Transit' ? 'bg-[#eff6ff] text-[#3b82f6]' :
                  'bg-[#fffbeb] text-[#f59e0b]'
                }`}>
                  {trf.status}
                </div>
              </TableCell>
              <TableCell>
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
          {transfers.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No transfers found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}
    </div>
  );
}
