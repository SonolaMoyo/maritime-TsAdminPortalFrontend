import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { demo } from "../data/mockData";

export function Orders() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Orders</h1>
          <p className="text-text mt-2 max-w-[780px]">Review requests, move orders through quotation, payment, processing, delivery and completion.</p>
        </div>
        <button className="h-[50px] px-[22px] rounded-full bg-brand-lime text-ink font-[800] hover:-translate-y-1 transition-transform shadow-[0_18px_42px_rgba(210,255,47,0.24)] cursor-pointer">
          Add Order
        </button>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Order", "Client", "Products", "Status", "Payment", "Delivery", "Total", "Actions"]}>
          {demo.orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>
                <b className="block">{order.order_number}</b>
                <small className="text-text">{formatDate(order.created_at)}</small>
              </TableCell>
              <TableCell>
                {order.customer_name}
                <br />
                <small className="text-text">{order.email}</small>
              </TableCell>
              <TableCell>{order.product_summary}</TableCell>
              <TableCell><StatusPill status={order.status} /></TableCell>
              <TableCell><StatusPill status={order.payment_status} /></TableCell>
              <TableCell><StatusPill status={order.delivery_status} /></TableCell>
              <TableCell><b className="block">{fmtMoney(order.total_amount)}</b></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold hover:bg-gray-50 cursor-pointer">Quote</button>
                  <button className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold hover:bg-gray-50 cursor-pointer">Process</button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
