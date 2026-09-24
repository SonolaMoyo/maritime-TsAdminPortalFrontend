import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { demo } from "../data/mockData";

export function Payments() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Payments</h1>
          <p className="text-text mt-2 max-w-[780px]">Track payment receipts, confirm bank transfers, and manage invoices.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Reference", "Client", "Method", "Amount", "Status", "Date", "Actions"]}>
          {demo.payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell><b className="block">{payment.payment_ref}</b></TableCell>
              <TableCell>{payment.customer_name}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell><b className="block">{fmtMoney(payment.amount)}</b></TableCell>
              <TableCell><StatusPill status={payment.status} /></TableCell>
              <TableCell>{formatDate(payment.created_at)}</TableCell>
              <TableCell>
                <button className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold hover:bg-gray-50 cursor-pointer">
                  {payment.status === "paid" ? "View Receipt" : "Confirm"}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
