import { useState, useEffect, useMemo } from "react";
import { Plus, Search, ArrowDownRight, PackageCheck } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";
import type { InventoryReceipt, Warehouse } from "../../data/mockInventory";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Pagination } from "../ui/Pagination";

interface ReceiveStockTabProps {
  onOpenReceiveModal?: () => void;
}

export function ReceiveStockTab({ onOpenReceiveModal }: ReceiveStockTabProps) {
  const [receipts, setReceipts] = useState<InventoryReceipt[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, whs] = await Promise.all([
        inventoryService.getReceipts(),
        inventoryService.getWarehouses()
      ]);
      setReceipts(recs);
      setWarehouses(whs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("inventory-updated", handleUpdate);
    return () => window.removeEventListener("inventory-updated", handleUpdate);
  }, []);

  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w.id === id);
    return wh ? wh.name : id;
  };

  const getReceiptProduct = (rec: InventoryReceipt) => {
    if (rec.productName) return rec.productName;
    if (rec.items && rec.items.length > 0) {
      return rec.items.map(i => i.productName).join(", ");
    }
    return "Stock Consignment";
  };

  const getReceiptQty = (rec: InventoryReceipt) => {
    if (typeof rec.quantity === "number") return rec.quantity;
    if (rec.items && rec.items.length > 0) {
      return rec.items.reduce((acc, i) => acc + (i.receivedQuantity || i.expectedQuantity || 0), 0);
    }
    return 0;
  };

  const getReceiptRef = (rec: InventoryReceipt) => {
    return rec.referenceNumber || rec.receiptNumber || rec.id;
  };

  const getReceiptDate = (rec: InventoryReceipt) => {
    const d = rec.date || rec.expectedDate || rec.createdAt;
    if (!d) return "Recent";
    try {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return d;
    }
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter(rec => {
      const ref = getReceiptRef(rec).toLowerCase();
      const prod = getReceiptProduct(rec).toLowerCase();
      const wh = getWarehouseName(rec.warehouseId).toLowerCase();
      const desc = (rec.description || "").toLowerCase();
      const q = searchTerm.toLowerCase();
      return ref.includes(q) || prod.includes(q) || wh.includes(q) || desc.includes(q);
    });
  }, [receipts, searchTerm, warehouses]);

  const totalPages = Math.ceil(filteredReceipts.length / pageSize) || 1;
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-line shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8a949d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference, product, warehouse..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-line rounded-xl text-sm font-medium focus:outline-brand-green bg-[#fcfdfa]"
          />
        </div>
        {onOpenReceiveModal && (
          <button
            onClick={onOpenReceiveModal}
            className="h-[40px] px-5 rounded-full bg-brand-green text-white font-[800] text-[13px] sm:text-[14px] hover:bg-brand-green2 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>
        )}
      </div>

      {/* Receipts Table */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-[#8a949d] font-semibold">Loading stocking records...</div>
        ) : (
          <>
            <Table headers={["Reference No", "Product", "Destination Warehouse", "Qty Received", "Date", "Description / Notes", "Status"]}>
              {paginatedReceipts.map((rec) => {
                const prodName = getReceiptProduct(rec);
                const ref = getReceiptRef(rec);
                const whName = getWarehouseName(rec.warehouseId);
                const qty = getReceiptQty(rec);
                const dateStr = getReceiptDate(rec);

                return (
                  <TableRow key={rec.id} className="hover:bg-[#fcfdfa]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#eaf4ea] text-brand-green flex items-center justify-center font-black text-xs shrink-0">
                          <PackageCheck className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-ink text-[14px]">{ref}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-ink text-[14px]">{prodName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium text-[#5b6671]">{whName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-extrabold bg-[#eaf4ea] text-brand-green">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        +{qty.toLocaleString()} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium text-[#5b6671]">{dateStr}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-[#5b6671] max-w-[260px] truncate" title={rec.description || "Direct stocking"}>
                        {rec.description || <span className="text-[#8a949d] italic">No description</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 inline-flex rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#f4fce3] text-[#65a30d]">
                        {rec.status || "Received"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedReceipts.length === 0 && (
                <TableRow>
                  <TableCell>
                    <div className="p-10 text-center text-[#8a949d] font-semibold w-full block">
                      No stocking records found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredReceipts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
