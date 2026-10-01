import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, Plus, Truck, CheckCircle2, ShieldCheck, 
  Package, Send, CheckSquare, Printer, Ban, Layers, AlertCircle 
} from "lucide-react";
import { ordersService } from "../../services/ordersService";
import type { Order, OrderStatus } from "../../data/mockOrders";
import { Panel } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Modal } from "../../components/ui/Modal";

const LIFECYCLE_STAGES: OrderStatus[] = [
  "Processing",
  "Ready for Dispatch",
  "In Transit",
  "Delivered",
  "Completed",
];

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<
    "allocate" | "dispatch" | "confirmDelivery" | "complete" | "status" | "cancel" | "note" | "packingSlip" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  
  const [carrier, setCarrier] = useState("Company Delivery");
  const [trackingRef, setTrackingRef] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  const [receivedBy, setReceivedBy] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [cancelReason, setCancelReason] = useState("");
  const [newStatus, setNewStatus] = useState<OrderStatus>("Processing");
  const [noteText, setNoteText] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      const data = await ordersService.getOrderById(id);
      setOrder(data || null);
      if (data) {
        const allocs: Record<string, number> = {};
        data.items.forEach(item => allocs[item.id] = item.allocatedQuantity);
        setAllocations(allocs);
        setNewStatus(data.status);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchOrder();
      setLoading(false);
    };
    init();
  }, [fetchOrder]);

  if (loading) return <div className="p-12 text-center text-[#8a949d] font-semibold">Loading order workspace...</div>;
  if (!order) return <div className="p-12 text-center text-[#a11f1f] font-semibold">Order not found.</div>;

  const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAllocated = order.items.reduce((sum, i) => sum + i.allocatedQuantity, 0);
  const isFullyAllocated = totalAllocated >= totalQuantity;

  const currentIndex = LIFECYCLE_STAGES.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  // Handlers
  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.allocateStock(order.id, allocations);
    await ordersService.addActivity(order.id, "Inventory", "Stock allocation updated by Operations");
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleMarkReadyForDispatch = async () => {
    setIsSubmitting(true);
    await ordersService.markReadyForDispatch(order.id);
    await fetchOrder();
    setIsSubmitting(false);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.dispatchOrder(order.id, carrier, trackingRef, expectedDelivery);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.confirmDelivery(order.id, receivedBy || order.customerName, deliveryNotes);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    await ordersService.completeOrder(order.id);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.cancelOrder(order.id, cancelReason || "Cancelled by Operations");
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleStatusOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.updateStatus(order.id, newStatus);
    await ordersService.addActivity(order.id, "Status Change", `Status manually updated to ${newStatus}`);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    await ordersService.addNote(order.id, noteText);
    await fetchOrder();
    setNoteText("");
    setIsSubmitting(false);
    setActiveModal(null);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      {/* Header & Nav */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center gap-2 text-[#5b6671] text-sm font-bold hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-ink">{order.orderNumber}</h1>
              <StatusPill status={order.status} />
              <span className="text-[12px] font-bold text-brand-green bg-[#eff5ed] px-2.5 py-1 rounded-full">
                {order.segment}
              </span>
            </div>
            <p className="text-[#5b6671] text-[15px] font-medium flex items-center gap-2">
              <span>Total Value: <strong className="text-ink font-bold">₦{order.totalAmount.toLocaleString()}</strong></span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1 text-brand-green font-bold">
                <ShieldCheck className="w-4 h-4" /> Confirmed & Paid
              </span>
            </p>
          </div>
          
          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveModal("packingSlip")}
              className="h-[40px] px-3.5 rounded-full border border-line bg-white text-ink font-[800] text-[13px] hover:bg-[#fcfdfa] shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Print Packing Slip"
            >
              <Printer className="w-4 h-4 text-[#5b6671]" />
              <span>Packing Slip</span>
            </button>

            {/* Contextual Flow Action Buttons */}
            {order.status === "Processing" && (
              <>
                <button 
                  onClick={() => setActiveModal("allocate")} 
                  className="h-[40px] px-4 rounded-full bg-ink text-white font-[800] text-[13px] hover:bg-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Allocate Stock</span>
                </button>

                {isFullyAllocated && (
                  <button 
                    onClick={handleMarkReadyForDispatch} 
                    disabled={isSubmitting}
                    className="h-[40px] px-4 rounded-full bg-brand-green text-white font-[800] text-[13px] hover:bg-brand-green2 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ring-2 ring-brand-green/30"
                  >
                    <Package className="w-4 h-4" />
                    <span>Ready for Dispatch</span>
                  </button>
                )}
              </>
            )}

            {order.status === "Ready for Dispatch" && (
              <button 
                onClick={() => {
                  setTrackingRef(order.delivery.trackingRef || `MAR-${Math.floor(100000 + Math.random() * 900000)}`);
                  setActiveModal("dispatch");
                }} 
                className="h-[40px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm flex items-center gap-2 cursor-pointer ring-2 ring-brand-green/20"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Order</span>
              </button>
            )}

            {order.status === "In Transit" && (
              <button 
                onClick={() => {
                  setReceivedBy(order.customerName);
                  setActiveModal("confirmDelivery");
                }} 
                className="h-[40px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Delivery</span>
              </button>
            )}

            {order.status === "Delivered" && (
              <button 
                onClick={() => setActiveModal("complete")} 
                className="h-[40px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Complete & Close Order</span>
              </button>
            )}

            {/* Menu Dropdown / Change Status */}
            <button 
              onClick={() => setActiveModal("status")} 
              className="h-[40px] px-3.5 rounded-full border border-line bg-white text-ink font-[800] text-[13px] hover:bg-[#fcfdfa] shadow-sm cursor-pointer"
            >
              Change Status
            </button>

            {!isCancelled && order.status !== "Completed" && (
              <button 
                onClick={() => setActiveModal("cancel")} 
                className="h-[40px] px-3 rounded-full border border-line bg-white text-[#a11f1f] hover:bg-[#fff1f1] font-[800] text-[13px] transition-colors cursor-pointer"
                title="Cancel Order"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      {!isCancelled ? (
        <Panel className="mb-6 overflow-x-auto py-5">
          <div className="flex items-center min-w-[720px] justify-between relative px-6">
            <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-1.5 bg-[#e4ece2] -z-10 rounded-full" />
            <div 
              className="absolute left-[5%] top-1/2 -translate-y-1/2 h-1.5 bg-brand-green -z-10 rounded-full transition-all duration-500" 
              style={{ width: `${(Math.max(0, currentIndex) / (LIFECYCLE_STAGES.length - 1)) * 90}%` }} 
            />
            
            {LIFECYCLE_STAGES.map((stage, i) => {
              const isPast = i < currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all ${
                    isPast 
                      ? "bg-brand-green border-brand-green text-white" 
                      : isCurrent 
                        ? "bg-white border-brand-green text-brand-green shadow-[0_0_0_4px_rgba(210,255,47,0.35)]" 
                        : "bg-white border-line text-transparent"
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : "●"}
                  </div>
                  <span className={`text-[12px] font-bold whitespace-nowrap ${
                    isCurrent ? "text-brand-green" : isPast ? "text-ink" : "text-[#8a949d]"
                  }`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      ) : (
        <div className="mb-6 bg-[#fff1f1] border border-[#f5c2c2] p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#a11f1f]" />
          <div>
            <div className="text-sm font-bold text-[#a11f1f]">This order is Cancelled</div>
            <div className="text-xs text-[#5b6671]">Fulfillment operations and logistics have been halted.</div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <Panel>
            <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] text-[#8a949d] font-bold uppercase">Customer</label>
                <div className="text-[14px] font-bold text-ink mt-0.5">{order.customerName}</div>
              </div>
              <div>
                <label className="text-[11px] text-[#8a949d] font-bold uppercase">Company</label>
                <div className="text-[14px] font-bold text-ink mt-0.5">{order.companyName || "—"}</div>
              </div>
              <div>
                <label className="text-[11px] text-[#8a949d] font-bold uppercase">Email</label>
                <div className="text-[14px] font-bold text-brand-green hover:underline cursor-pointer mt-0.5 truncate">{order.email}</div>
              </div>
              <div>
                <label className="text-[11px] text-[#8a949d] font-bold uppercase">Phone</label>
                <div className="text-[14px] font-bold text-ink mt-0.5">{order.phone}</div>
              </div>
            </div>
          </Panel>

          {/* Line Items & Total */}
          <Panel>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d]">Purchased Line Items</h2>
              <span className="text-xs font-bold text-[#5b6671]">{order.items.length} items</span>
            </div>
            
            <div className="border border-line rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fcfdfa] border-b border-line text-[12px]">
                  <tr>
                    <th className="p-3 font-bold text-[#8a949d]">Product</th>
                    <th className="p-3 font-bold text-[#8a949d] text-center">Qty</th>
                    <th className="p-3 font-bold text-[#8a949d] text-right">Unit Price</th>
                    <th className="p-3 font-bold text-[#8a949d] text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-3 font-bold text-ink">{item.productName}</td>
                      <td className="p-3 font-medium text-ink text-center">{item.quantity}</td>
                      <td className="p-3 font-medium text-ink text-right">₦{item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 font-black text-ink text-right">₦{item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Calculation summary */}
            <div className="flex flex-col items-end text-sm space-y-1.5 pt-2">
              <div className="flex justify-between w-64 text-[#5b6671]">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-ink">₦{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between w-64 text-[#a11f1f]">
                  <span className="font-semibold">Discount</span>
                  <span className="font-bold">-₦{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-[#5b6671]">
                <span className="font-semibold">Delivery Fee</span>
                <span className="font-bold text-ink">₦{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-line w-64 pt-2 mt-1 flex justify-between">
                <span className="font-black text-ink">Paid Total</span>
                <span className="font-black text-xl text-ink">₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </Panel>

          {/* Inventory Allocation */}
          <Panel>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d]">Warehouse Stock Allocation</h2>
                <p className="text-xs text-[#5b6671] mt-0.5">
                  Allocate inventory from stock before packaging and staging for dispatch.
                </p>
              </div>
              {order.status === "Processing" && (
                <button 
                  onClick={() => setActiveModal("allocate")}
                  className="px-3 py-1.5 rounded-full border border-line bg-white hover:bg-[#fcfdfa] text-xs font-bold text-ink cursor-pointer"
                >
                  Adjust Allocation
                </button>
              )}
            </div>

            <div className="space-y-3">
              {order.items.map(item => {
                const itemAllocated = item.allocatedQuantity >= item.quantity;
                const percentage = Math.min(100, Math.round((item.allocatedQuantity / item.quantity) * 100));
                
                return (
                  <div key={item.id} className="p-3 border border-line rounded-xl bg-[#fcfdfa] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-ink text-sm">{item.productName}</div>
                      <div className="text-xs text-[#8a949d] mt-0.5">
                        Required: <strong className="text-ink">{item.quantity} units</strong> &middot; Allocated: <strong className={itemAllocated ? "text-brand-green" : "text-[#996600]"}>{item.allocatedQuantity} units</strong>
                      </div>
                      <div className="w-full bg-[#e4ece2] h-1.5 rounded-full mt-2 overflow-hidden max-w-[280px]">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${itemAllocated ? "bg-brand-green" : "bg-[#f29a3b]"}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${
                        itemAllocated ? "bg-[#eff5ed] text-brand-green" : "bg-[#fff8e6] text-[#996600]"
                      }`}>
                        {itemAllocated ? "Fully Allocated" : `${item.allocatedQuantity}/${item.quantity} Allocated`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.status === "Processing" && isFullyAllocated && (
              <div className="mt-4 p-3 rounded-xl bg-[#eff5ed] border border-[#d2ff2f]/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  <span className="text-xs font-bold text-brand-green">All items are allocated. Ready to stage for delivery?</span>
                </div>
                <button 
                  onClick={handleMarkReadyForDispatch}
                  className="px-3.5 py-1.5 rounded-full bg-brand-green text-white text-xs font-bold hover:bg-brand-green2 cursor-pointer"
                >
                  Mark Ready for Dispatch
                </button>
              </div>
            )}
          </Panel>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Confirmed Payment Panel */}
          <Panel>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green"/> Payment Record
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-[#eff5ed] text-brand-green">
                ✓ Confirmed
              </span>
            </div>

            <div className="space-y-3 bg-[#fcfdfa] p-3.5 rounded-xl border border-line">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#8a949d]">Amount Paid</span>
                <span className="text-base font-black text-brand-green">
                  ₦{order.payment.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#8a949d]">Payment Method</span>
                <span className="font-bold text-ink">{order.payment.method || "Bank Transfer"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#8a949d]">Reference ID</span>
                <span className="font-mono font-bold text-ink bg-white px-2 py-0.5 rounded border border-line">
                  {order.payment.reference}
                </span>
              </div>
              {order.payment.date && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#8a949d]">Payment Date</span>
                  <span className="font-medium text-ink">
                    {new Date(order.payment.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-[#5b6671] mt-2 italic text-center">
              Order was paid prior to processing initiation.
            </div>
          </Panel>

          {/* Delivery & Dispatch Panel */}
          <Panel>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d] flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-green"/> Delivery Logistics
              </h2>
              <span className="text-xs font-bold text-ink">{order.delivery.status}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8a949d] font-bold block mb-0.5">Destination</span>
                <div className="font-bold text-ink">{order.delivery.location}</div>
                <div className="text-[#5b6671] mt-0.5">{order.delivery.address}</div>
              </div>

              {order.delivery.carrier && (
                <div className="pt-2 border-t border-line">
                  <span className="text-[#8a949d] font-bold block mb-0.5">Carrier & Courier</span>
                  <div className="font-bold text-ink">{order.delivery.carrier}</div>
                </div>
              )}

              {order.delivery.trackingRef && (
                <div>
                  <span className="text-[#8a949d] font-bold block mb-0.5">Tracking Number</span>
                  <div className="font-mono font-bold text-brand-green">{order.delivery.trackingRef}</div>
                </div>
              )}

              {order.delivery.expectedDelivery && (
                <div>
                  <span className="text-[#8a949d] font-bold block mb-0.5">Expected Delivery</span>
                  <div className="font-semibold text-ink">
                    {new Date(order.delivery.expectedDelivery).toLocaleDateString()}
                  </div>
                </div>
              )}

              {order.delivery.receivedBy && (
                <div className="pt-2 border-t border-line bg-[#eff5ed] p-2.5 rounded-lg text-brand-green">
                  <span className="font-bold block">Received By:</span>
                  <div className="font-black text-sm">{order.delivery.receivedBy}</div>
                  {order.delivery.deliveryDate && (
                    <div className="text-[11px] mt-0.5">
                      on {new Date(order.delivery.deliveryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>

          {/* Activity Timeline */}
          <Panel>
            <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4"/> Activity Audit Trail
            </h2>
            <div className="relative border-l-2 border-[#e4ece2] ml-3 pl-4 space-y-4 max-h-[260px] overflow-y-auto pr-1">
              {order.activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[23px] bg-brand-green w-2.5 h-2.5 rounded-full border-2 border-white top-1 shadow-sm"></div>
                  <div className="text-[10px] font-black text-[#8a949d] uppercase">
                    {act.type} &middot; {new Date(act.date).toLocaleDateString()}
                  </div>
                  <div className="text-[12px] font-semibold text-ink leading-tight mt-0.5">
                    {act.description}
                  </div>
                  <div className="text-[10px] font-medium text-[#8a949d]">By {act.actor}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Internal Notes */}
          <Panel>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-black uppercase tracking-wider text-[#8a949d]">Internal Notes</h2>
              <button 
                onClick={() => setActiveModal("note")} 
                className="text-[12px] font-[800] text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3"/> Add
              </button>
            </div>
            {order.notes.length === 0 ? (
              <div className="text-[12px] text-[#8a949d] italic">No internal notes for this order.</div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {order.notes.map((note) => (
                  <div key={note.id} className="bg-[#fffdf5] border border-[#f2e6c4] p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-ink">{note.author}</span>
                      <span className="text-[10px] text-[#8a949d]">{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[12px] text-ink font-medium leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Allocate Stock Modal */}
      <Modal isOpen={activeModal === "allocate"} onClose={() => setActiveModal(null)} title="Allocate Inventory Stock">
        <form onSubmit={handleAllocate} className="space-y-4">
          <p className="text-xs text-[#5b6671]">
            Specify the quantity of stock physically assigned from the warehouse for each order item.
          </p>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-line rounded-xl bg-[#fcfdfa]">
                <div className="w-2/3">
                  <div className="font-bold text-ink text-sm">{item.productName}</div>
                  <div className="text-[11px] font-semibold text-[#8a949d]">Required: {item.quantity} units</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8a949d] font-bold">Qty:</span>
                  <input 
                    type="number" 
                    min="0" 
                    max={item.quantity} 
                    value={allocations[item.id] || 0} 
                    onChange={e => setAllocations({...allocations, [item.id]: Number(e.target.value)})} 
                    className="w-20 border border-line rounded-lg px-2 py-1 text-sm focus:outline-brand-green text-center font-bold text-ink bg-white" 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 cursor-pointer">
              Save Allocation
            </button>
          </div>
        </form>
      </Modal>

      {/* Dispatch Modal */}
      <Modal isOpen={activeModal === "dispatch"} onClose={() => setActiveModal(null)} title="Dispatch Order to Logistics">
        <form onSubmit={handleDispatch} className="space-y-4">
          <p className="text-xs text-[#5b6671]">
            Assign the courier service and tracking code. The order will automatically move to <strong>In Transit</strong>.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Carrier / Logistics *</label>
              <select value={carrier} onChange={e => setCarrier(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option value="Company Delivery">Company Fleet Delivery</option>
                <option value="DHL Express">DHL Express</option>
                <option value="FedEx">FedEx</option>
                <option value="GIG Logistics">GIG Logistics</option>
                <option value="Local Courier">Local Haulage Partner</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Tracking Code / Ref *</label>
              <input required type="text" value={trackingRef} onChange={e => setTrackingRef(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green font-mono" placeholder="TRK-001928" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Estimated Delivery Date *</label>
            <input required type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              <Send className="w-4 h-4" /> Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delivery Modal */}
      <Modal isOpen={activeModal === "confirmDelivery"} onClose={() => setActiveModal(null)} title="Confirm Drop-off & Delivery">
        <form onSubmit={handleConfirmDelivery} className="space-y-4">
          <p className="text-xs text-[#5b6671]">
            Record confirmation that the items have arrived at <strong>{order.delivery.location}</strong> and have been handed over.
          </p>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Received By (Name / Title) *</label>
            <input required type="text" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. John Adewale or Warehouse Supervisor" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Delivery Notes (Optional)</label>
            <textarea rows={3} value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green resize-none" placeholder="e.g. Package inspected and accepted in good condition." />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              <CheckCircle2 className="w-4 h-4" /> Confirm Delivered
            </button>
          </div>
        </form>
      </Modal>

      {/* Complete Order Confirmation Modal */}
      <Modal isOpen={activeModal === "complete"} onClose={() => setActiveModal(null)} title="Complete & Finalize Order">
        <div className="space-y-4">
          <p className="text-sm text-ink leading-relaxed">
            Completing order <strong>{order.orderNumber}</strong> verifies that the items have been received, customer acceptance is recorded, and no further fulfillment actions are required.
          </p>
          <div className="bg-[#eff5ed] p-3 rounded-xl border border-brand-green/20 text-xs text-brand-green font-semibold">
            ✓ Full payment (₦{order.totalAmount.toLocaleString()}) confirmed &middot; Delivery signed off.
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCompleteOrder} disabled={isSubmitting} className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 cursor-pointer">
              Finalize Order
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal isOpen={activeModal === "cancel"} onClose={() => setActiveModal(null)} title="Cancel Order">
        <form onSubmit={handleCancelOrder} className="space-y-4">
          <p className="text-xs text-[#a11f1f] bg-[#fff1f1] p-3 rounded-lg font-semibold">
            Warning: Cancelling this order halts fulfillment. If payment refund is required, please log in Finance.
          </p>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Reason for Cancellation *</label>
            <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="Customer requested cancellation">Customer requested cancellation</option>
              <option value="Duplicate order entry">Duplicate order entry</option>
              <option value="Item discontinued / Out of stock">Item discontinued / Out of stock</option>
              <option value="Pricing / Specification discrepancy">Pricing / Specification discrepancy</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Keep Active
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-[#a11f1f] text-white text-sm font-bold hover:bg-[#851919] disabled:opacity-50 cursor-pointer">
              Confirm Cancellation
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Override Modal */}
      <Modal isOpen={activeModal === "status"} onClose={() => setActiveModal(null)} title="Override Order Status">
        <form onSubmit={handleStatusOverride} className="space-y-4">
          <p className="text-[12px] text-[#a11f1f] font-semibold bg-[#fff1f1] p-2.5 rounded-lg">
            Notice: Manually overriding status bypasses standard operational validations.
          </p>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">New Order Stage</label>
            <select 
              value={newStatus} 
              onChange={e => setNewStatus(e.target.value as OrderStatus)} 
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white"
            >
              {LIFECYCLE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-black disabled:opacity-50 cursor-pointer">
              Apply Override
            </button>
          </div>
        </form>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={activeModal === "note"} onClose={() => setActiveModal(null)} title="Add Internal Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Internal Note *</label>
            <textarea required rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green resize-none" placeholder="Add specific handling notes, customer instructions, or stock comments..." />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50 cursor-pointer">
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Packing Slip Print View Modal */}
      <Modal isOpen={activeModal === "packingSlip"} onClose={() => setActiveModal(null)} title={`Packing Slip & Dispatch Manifest — ${order.orderNumber}`}>
        <div className="space-y-5 print:p-0">
          <div className="border border-line rounded-xl p-5 bg-white space-y-4">
            <div className="flex justify-between items-start border-b border-line pb-4">
              <div>
                <h3 className="text-xl font-black text-ink">Maritama Trading Ltd</h3>
                <p className="text-xs text-[#5b6671]">Operations & Fulfillment Centre</p>
                <div className="text-xs font-mono text-[#8a949d] mt-1">Segment: {order.segment}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-ink">{order.orderNumber}</div>
                <div className="text-xs font-bold text-brand-green">PREPAID &bull; {order.payment.reference}</div>
                <div className="text-xs text-[#8a949d]">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-[#8a949d] uppercase">Deliver To:</span>
                <div className="font-bold text-ink text-sm mt-0.5">{order.customerName}</div>
                <div className="text-ink">{order.companyName}</div>
                <div className="text-[#5b6671] mt-0.5">{order.delivery.address}</div>
                <div className="text-[#5b6671]">{order.delivery.location}</div>
                <div className="text-ink font-semibold mt-1">Tel: {order.phone}</div>
              </div>
              <div>
                <span className="font-bold text-[#8a949d] uppercase">Logistics Manifest:</span>
                <div className="mt-0.5"><strong className="text-ink">Status:</strong> {order.status}</div>
                <div><strong className="text-ink">Carrier:</strong> {order.delivery.carrier || "Staged for pickup"}</div>
                <div><strong className="text-ink">Tracking:</strong> {order.delivery.trackingRef || "Pending Assignment"}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-line rounded-lg overflow-hidden">
              <thead className="bg-[#fcfdfa] border-b border-line">
                <tr>
                  <th className="p-2.5 font-bold">Item Description</th>
                  <th className="p-2.5 font-bold text-center">Ordered</th>
                  <th className="p-2.5 font-bold text-center">Allocated / Packed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold text-ink">{item.productName}</td>
                    <td className="p-2.5 text-center font-medium">{item.quantity}</td>
                    <td className="p-2.5 text-center font-black text-brand-green">{item.allocatedQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-line pt-4 flex justify-between text-xs text-[#8a949d]">
              <div>Verified by Warehouse Operator: __________________</div>
              <div>Carrier Signature: __________________</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa] cursor-pointer"
            >
              Close
            </button>
            <button 
              onClick={() => window.print()} 
              className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Manifest
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
