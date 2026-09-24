import { MetricCard, Panel } from "../components/ui/Card";
import { demo } from "../data/mockData";
import { ProgressBar } from "../components/ui/ProgressBar";

export function Dashboard() {
  const today = new Date().toDateString();
  const todayOrders = demo.orders.filter(o => new Date(o.created_at).toDateString() === today).length;
  
  const awaitingAmount = demo.orders
    .filter(o => String(o.payment_status).toLowerCase().includes("unpaid") || String(o.status).toLowerCase().includes("awaiting"))
    .reduce((sum, o) => sum + o.total_amount, 0);

  const paidRevenue = demo.orders
    .filter(o => String(o.payment_status).toLowerCase() === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const inProgress = demo.orders.filter(o => 
    ["under review", "quote sent", "awaiting payment", "payment confirmed", "processing", "scheduled for delivery", "out for delivery"].includes(String(o.status).toLowerCase())
  ).length;

  const lowStock = demo.products.filter(p => p.stock_quantity <= 10 || String(p.stock_status).toLowerCase().includes("low")).length;

  const upcomingDeliveries = demo.deliveries.filter(d => ["scheduled", "out for delivery"].includes(String(d.status).toLowerCase())).length;

  const fmtMoney = (val: number) => "$" + val.toLocaleString();

  // Status bars mock
  const statuses = ["new request", "under review", "quote sent", "awaiting payment", "processing", "delivered", "completed"];
  const statusCounts = statuses.map(status => ({
    label: status,
    count: demo.orders.filter(o => String(o.status).toLowerCase() === status).length
  }));
  const maxStatus = Math.max(...statusCounts.map(s => s.count), 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Dashboard</h1>
          <p className="text-text mt-2 max-w-[780px]">Track revenue, requests, payments, stock, deliveries and operational activity for Maritama Trading.</p>
        </div>
        <button className="h-[50px] px-[22px] rounded-full bg-brand-green text-white font-[800] hover:-translate-y-1 transition-transform shadow-[0_18px_42px_rgba(0,86,66,0.18)] cursor-pointer">
          Refresh Dashboard
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Today's Orders" value={todayOrders} subtitle="New order requests today" />
        <MetricCard title="Awaiting Payment" value={fmtMoney(awaitingAmount)} subtitle="Quote or invoice pending payment" variant="accent" />
        <MetricCard title="Orders in Progress" value={inProgress} subtitle="Review, processing or delivery stage" />
        <MetricCard title="Revenue This Month" value={fmtMoney(paidRevenue)} subtitle="Confirmed payment value" variant="lime" />
        <MetricCard title="Total Clients" value={demo.clients.length} subtitle="Retail, corporate and installer clients" />
        <MetricCard title="Low Stock Items" value={lowStock} subtitle="Products below reorder level" />
        <MetricCard title="Upcoming Deliveries" value={upcomingDeliveries} subtitle="Scheduled and out-for-delivery" />
        <MetricCard title="Referral Leads" value={demo.referrals.reduce((sum, r) => sum + r.leads_count, 0)} subtitle="Installer, influencer and sales referrals" />
      </div>

      <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
        <Panel>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl tracking-[-0.045em] leading-[1.05] font-bold">Revenue by week</h2>
              <p className="text-text mt-1.5 text-sm">Last 8 weeks</p>
            </div>
          </div>
          <div className="h-[300px] rounded-2xl bg-[#fbfcfa] p-5 pb-8 flex items-end gap-4 relative overflow-hidden" style={{ backgroundImage: "linear-gradient(to top, #e5eee3 1px, transparent 1px)", backgroundSize: "100% 25%" }}>
            {[10, 22, 16, 30, 42, 38, 54, 46].map((val, i) => (
              <div key={i} className="flex-1 min-w-[24px] bg-gradient-to-b from-brand-lime to-brand-green rounded-t-full relative" style={{ height: `${Math.max(val, 3)}%` }}>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[#6d7a84] text-xs">W{i+1}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl tracking-[-0.045em] leading-[1.05] font-bold">Orders by status</h2>
              <p className="text-text mt-1.5 text-sm">Current request pipeline</p>
            </div>
          </div>
          <div className="grid gap-3.5 mt-6">
            {statusCounts.map(item => (
              <ProgressBar 
                key={item.label} 
                label={item.label.replace(/\b\w/g, l => l.toUpperCase())} 
                value={item.count} 
                percentage={(item.count / maxStatus) * 100} 
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
