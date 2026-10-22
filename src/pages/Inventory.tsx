import { useState, useMemo } from "react";
import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { Pagination } from "../components/ui/Pagination";
import { demo } from "../data/mockData";

export function Inventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(demo.products.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return demo.products.slice(start, start + pageSize);
  }, [currentPage, pageSize]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Inventory</h1>
          <p className="text-text mt-2 max-w-[780px]">Monitor stock quantity, reserved stock, available stock, product cost, selling price and warehouse location.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Product", "Brand", "Category", "Stock", "Reserved", "Available", "Status", "Warehouse"]}>
          {paginatedProducts.map(product => {
            const available = Math.max(product.stock_quantity - product.reserved_quantity, 0);
            return (
              <TableRow key={product.id}>
                <TableCell><b className="block">{product.name}</b></TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>{product.reserved_quantity}</TableCell>
                <TableCell>{available}</TableCell>
                <TableCell><StatusPill status={product.stock_status} /></TableCell>
                <TableCell>{product.warehouse_location}</TableCell>
              </TableRow>
            );
          })}
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={demo.products.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </Panel>
    </div>
  );
}
