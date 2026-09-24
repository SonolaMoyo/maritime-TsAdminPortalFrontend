import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { demo } from "../data/mockData";

export function Referrals() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Referrals</h1>
          <p className="text-text mt-2 max-w-[780px]">Monitor referral partners, leads generated, and commission rates.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Partner", "Type", "Leads", "Converted", "Commission Rate", "Total Revenue"]}>
          {demo.referrals.map(ref => (
            <TableRow key={ref.id}>
              <TableCell><b className="block">{ref.name}</b></TableCell>
              <TableCell>{ref.referral_type}</TableCell>
              <TableCell>{ref.leads_count}</TableCell>
              <TableCell>{ref.converted_sales_count}</TableCell>
              <TableCell>{ref.commission_rate}%</TableCell>
              <TableCell><b className="block text-brand-green">{fmtMoney(ref.total_revenue)}</b></TableCell>
            </TableRow>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
