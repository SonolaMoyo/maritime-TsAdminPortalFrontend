import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, CheckCircle2, PackageCheck, Truck, Clock, ArrowRight, ShieldCheck, Trash2 } from "lucide-react";
import { Table, TableRow, TableCell } from "../../components/ui/Table";
import { StatusPill } from "../../components/ui/StatusPill";
import { ordersService } from "../../services/ordersService";
import { inventoryService } from "../../services/inventoryService";
import type { ProductInventory } from "../../data/mockInventory";
import type { Order, SegmentType, OrderStatus } from "../../data/mockOrders";
import { useSegment } from "../../context/SegmentContext";
import { MetricCard } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

const TABS: Array<"All" | OrderStatus> = [
  "All",
  "Processing",
  "Ready for Dispatch",
  "In Transit",
  "Delivered",
  "Completed",
  "Cancelled",
];

interface OrderItemRow {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  availableStock: number;
}

export function OrdersV2() {
  const navigate = useNavigate();
  const { segment } = useSegment();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState<ProductInventory[]>([]);

  const [addForm, setAddForm] = useState(() => ({
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    segment: "Solar Tech" as SegmentType,
    deliveryLocation: "",
    deliveryAddress: "",
    paymentMethod: "Bank Transfer",
    paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`
  }));

  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([
    { productId: "", productName: "", quantity: 1, unitPrice: 0, availableStock: 0 }
  ]);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const items = await inventoryService.getInventory();
      setInventoryProducts(items);
    } catch (err) {
      console.error("Failed to load inventory for orders:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchInventory();
  }, [fetchOrders, fetchInventory]);

  const handleOpenAddModal = () => {
    fetchInventory();
    setAddForm(prev => ({
      ...prev,
      customerName: "",
      companyName: "",
      email: "",
      phone: "",
      segment: segment !== 'All' ? (segment as SegmentType) : "Solar Tech",
      deliveryLocation: "",
      deliveryAddress: "",
      paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`
    }));
    setOrderItems([
      { productId: "", productName: "", quantity: 1, unitPrice: 0, availableStock: 0 }
    ]);
    setDeliveryFee(0);
    setIsAddModalOpen(true);
  };

  const handleItemProductChange = (index: number, productId: string) => {
    const selected = inventoryProducts.find(p => p.productId === productId);
    setOrderItems(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        productId,
        productName: selected ? selected.productName : "",
        availableStock: selected ? selected.availableQuantity : 0,
      };
      return next;
    });
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    setOrderItems(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity: Math.max(1, quantity),
      };
      return next;
    });
  };

  const handleItemUnitPriceChange = (index: number, unitPrice: number) => {
    setOrderItems(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        unitPrice: Math.max(0, unitPrice),
      };
      return next;
    });
  };

  const handleAddItemRow = () => {
    setOrderItems(prev => [
      ...prev,
      { productId: "", productName: "", quantity: 1, unitPrice: 0, availableStock: 0 }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (orderItems.length <= 1) return;
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculatedSubtotal = orderItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const calculatedTotal = calculatedSubtotal + Number(deliveryFee || 0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = orderItems.filter(i => i.productId && i.productName);
    if (validItems.length === 0) {
      alert("Please select at least one product from inventory for this order.");
      return;
    }

    setIsAdding(true);
    try {
      const items = validItems.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        allocatedQuantity: 0,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryAmt = Number(deliveryFee || 0);
      const totalAmount = subtotal + deliveryAmt;

      await ordersService.createOrder({
        customerName: addForm.customerName,
        companyName: addForm.companyName,
        email: addForm.email,
        phone: addForm.phone,
        segment: addForm.segment,
        items,
        subtotal,
        deliveryFee: deliveryAmt,
        totalAmount,
        paymentMethod: addForm.paymentMethod,
        paymentRef: addForm.paymentRef,
        delivery: {
          status: "Processing",
          location: addForm.deliveryLocation,
          address: addForm.deliveryAddress,
        },
      });

      await fetchOrders();
      setIsAddModalOpen(false);
      setAddForm({
        customerName: "",
        companyName: "",
        email: "",
        phone: "",
        segment: "Solar Tech",
        deliveryLocation: "",
        deliveryAddress: "",
        paymentMethod: "Bank Transfer",
        paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      setOrderItems([{ productId: "", productName: "", quantity: 1, unitPrice: 0, availableStock: 0 }]);
      setDeliveryFee(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const segmentFiltered = orders.filter(o => segment === "All" || o.segment === segment);

  const stats = {
    total: segmentFiltered.length,
    processing: segmentFiltered.filter(o => o.status === "Processing").length,
    readyForDispatch: segmentFiltered.filter(o => o.status === "Ready for Dispatch").length,
    inTransit: segmentFiltered.filter(o => o.status === "In Transit").length,
    delivered: segmentFiltered.filter(o => o.status === "Delivered").length,
    completed: segmentFiltered.filter(o => o.status === "Completed").length,
    cancelled: segmentFiltered.filter(o => o.status === "Cancelled").length,
    totalRevenue: segmentFiltered.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.payment.amountPaid, 0),
    activeFulfillmentValue: segmentFiltered
      .filter(o => ["Processing", "Ready for Dispatch", "In Transit"].includes(o.status))
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const getTabCount = (tab: string) => {
    if (tab === "All") return segmentFiltered.length;
    return segmentFiltered.filter(o => o.status === tab).length;
  };

  const searchFiltered = segmentFiltered.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.customerName.toLowerCase().includes(q) ||
           o.companyName.toLowerCase().includes(q) ||
           o.orderNumber.toLowerCase().includes(q) ||
           o.payment.reference?.toLowerCase().includes(q);
  });

  const finalFiltered = searchFiltered.filter(o => {
    if (activeTab === "All") return true;
    return o.status === activeTab;
  });

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">
            Orders {segment !== 'All' && <span className="text-brand-green">— {segment}</span>}
          </h1>
          <p className="text-[#5b6671] text-xs sm:text-[15px] font-medium">
            Manage confirmed & paid orders through inventory allocation, staging, dispatch, and final delivery.
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="h-[44px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Order
        </button>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <MetricCard 
          title="Total Order Revenue" 
          value={`₦${stats.totalRevenue.toLocaleString()}`} 
          subtitle="Prepaid & confirmed operational revenue" 
          variant="lime"
        />
        <MetricCard 
          title="Active Fulfillment Pipeline" 
          value={`₦${stats.activeFulfillmentValue.toLocaleString()}`} 
          subtitle="Value currently being packed, staged or in transit" 
          variant="accent"
        />
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
        <div 
          onClick={() => setActiveTab("All")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="Total Orders" 
            value={stats.total} 
            subtitle="All active records" 
            className={`min-h-[96px] ${activeTab === "All" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
        <div 
          onClick={() => setActiveTab("Processing")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="Processing" 
            value={stats.processing} 
            subtitle="Stock allocation & prep" 
            className={`min-h-[96px] ${activeTab === "Processing" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
        <div 
          onClick={() => setActiveTab("Ready for Dispatch")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="Ready to Ship" 
            value={stats.readyForDispatch} 
            subtitle="Packaged & staged" 
            className={`min-h-[96px] ${activeTab === "Ready for Dispatch" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
        <div 
          onClick={() => setActiveTab("In Transit")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="In Transit" 
            value={stats.inTransit} 
            subtitle="With carrier / courier" 
            className={`min-h-[96px] ${activeTab === "In Transit" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
        <div 
          onClick={() => setActiveTab("Delivered")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="Delivered" 
            value={stats.delivered} 
            subtitle="Drop-off confirmed" 
            className={`min-h-[96px] ${activeTab === "Delivered" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
        <div 
          onClick={() => setActiveTab("Completed")}
          className={`cursor-pointer transition-transform hover:-translate-y-0.5`}
        >
          <MetricCard 
            title="Completed" 
            value={stats.completed} 
            subtitle="Archived & closed" 
            className={`min-h-[96px] ${activeTab === "Completed" ? "border-brand-green ring-2 ring-brand-green/20" : ""}`} 
          />
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#e4ece2] pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-[800] text-[13px] whitespace-nowrap transition-all ${
                  isActive 
                    ? "bg-brand-green text-white shadow-sm" 
                    : "text-[#5b6671] hover:bg-[#f0f4f1] hover:text-ink cursor-pointer"
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-[#e5eee3] text-[#5b6671]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a949d]" />
            <input 
              type="text" 
              placeholder="Search by ID, client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[40px] pl-10 pr-4 rounded-full border border-line bg-[#fcfdfa] text-[13px] font-medium text-ink w-full sm:w-[260px] focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>
          <button className="h-[40px] px-4 rounded-full border border-line bg-white text-[#5b6671] font-[800] text-[13px] hover:bg-[#fcfdfa] transition-all flex items-center gap-2 cursor-pointer flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="hidden xs:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[#8a949d] font-semibold flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 animate-spin text-brand-green" /> Loading operational orders...
          </div>
        ) : (
          <Table headers={["Order ID", "Customer & Segment", "Items & Value", "Payment Verification", "Fulfillment Stage", "Logistics Status", "Date", "Action"]}>
            {finalFiltered.map((order) => {
              const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
              const totalAllocated = order.items.reduce((sum, i) => sum + i.allocatedQuantity, 0);
              const isAllocated = totalAllocated >= totalItems;

              return (
                <TableRow key={order.id} className="cursor-pointer hover:bg-[#fcfdfa] transition-colors" onClick={() => navigate(`/orders/${order.id}`)}>
                  <TableCell>
                    <div className="font-bold text-ink text-[14px]">{order.orderNumber}</div>
                    <div className="text-[11px] font-bold text-[#8a949d]">Prepaid</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-bold text-ink text-[14px]">{order.customerName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-[#5b6671]">{order.companyName || "Individual Client"}</span>
                      <span className="text-[11px] font-bold text-brand-green bg-[#eff5ed] px-2 py-0.5 rounded-full">{order.segment}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-black text-ink text-[14px]">₦{order.totalAmount.toLocaleString()}</div>
                    <div className="text-[12px] text-[#5b6671] font-medium">
                      {totalItems} {totalItems === 1 ? "unit" : "units"} ({order.items.length} {order.items.length === 1 ? "line item" : "line items"})
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff5ed] text-brand-green text-[12px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                      <span>Paid • {order.payment.method}</span>
                    </div>
                    {order.payment.reference && (
                      <div className="text-[11px] font-mono text-[#8a949d] mt-1 pl-1">
                        Ref: {order.payment.reference}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <StatusPill status={order.status} />
                      {order.status === "Processing" && (
                        <span className={`text-[11px] font-bold ${isAllocated ? "text-brand-green" : "text-[#996600]"}`}>
                          {isAllocated ? "✓ Fully Allocated" : `${totalAllocated}/${totalItems} allocated`}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#5b6671]" />
                      <span>{order.delivery.status}</span>
                    </div>
                    <div className="text-[11px] text-[#8a949d] truncate max-w-[160px]">{order.delivery.location}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-[13px] font-medium text-ink">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </TableCell>

                  <TableCell>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                      className="inline-flex items-center gap-1 text-[13px] font-[800] text-brand-green hover:text-brand-green2 hover:underline cursor-pointer"
                    >
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}

            {finalFiltered.length === 0 && (
              <TableRow>
                <TableCell>
                  <div className="p-12 text-center text-[#8a949d] font-semibold w-full block">
                    No orders found in "{activeTab}".
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      {/* Create Order Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Confirmed Order">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="bg-[#eff5ed] border border-[#d2ff2f]/50 p-3 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
            <p className="text-[12px] font-semibold text-brand-green leading-snug">
              Orders created here are automatically confirmed, recorded as <strong>Paid</strong>, and sent directly into the <strong>Processing</strong> fulfillment queue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Customer Name *</label>
              <input required type="text" value={addForm.customerName} onChange={e => setAddForm({...addForm, customerName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. Adeola Adeleke" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Company</label>
              <input type="text" value={addForm.companyName} onChange={e => setAddForm({...addForm, companyName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. Apex Energy Ltd" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Email *</label>
              <input required type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="adeola@example.com" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Phone *</label>
              <input required type="text" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="+234 800 000 0000" />
            </div>
          </div>
          
          <hr className="border-line my-2" />
          
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Segment *</label>
              <select required value={addForm.segment} onChange={e => setAddForm({...addForm, segment: e.target.value as SegmentType})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option value="Solar Tech">Solar Tech</option>
                <option value="Luxe">Luxe</option>
                <option value="EV">EV</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            {/* Multiple Product Selection linked to Inventory */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-black uppercase tracking-wider text-ink">
                  Order Products ({orderItems.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="text-[12px] font-bold text-brand-green hover:text-brand-green2 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Product
                </button>
              </div>

              {orderItems.map((item, index) => (
                <div key={index} className="p-3.5 rounded-xl border border-line bg-[#fcfdfa] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#8a949d] uppercase">Product #{index + 1}</span>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        className="text-[#a11f1f] hover:text-red-700 p-1 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-[#8a949d] mb-1">Select Inventory Product *</label>
                      <select
                        required
                        value={item.productId}
                        onChange={e => handleItemProductChange(index, e.target.value)}
                        className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white font-medium text-ink"
                      >
                        <option value="">-- Choose Product from Inventory --</option>
                        {inventoryProducts.map(p => (
                          <option key={`${p.id}-${p.productId}`} value={p.productId}>
                            {p.productName} ({p.availableQuantity} available • {p.segment})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#8a949d] mb-1">Qty *</label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemQuantityChange(index, Number(e.target.value))}
                        className="w-full border border-line rounded-lg px-2.5 py-2 text-sm focus:outline-brand-green text-center font-bold text-ink bg-white"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-[#8a949d] mb-1">Unit Price (₦) *</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={e => handleItemUnitPriceChange(index, Number(e.target.value))}
                        className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green font-medium text-ink bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#5b6671] pt-1 border-t border-line/60">
                    <span>
                      {item.availableStock > 0 ? (
                        <span className="text-brand-green font-semibold">✓ {item.availableStock} units in warehouse</span>
                      ) : item.productId ? (
                        <span className="text-[#a11f1f] font-semibold">⚠ 0 units available in warehouse</span>
                      ) : (
                        <span>Select a product to view stock</span>
                      )}
                    </span>
                    <span className="font-bold text-ink">Line Total: ₦{(item.quantity * item.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-line my-2" />

            {/* Payment & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Payment Method *</label>
                <select value={addForm.paymentMethod} onChange={e => setAddForm({...addForm, paymentMethod: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Corporate Transfer">Corporate Transfer</option>
                  <option value="Direct Deposit">Direct Deposit</option>
                  <option value="POS / Cash">POS / Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Payment Reference *</label>
                <input required type="text" value={addForm.paymentRef} onChange={e => setAddForm({...addForm, paymentRef: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green font-mono" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Delivery City/State *</label>
                <input required type="text" value={addForm.deliveryLocation} onChange={e => setAddForm({...addForm, deliveryLocation: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. Lagos, Nigeria" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Street Address</label>
                <input type="text" value={addForm.deliveryAddress} onChange={e => setAddForm({...addForm, deliveryAddress: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. 14 Industrial Way, Ikeja" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Delivery Fee / Amount (₦)</label>
                <input type="number" min="0" value={deliveryFee} onChange={e => setDeliveryFee(Math.max(0, Number(e.target.value)))} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green font-bold text-ink" placeholder="0" />
              </div>
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-[#fcfdfa] p-3.5 rounded-xl border border-line space-y-2 text-sm">
              <div className="flex justify-between text-[#5b6671]">
                <span>Items Subtotal ({orderItems.reduce((acc, i) => acc + (i.productId ? i.quantity : 0), 0)} unit(s)):</span>
                <span className="font-bold text-ink">₦{calculatedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5b6671]">
                <span>Delivery Fee:</span>
                <span className="font-bold text-ink">₦{Number(deliveryFee || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between items-center text-ink font-bold">
                <span>Total Order Amount:</span>
                <span className="text-lg text-brand-green font-black">₦{calculatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={isAdding} className="w-full sm:w-auto px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                <PackageCheck className="w-4 h-4" />
                {isAdding ? "Queuing Order..." : "Confirm & Move to Processing"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

    </div>
  );
}
