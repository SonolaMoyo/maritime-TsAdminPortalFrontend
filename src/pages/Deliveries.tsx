import { useState } from "react";
import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { Pagination } from "../components/ui/Pagination";
import { demo } from "../data/mockData";

export function Deliveries() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedDeliveries = demo.deliveries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Deliveries</h1>
          <p className="text-text mt-2 max-w-[780px]">Schedule and track last-mile logistics to customers.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Order", "Customer", "Address", "Date", "Logistics", "Status", "Proof"]}>
          {paginatedDeliveries.map(delivery => (
            <TableRow key={delivery.id}>
              <TableCell><b className="block">{delivery.order_number}</b></TableCell>
              <TableCell>{delivery.customer_name}</TableCell>
              <TableCell>{delivery.delivery_address}</TableCell>
              <TableCell>{delivery.delivery_date}</TableCell>
              <TableCell>{delivery.logistics_partner}</TableCell>
              <TableCell><StatusPill status={delivery.status} /></TableCell>
              <TableCell>{delivery.proof_of_delivery}</TableCell>
            </TableRow>
          ))}
        </Table>
        <Pagination
          currentPage={currentPage}
          totalItems={demo.deliveries.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </Panel>
    </div>
  );
}
