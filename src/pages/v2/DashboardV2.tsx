import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Inbox, Package, Folder, ArrowUpRight, 
  Calendar, TrendingUp, ChevronRight, RotateCw, Loader2
} from "lucide-react";
import { Panel } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { useSegment } from "../../context/SegmentContext";
import { 
  analyticsService, 
  type OrdersStats, 
  type InventoryStats, 
  type RequestsStats, 
  type CatalogStats 
} from "../../services/analyticsService";

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

  if (!data || data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-xs text-[#8a949d] bg-[#fcfdfa] rounded-xl border border-line/60">
        No trend records found for this timeframe
      </div>
    );
  }

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

  // Individual states for light, independent loading
  const [ordersStats, setOrdersStats] = useState<OrdersStats | null>(null);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [requestsStats, setRequestsStats] = useState<RequestsStats | null>(null);
  const [catalogStats, setCatalogStats] = useState<CatalogStats | null>(null);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // 1. Fetch Orders calculation on-the-fly
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await analyticsService.getOrdersStats({
        year: selectedYear,
        month: selectedMonth,
        segment
      });
      setOrdersStats(data);
    } catch (err) {
      console.error("Orders stats error:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [selectedYear, selectedMonth, segment]);

  // 2. Fetch Inventory calculation on-the-fly
  const fetchInventory = useCallback(async () => {
    setLoadingInventory(true);
    try {
      const data = await analyticsService.getInventoryStats({
        year: selectedYear,
        month: selectedMonth,
        segment
      });
      setInventoryStats(data);
    } catch (err) {
      console.error("Inventory stats error:", err);
    } finally {
      setLoadingInventory(false);
    }
  }, [selectedYear, selectedMonth, segment]);

  // 3. Fetch Requests calculation on-the-fly
  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const data = await analyticsService.getRequestsStats({
        year: selectedYear,
        month: selectedMonth,
        segment
      });
      setRequestsStats(data);
    } catch (err) {
      console.error("Requests stats error:", err);
    } finally {
      setLoadingRequests(false);
    }
  }, [selectedYear, selectedMonth, segment]);

  // 4. Fetch Catalog calculation on-the-fly
  const fetchCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    try {
      const data = await analyticsService.getCatalogStats({
        year: selectedYear,
        month: selectedMonth,
        segment
      });
      setCatalogStats(data);
    } catch (err) {
      console.error("Catalog stats error:", err);
    } finally {
      setLoadingCatalog(false);
    }
  }, [selectedYear, selectedMonth, segment]);

  // Trigger individual endpoint queries whenever period or segment changes
  useEffect(() => {
    fetchOrders();
    fetchInventory();
    fetchRequests();
    fetchCatalog();
  }, [fetchOrders, fetchInventory, fetchRequests, fetchCatalog]);

  // Listen to external refresh signals (e.g., when an order or receipt is created)
  useEffect(() => {
    const handleRefresh = () => {
      fetchOrders();
      fetchInventory();
      fetchRequests();
      fetchCatalog();
    };
    window.addEventListener("dashboard-refresh", handleRefresh);
    return () => window.removeEventListener("dashboard-refresh", handleRefresh);
  }, [fetchOrders, fetchInventory, fetchRequests, fetchCatalog]);

  const isRefreshingAll = loadingOrders || loadingInventory || loadingRequests || loadingCatalog;

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full space-y-4 sm:space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Dashboard {segment !== "All" && <span className="text-brand-green">— {segment}</span>}
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6671] font-medium mt-1">
            Real-time live calculated operations velocity, stock levels, lead generation, and catalog portfolio.
          </p>
        </div>

        {/* Time Adjuster Bar (Month & Year Filter + Live Recalculate Button) */}
        <div className="w-full md:w-auto bg-white border border-line rounded-2xl p-2 sm:p-2.5 shadow-sm flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8a949d] pl-1 sm:pl-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-brand-green flex-shrink-0" />
            <span className="hidden xs:inline">Period:</span>
          </div>

          {/* Month Selector */}
          <div className="flex-1 sm:w-[200px]">
            <Select 
              searchable={true}
              value={selectedMonth} 
              onChange={(val) => setSelectedMonth(val)}
              options={MONTHS}
              buttonClassName="h-[38px] rounded-xl text-xs sm:text-sm font-bold bg-[#fcfdfa]"
            />
          </div>

          {/* Year Selector */}
          <div className="w-[110px]">
            <Select 
              searchable={false}
              value={selectedYear} 
              onChange={(val) => setSelectedYear(val)}
              options={YEARS}
              buttonClassName="h-[38px] rounded-xl text-xs sm:text-sm font-bold bg-[#fcfdfa]"
            />
          </div>

          {/* Recalculate Button */}
          <button
            type="button"
            onClick={() => {
              fetchOrders();
              fetchInventory();
              fetchRequests();
              fetchCatalog();
            }}
            disabled={isRefreshingAll}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-brand-green hover:bg-[#eff5ed] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Recalculate live statistics directly from database"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshingAll ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Recalculate</span>
          </button>

          {(selectedMonth !== "10" || selectedYear !== "2026") && (
            <button
              onClick={() => { setSelectedMonth("10"); setSelectedYear("2026"); }}
              className="text-xs font-bold text-brand-green hover:underline px-2 py-1 cursor-pointer"
              title="Reset to current month"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4 Major Features Grid:
          Layout Order:
          Row 1: Orders (left)    | Inventory (right)
          Row 2: Request (left)   | Catalog (right)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* 1. ORDERS CARD & GRAPH (Top Left) */}
        <div 
          onClick={() => navigate('/orders')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-4 sm:p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#d8edd6] text-brand-green flex items-center justify-center shadow-sm">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Orders
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#5b6671] font-medium">Prepaid orders & fulfillment velocity</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingOrders && (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/orders'); }}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span className="hidden xs:inline">Open</span> Orders
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 bg-[#fcfdfa] p-3 sm:p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Orders</span>
                  <strong className="text-xl sm:text-2xl font-black text-ink">
                    {ordersStats ? ordersStats.total : 0}
                  </strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Prepaid</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Paid Revenue</span>
                  <strong className="text-lg sm:text-xl font-black text-brand-green truncate block">
                    ₦{(ordersStats ? ordersStats.revenue : 0).toLocaleString()}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Verified</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">In Fulfillment</span>
                  <strong className="text-xl sm:text-2xl font-black text-blue-600">
                    {ordersStats ? ordersStats.inFulfillment : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">
                    {ordersStats ? ordersStats.fulfilled : 0} completed
                  </span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    Order Volume Movement ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-brand-green font-black flex-shrink-0">Live Active</span>
                </div>
                <MovementGraph 
                  data={ordersStats?.trend ?? []} 
                  color="#005642" 
                  fillGradient={["#005642", "#d2ff2f"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#8a949d]">
              <span className="line-clamp-1">Stages: Processing &bull; Ready &bull; In Transit &bull; Delivered</span>
              <span className="font-bold text-brand-green group-hover:underline flex-shrink-0">Explore Orders &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 2. INVENTORY CARD & GRAPH (Top Right) */}
        <div 
          onClick={() => navigate('/inventory')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-4 sm:p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#e4ece2] text-brand-green flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Inventory
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#5b6671] font-medium">Warehouse stock levels & movement</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingInventory && (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/inventory'); }}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span className="hidden xs:inline">Open</span> Inventory
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 bg-[#fcfdfa] p-3 sm:p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Stock Units</span>
                  <strong className="text-xl sm:text-2xl font-black text-ink">
                    {inventoryStats ? inventoryStats.totalStock : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Across Hubs</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Stock Health</span>
                  <strong className="text-xl sm:text-2xl font-black text-brand-green">
                    {inventoryStats ? inventoryStats.healthPct : 100}%
                  </strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Optimal</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Warehouses</span>
                  <strong className="text-xl sm:text-2xl font-black text-purple-700">
                    {inventoryStats ? inventoryStats.warehouses : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">
                    {inventoryStats ? inventoryStats.incoming : 0} Inbound
                  </span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    Stock Movement ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-purple-600 font-black flex-shrink-0">Throughput</span>
                </div>
                <MovementGraph 
                  data={inventoryStats?.trend ?? []} 
                  color="#6b46c1" 
                  fillGradient={["#6b46c1", "#faf5ff"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#8a949d]">
              <span className="line-clamp-1">Logistics: Hubs &bull; Transfers &bull; Receipts &bull; Stocking</span>
              <span className="font-bold text-brand-green group-hover:underline flex-shrink-0">Explore Inventory &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 3. REQUESTS CARD & GRAPH (Bottom Left) */}
        <div 
          onClick={() => navigate('/requests')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-4 sm:p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#f2f7ef] text-brand-green flex items-center justify-center shadow-sm">
                    <Inbox className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Requests
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#5b6671] font-medium">Commercial quotes, inquiries & win rate</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingRequests && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/requests'); }}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span className="hidden xs:inline">Open</span> Requests
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 bg-[#fcfdfa] p-3 sm:p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Total Quotes</span>
                  <strong className="text-xl sm:text-2xl font-black text-ink">
                    {requestsStats ? requestsStats.total : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Inquiries</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Deals Won</span>
                  <strong className="text-xl sm:text-2xl font-black text-brand-green">
                    {requestsStats ? requestsStats.won : 0}
                  </strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">
                    {requestsStats ? requestsStats.winRate : 0}% Win Rate
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">In Negotiation</span>
                  <strong className="text-xl sm:text-2xl font-black text-[#996600]">
                    {requestsStats ? requestsStats.active : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Active Leads</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    Quote Request Inflow ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-blue-600 font-black flex-shrink-0">Momentum</span>
                </div>
                <MovementGraph 
                  data={requestsStats?.trend ?? []} 
                  color="#0055cc" 
                  fillGradient={["#0055cc", "#e6f0ff"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#8a949d]">
              <span className="line-clamp-1">Pipeline: New &bull; Contacted &bull; Quote Sent &bull; Won</span>
              <span className="font-bold text-brand-green group-hover:underline flex-shrink-0">Explore Requests &rarr;</span>
            </div>
          </Panel>
        </div>

        {/* 4. CATALOG CARD & GRAPH (Bottom Right) */}
        <div 
          onClick={() => navigate('/catalog')}
          className="group cursor-pointer"
        >
          <Panel className="h-full border border-line hover:border-brand-green hover:shadow-lg transition-all rounded-2xl p-4 sm:p-6 bg-white relative flex flex-col justify-between">
            <div>
              {/* Header with Direct Redirect */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#eff5ed] to-[#f4f7f5] text-brand-green flex items-center justify-center shadow-sm">
                    <Folder className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-ink group-hover:text-brand-green transition-colors flex items-center gap-2">
                      Catalog
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#5b6671] font-medium">Commercial product portfolio & segments</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingCatalog && (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/catalog'); }}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f4f7f5] group-hover:bg-brand-green group-hover:text-white text-ink text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span className="hidden xs:inline">Open</span> Catalog
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 bg-[#fcfdfa] p-3 sm:p-3.5 rounded-xl border border-line">
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Products</span>
                  <strong className="text-xl sm:text-2xl font-black text-ink">
                    {catalogStats ? catalogStats.published : 0}
                  </strong>
                  <span className="text-[11px] text-brand-green font-bold block mt-0.5">Published</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Segments</span>
                  <strong className="text-xl sm:text-2xl font-black text-brand-green">
                    {catalogStats ? catalogStats.categories : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Active Lines</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a949d] uppercase block">Featured</span>
                  <strong className="text-xl sm:text-2xl font-black text-amber-600">
                    {catalogStats ? catalogStats.featured : 0}
                  </strong>
                  <span className="text-[11px] text-[#5b6671] block mt-0.5">Showcase</span>
                </div>
              </div>

              {/* Movement Graph */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#5b6671] mb-2 px-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                    Portfolio Growth ({selectedMonth === "all" ? "Monthly" : "Weekly"})
                  </span>
                  <span className="text-brand-orange font-black flex-shrink-0">Expansion</span>
                </div>
                <MovementGraph 
                  data={catalogStats?.trend ?? []} 
                  color="#f29a3b" 
                  fillGradient={["#f29a3b", "#fff8e6"]} 
                  unit=""
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#8a949d]">
              <span className="line-clamp-1">Content: Products &bull; Segments &bull; Featured &bull; Media</span>
              <span className="font-bold text-brand-green group-hover:underline flex-shrink-0">Explore Catalog &rarr;</span>
            </div>
          </Panel>
        </div>

      </div>
    </div>
  );
}
