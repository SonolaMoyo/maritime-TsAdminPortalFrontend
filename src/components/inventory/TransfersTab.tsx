import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import type { InventoryTransfer } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";
import { ArrowRight } from "lucide-react";
import { Modal } from "../ui/Modal";

export function TransfersTab() {
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransfer | null>(null);

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
                <button onClick={() => setSelectedTransfer(trf)} className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
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

      {/* View Transfer Modal */}
      <Modal isOpen={!!selectedTransfer} onClose={() => setSelectedTransfer(null)} title="Transfer Details">
        {selectedTransfer && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-ink text-lg">{selectedTransfer.transferNumber}</h4>
              <p className="text-[#8a949d] text-sm">Product: {selectedTransfer.productName} ({selectedTransfer.productId})</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Origin</div>
                <div className="text-[14px] font-bold text-ink">{selectedTransfer.fromWarehouseId === "wh-1" ? "Lagos Warehouse" : "Abuja Hub"}</div>
              </div>
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Destination</div>
                <div className="text-[14px] font-bold text-ink">{selectedTransfer.toWarehouseId === "wh-1" ? "Lagos Warehouse" : "Abuja Hub"}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Quantity Transferred</div>
                <div className="text-xl font-black text-ink">{selectedTransfer.quantity}</div>
              </div>
              <div className="p-3 bg-[#fcfdfa] border border-line rounded-lg">
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Status</div>
                <div className={`mt-1 px-2 py-1 inline-flex rounded-md text-[12px] font-bold ${
                  selectedTransfer.status === 'Completed' ? 'bg-[#f4fce3] text-[#65a30d]' :
                  selectedTransfer.status === 'In Transit' ? 'bg-[#eff6ff] text-[#3b82f6]' :
                  'bg-[#fffbeb] text-[#f59e0b]'
                }`}>
                  {selectedTransfer.status}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <button onClick={() => setSelectedTransfer(null)} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
