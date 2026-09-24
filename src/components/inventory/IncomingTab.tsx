import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { InventoryReceipt } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";

export function IncomingTab() {
  const [receipts, setReceipts] = useState<InventoryReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await inventoryService.getReceipts();
      setReceipts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading incoming stock...</div>
      ) : (
        <Table headers={["Reference", "Supplier", "Items", "Expected Qty", "Destination", "Expected Date", "Status", "Action"]}>
          {receipts.map((rec) => (
            <TableRow key={rec.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell><div className="font-bold text-ink">{rec.referenceNumber}</div></TableCell>
              <TableCell><div className="font-bold text-[#5b6671] text-[14px]">Supplier {rec.supplierId.replace('sup-', '#')}</div></TableCell>
              <TableCell>
                <div className="text-[14px] text-ink font-medium max-w-[200px] truncate">
                  {rec.items.map(i => i.productName).join(", ")}
                </div>
              </TableCell>
              <TableCell><div className="font-black text-ink">{rec.items.reduce((s, i) => s + i.expectedQuantity, 0)}</div></TableCell>
              <TableCell>
                <div className="text-[14px] font-medium text-ink">
                  {rec.warehouseId === "wh-1" ? "Lagos Warehouse" : "Abuja Hub"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-[14px] font-medium text-ink">
                  {new Date(rec.expectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  rec.status === 'Received' ? 'bg-[#f4fce3] text-[#65a30d]' :
                  rec.status === 'In Transit' ? 'bg-[#eff6ff] text-[#3b82f6]' :
                  'bg-[#fffbeb] text-[#f59e0b]'
                }`}>
                  {rec.status}
                </div>
              </TableCell>
              <TableCell>
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                  {rec.status === 'Received' ? 'View' : 'Receive'}
                </button>
              </TableCell>
            </TableRow>
          ))}
          {receipts.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No incoming stock found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}
    </div>
  );
}
