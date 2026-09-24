import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { demo } from "../data/mockData";

export function Distribution() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Distribution</h1>
          <p className="text-text mt-2 max-w-[780px]">Track inventory movement between branch warehouses.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Destination", "Product", "Quantity", "From Branch", "Status", "Assigned Staff"]}>
          {demo.distribution.map(dist => (
            <TableRow key={dist.id}>
              <TableCell><b className="block">{dist.destination}</b></TableCell>
              <TableCell>{dist.product_summary}</TableCell>
              <TableCell>{dist.quantity}</TableCell>
              <TableCell>{dist.branch}</TableCell>
              <TableCell><StatusPill status={dist.status} /></TableCell>
              <TableCell>{dist.assigned_staff}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
