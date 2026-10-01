import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Inbox, Package, Folder, ArrowUpRight, 
  Calendar, TrendingUp, ChevronRight
} from "lucide-react";
import { Panel } from "../../components/ui/Card";
import { useSegment } from "../../context/SegmentContext";

// Months configuration
const MONTHS = [
  { value: "all", label: "Full Year (All Months)" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October (Current)" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = ["2026", "2025", "2024"];

// Interactive SVG Area Chart component for smooth graph movement
interface GraphProps {
  data: { label: string; value: number; secondary?: number }[];
  color: string;
  fillGradient: [string, string];
  unit?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
}

function MovementGraph({ data, color, fillGradient, unit = "" }: GraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  // Chart dimensions
  const width = 460;
  const height = 150;
  const paddingX = 24;
  const paddingY = 20;

  // Generate SVG coordinates
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.value - minVal) / range) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // SVG path definition
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, "");

  // Area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const gradientId = `gradient-${fillGradient[0].replace("#", "")}-${fillGradient[1].replace("#", "")}`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillGradient[0]} stopOpacity="0.45" />
            <stop offset="100%" stopColor={fillGradient[1]} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingY + ratio * (height - paddingY * 2);
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#e4ece2"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          );
        })}

        {/* Fill Area */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke Curve */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data Points */}
        {points.map((pt, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g key={i} className="cursor-pointer">
              {/* Invisible touch target */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="16"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Visible circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "4"}
                fill={isHovered ? "#fff" : color}
                stroke={color}
                strokeWidth={isHovered ? "3" : "2"}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Info Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute -top-1 pointer-events-none transform -translate-x-1/2 bg-ink text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg transition-all duration-150 z-20 flex items-center gap-1.5 whitespace-nowrap"
          style={{ 
            left: `${(points[hoveredIndex].x / width) * 100}%`
          }}
        >
          <span>{points[hoveredIndex].label}:</span>
          <span className="text-brand-lime">
            {unit}{points[hoveredIndex].value.toLocaleString()}
          </span>
        </div>
      )}

      {/* X-Axis labels */}
      <div className="flex justify-between px-3 -mt-2 text-[11px] font-bold text-[#8a949d]">
        {data.map((d, i) => (
          <span 
            key={i} 
            className={`transition-colors ${hoveredIndex === i ? "text-ink font-black" : ""}`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DashboardV2() {
  const navigate = useNavigate();
  const { segment } = useSegment();

  // Year and Month Filters - Defaulting to October 2026 (current time)
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMonth, setSelectedMonth] = useState<string>("10");

  // Multiplier depending on selected period & segment to provide realistic dynamic movement
  const periodMultiplier = useMemo(() => {
    let base = 1.0;
    if (selectedYear === "2025") base *= 0.82;
    if (selectedYear === "2024") base *= 0.65;
    if (selectedMonth === "all") base *= 10.5;
    else {
      const m = parseInt(selectedMonth, 10);
      base *= (0.75 + (m % 5) * 0.12);
    }
    if (segment !== "All") base *= 0.45;
    return base;
  }, [selectedYear, selectedMonth, segment]);

  // Dynamic Movement Data for the 4 features
  const isAllMonths = selectedMonth === "all";

  // 1. Orders Movement Data
  const ordersData = useMemo(() => {
    if (isAllMonths) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return labels.map((label, i) => {
        const val = Math.round((14 + (i * 2.5) + (i % 3) * 4) * (periodMultiplier / 8));
        return { label, value: Math.max(val, 2) };
      });
    }
    return [
      { label: "W1", value: Math.round(6 * periodMultiplier) },
      { label: "W2", value: Math.round(9 * periodMultiplier) },
      { label: "W3", value: Math.round(14 * periodMultiplier) },
      { label: "W4", value: Math.round(18 * periodMultiplier) },
    ];
  }, [isAllMonths, periodMultiplier]);

  // 2. Requests Movement Data
  const requestsData = useMemo(() => {
    if (isAllMonths) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return labels.map((label, i) => {
        const val = Math.round((22 + (i * 3) + ((i % 4) * 3)) * (periodMultiplier / 8));
        return { label, value: Math.max(val, 4) };
      });
    }
    return [
      { label: "W1", value: Math.round(8 * periodMultiplier) },
      { label: "W2", value: Math.round(12 * periodMultiplier) },
      { label: "W3", value: Math.round(17 * periodMultiplier) },
      { label: "W4", value: Math.round(23 * periodMultiplier) },
    ];
  }, [isAllMonths, periodMultiplier]);

  // 3. Inventory Movement Data
  const inventoryData = useMemo(() => {
    if (isAllMonths) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return labels.map((label, i) => {
        const val = Math.round((180 + (i * 18) - ((i % 3) * 12)) * (periodMultiplier / 8));
        return { label, value: Math.max(val, 50) };
      });
    }
    return [
      { label: "W1", value: Math.round(210 * periodMultiplier) },
      { label: "W2", value: Math.round(245 * periodMultiplier) },
      { label: "W3", value: Math.round(290 * periodMultiplier) },
      { label: "W4", value: Math.round(340 * periodMultiplier) },
    ];
  }, [isAllMonths, periodMultiplier]);

  // 4. Catalog Movement Data
  const catalogData = useMemo(() => {
    if (isAllMonths) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return labels.map((label, i) => {
        const val = Math.round((12 + Math.floor(i * 1.5)) * (periodMultiplier > 1 ? 1.5 : 1));
        return { label, value: Math.max(val, 6) };
      });
    }
    return [
      { label: "W1", value: Math.round(16 * (periodMultiplier > 1 ? 1.3 : 1)) },
      { label: "W2", value: Math.round(18 * (periodMultiplier > 1 ? 1.3 : 1)) },
      { label: "W3", value: Math.round(21 * (periodMultiplier > 1 ? 1.3 : 1)) },
      { label: "W4", value: Math.round(24 * (periodMultiplier > 1 ? 1.3 : 1)) },
    ];
  }, [isAllMonths, periodMultiplier]);

  // High-level Stats calculated for period
  const stats = useMemo(() => {
    const totalOrderCount = ordersData.reduce((s, d) => s + d.value, 0);
    const orderRevenue = Math.round(totalOrderCount * 285000);
    const inFulfillment = Math.max(1, Math.round(totalOrderCount * 0.42));
    const fulfilled = Math.max(0, totalOrderCount - inFulfillment);

    const totalRequests = requestsData.reduce((s, d) => s + d.value, 0);
    const wonRequests = Math.round(totalRequests * 0.48);
    const activeRequests = totalRequests - wonRequests;
    const requestPipelineValue = Math.round(totalRequests * 410000);

    const totalStock = inventoryData[inventoryData.length - 1].value;
    const healthyStockPct = 94;
    const activeWarehouses = 4;
    const incomingShipments = Math.round(3 * periodMultiplier) || 2;

    const publishedProducts = catalogData[catalogData.length - 1].value;
    const categoriesCount = segment === "All" ? 8 : 3;
    const featuredItems = Math.min(publishedProducts, 6);

    return {
      orders: { total: totalOrderCount, revenue: orderRevenue, inFulfillment, fulfilled },
      requests: { total: totalRequests, won: wonRequests, active: activeRequests, pipelineValue: requestPipelineValue },
      inventory: { totalStock, healthPct: healthyStockPct, warehouses: activeWarehouses, incoming: incomingShipments },
      catalog: { published: publishedProducts, categories: categoriesCount, featured: featuredItems }
    };
  }, [ordersData, requestsData, inventoryData, catalogData, periodMultiplier, segment]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink tracking-tight">
            Dashboard {segment !== "All" && <span className="text-brand-green">— {segment}</span>}
          </h1>
        </div>

        {/* Time Adjuster Bar (Month & Year Filter) */}
        <div className="bg-white border border-line rounded-2xl p-2.5 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8a949d] pl-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-brand-green" />
            <span>Period:</span>
          </div>

          {/* Month Selector */}
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-[38px] px-3 rounded-xl border border-line bg-[#fcfdfa] text-sm font-bold text-ink focus:outline-none focus:border-brand-green cursor-pointer"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Year Selector */}
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-[38px] px-3 rounded-xl border border-line bg-[#fcfdfa] text-sm font-bold text-ink focus:outline-none focus:border-brand-green cursor-pointer"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {(selectedMonth !== "10" || selectedYear !== "2026") && (
            <button
              onClick={() => { setSelectedMonth("10"); setSelectedYear("2026"); }}
              className="text-xs font-bold text-brand-green hover:underline px-2 py-1 cursor-pointer"
              title="Reset to current month"
            >
              Reset to Current
            </button>
          )}
        </div>
      </div>

      {/* 4 Major Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. ORDERS CARD & GRAPH */}
        <div 
          onClick={() => navigate('/orders')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#d8edd6] text-brand-green flex items-center justify-center shadow-sm">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Orders
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-xs text-[#5b6671] font-medium">Prepaid orders & fulfillment velocity</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/orders'); }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-[#fcfdfa] p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Orders</span>
                  <strong className="text-2xl font-black text-ink">{stats.orders.total}</strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Prepaid</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Paid Revenue</span>
                  <strong className="text-xl font-black text-brand-green">₦{stats.orders.revenue.toLocaleString()}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Verified</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">In Fulfillment</span>
                  <strong className="text-2xl font-black text-blue-600">{stats.orders.inFulfillment}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">{stats.orders.fulfilled} completed</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
                    Order Volume Movement ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-brand-green font-black">Active Trajectory</span>
                </div>
                <MovementGraph 
                  data={ordersData} 
                  color="#005642" 
                  fillGradient={["#005642", "#d2ff2f"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-line flex items-center justify-between text-xs text-[#8a949d]">
              <span>Stages: Processing &bull; Ready to Dispatch &bull; In Transit &bull; Delivered</span>
              <span className="font-bold text-brand-green group-hover:underline">Explore Orders &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 2. REQUESTS CARD & GRAPH */}
        <div 
          onClick={() => navigate('/requests')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#f2f7ef] text-brand-green flex items-center justify-center shadow-sm">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Requests
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-xs text-[#5b6671] font-medium">Commercial quotes, inquiries & win rate</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/requests'); }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Requests</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-[#fcfdfa] p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Quotes</span>
                  <strong className="text-2xl font-black text-ink">{stats.requests.total}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Inquiries</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Deals Won</span>
                  <strong className="text-2xl font-black text-brand-green">{stats.requests.won}</strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">48% Win Rate</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">In Negotiation</span>
                  <strong className="text-2xl font-black text-[#996600]">{stats.requests.active}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Active Leads</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    Quote Request Inflow ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-blue-600 font-black">Lead Momentum</span>
                </div>
                <MovementGraph 
                  data={requestsData} 
                  color="#0055cc" 
                  fillGradient={["#0055cc", "#e6f0ff"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-line flex items-center justify-between text-xs text-[#8a949d]">
              <span>Pipeline: New &bull; Contacted &bull; Quote Sent &bull; Negotiation &bull; Won</span>
              <span className="font-bold text-brand-green group-hover:underline">Explore Requests &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 3. INVENTORY CARD & GRAPH */}
        <div 
          onClick={() => navigate('/inventory')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#e4ece2] text-brand-green flex items-center justify-center shadow-sm">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Inventory
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-xs text-[#5b6671] font-medium">Warehouse stock levels & movement</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/inventory'); }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Inventory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-[#fcfdfa] p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Stock Units</span>
                  <strong className="text-2xl font-black text-ink">{stats.inventory.totalStock}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Across Hubs</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Stock Health</span>
                  <strong className="text-2xl font-black text-brand-green">{stats.inventory.healthPct}%</strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Optimal Level</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Warehouses</span>
                  <strong className="text-2xl font-black text-purple-700">{stats.inventory.warehouses}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">{stats.inventory.incoming} Inbound</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    Stock Availability Movement ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-purple-600 font-black">Stock Throughput</span>
                </div>
                <MovementGraph 
                  data={inventoryData} 
                  color="#6b46c1" 
                  fillGradient={["#6b46c1", "#faf5ff"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-line flex items-center justify-between text-xs text-[#8a949d]">
              <span>Logistics: Warehouses &bull; Stock Transfers &bull; Inbound Receipts &bull; Suppliers</span>
              <span className="font-bold text-brand-green group-hover:underline">Explore Inventory &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 4. CATALOG CARD & GRAPH */}
        <div 
          onClick={() => navigate('/catalog')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#f4f7f5] text-brand-green flex items-center justify-center shadow-sm">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Catalog
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-xs text-[#5b6671] font-medium">Commercial product portfolio & brands</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/catalog'); }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-[#fcfdfa] p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Products</span>
                  <strong className="text-2xl font-black text-ink">{stats.catalog.published}</strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Published</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Categories</span>
                  <strong className="text-2xl font-black text-brand-green">{stats.catalog.categories}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Active Lines</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Featured</span>
                  <strong className="text-2xl font-black text-amber-600">{stats.catalog.featured}</strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Showcase Items</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-orange" />
                    Portfolio Growth Movement ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-brand-orange font-black">Catalog Expansion</span>
                </div>
                <MovementGraph 
                  data={catalogData} 
                  color="#f29a3b" 
                  fillGradient={["#f29a3b", "#fff8e6"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-line flex items-center justify-between text-xs text-[#8a949d]">
              <span>Content: Products &bull; Categories &bull; Featured Showcase &bull; Media</span>
              <span className="font-bold text-brand-green group-hover:underline">Explore Catalog &rarr;</span>
            </div>
          </Panel>
        </div>

      </div>

      {/* Quick Direct Navigation Bar */}
      {/* <div className="bg-white border border-line rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-[#8a949d] uppercase tracking-wider">
            Direct Operations Navigation
          </h3>
          <span className="text-xs text-[#5b6671] font-medium">Quick switch to any major module</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="p-3.5 rounded-xl border border-line bg-[#fcfdfa] hover:bg-[#eff5ed] hover:border-brand-green text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-brand-green">Orders Portal</div>
              <div className="text-[11px] text-[#5b6671]">Fulfillment & dispatch</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8a949d] group-hover:text-brand-green group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/requests')}
            className="p-3.5 rounded-xl border border-line bg-[#fcfdfa] hover:bg-[#eff5ed] hover:border-brand-green text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-brand-green">Quote Requests</div>
              <div className="text-[11px] text-[#5b6671]">Customer inquiries & leads</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8a949d] group-hover:text-brand-green group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/inventory')}
            className="p-3.5 rounded-xl border border-line bg-[#fcfdfa] hover:bg-[#eff5ed] hover:border-brand-green text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-brand-green">Stock & Inventory</div>
              <div className="text-[11px] text-[#5b6671]">Warehouses & shipments</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8a949d] group-hover:text-brand-green group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/catalog')}
            className="p-3.5 rounded-xl border border-line bg-[#fcfdfa] hover:bg-[#eff5ed] hover:border-brand-green text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-brand-green">Product Catalog</div>
              <div className="text-[11px] text-[#5b6671]">Showcase & categories</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8a949d] group-hover:text-brand-green group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div> */}
    </div>
  );
}
