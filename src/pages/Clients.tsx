import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { demo } from "../data/mockData";

export function Clients() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Clients</h1>
          <p className="text-text mt-2 max-w-[780px]">Manage retail, corporate, and installer CRM data.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Client", "Contact", "Location", "Type", "Source", "Assigned To", "Total Purchase"]}>
          {demo.clients.map(client => (
            <TableRow key={client.id}>
              <TableCell><b className="block">{client.name}</b></TableCell>
              <TableCell>
                {client.email}<br />
                <span className="text-text text-xs">{client.phone}</span>
              </TableCell>
              <TableCell>{client.location}</TableCell>
              <TableCell>{client.client_type}</TableCell>
              <TableCell>{client.referral_source}</TableCell>
              <TableCell>{client.assigned_sales_rep}</TableCell>
              <TableCell><b className="block text-brand-green">{fmtMoney(client.total_purchase_value)}</b></TableCell>
            </TableRow>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
