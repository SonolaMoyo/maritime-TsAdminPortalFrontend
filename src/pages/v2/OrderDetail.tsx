import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Plus, Truck, CreditCard, CheckCircle } from "lucide-react";
import { ordersService } from "../../services/ordersService";
import type { Order, OrderStatus } from "../../data/mockOrders";
import { Panel } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Modal } from "../../components/ui/Modal";

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<"approve" | "payment" | "allocate" | "dispatch" | "status" | "note" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentRef, setPaymentRef] = useState("");
  
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  
  const [carrier, setCarrier] = useState("Company Delivery");
  const [trackingRef, setTrackingRef] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  const [newStatus, setNewStatus] = useState<OrderStatus>("Pending Approval");
  const [noteText, setNoteText] = useState("");

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await ordersService.getOrderById(id);
      setOrder(data || null);
      if (data) {
        // Init allocations
        const allocs: Record<string, number> = {};
        data.items.forEach(item => allocs[item.id] = item.allocatedQuantity);
        setAllocations(allocs);
        setNewStatus(data.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchOrder();
      setLoading(false);
    };
    init();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-[#8a949d] font-semibold">Loading order workspace...</div>;
  if (!order) return <div className="p-12 text-center text-[#a11f1f] font-semibold">Order not found.</div>;

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.updateStatus(order.id, "Awaiting Payment");
    await ordersService.addActivity(order.id, "Approval", "Order approved by Operations");
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.recordPayment(order.id, paymentAmount, paymentMethod, paymentRef);
    await ordersService.addActivity(order.id, "Payment", `Payment confirmed: ₦${paymentAmount.toLocaleString()} (${paymentMethod})`);
    
    // If it becomes fully paid, we transition to Paid status (handled in service), but let's double check if we need to manually trigger next step.
    const updated = await ordersService.getOrderById(order.id);
    if (updated?.status === "Paid") {
       await ordersService.addActivity(order.id, "Status Update", "Order is fully paid and ready for Processing");
    }

    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.allocateStock(order.id, allocations);
    await ordersService.addActivity(order.id, "Inventory", "Stock allocated to order");
    
    // Check if fully allocated
    const updated = await ordersService.getOrderById(order.id);
    const fullyAlloc = updated?.items.every(i => i.allocatedQuantity >= i.quantity);
    if (fullyAlloc && (updated?.status === "Paid" || updated?.status === "Processing")) {
       await ordersService.updateStatus(order.id, "Ready for Dispatch");
       await ordersService.addActivity(order.id, "Status Update", "Order is fully allocated and Ready for Dispatch");
    } else {
       await ordersService.updateStatus(order.id, "Processing");
    }

    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.dispatchOrder(order.id, carrier, trackingRef, expectedDelivery);
    await ordersService.addActivity(order.id, "Dispatch", `Order dispatched via ${carrier}. Tracking: ${trackingRef}`);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ordersService.updateStatus(order.id, newStatus);
    await ordersService.addActivity(order.id, "Status Change", `Status manually overridden to ${newStatus}`);
    await fetchOrder();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    await ordersService.addNote(order.id, noteText);
    await fetchOrder();
    setNoteText("");
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const lifecycleStages = [
    "Pending Approval", "Awaiting Payment", "Paid", "Processing", 
    "Ready for Dispatch", "In Transit", "Delivered", "Completed"
  ];
  
  const currentIndex = lifecycleStages.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="mb-6">
        <button onClick={() => navigate('/v2/orders')} className="flex items-center gap-2 text-[#5b6671] text-sm font-bold hover:text-ink transition-colors mb-4 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-ink">{order.orderNumber}</h1>
              <StatusPill status={order.status} />
              <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{order.segment}</span>
            </div>
            <p className="text-[#5b6671] text-[16px] font-medium">
              Total Value: <span className="font-bold text-ink">₦{order.totalAmount.toLocaleString()}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveModal("status")} className="h-[40px] px-4 rounded-full border border-line bg-white text-ink font-[800] text-[14px] hover:bg-[#fcfdfa] shadow-sm transition-all cursor-pointer">
              Change Status
            </button>

            {order.status === "Pending Approval" && (
              <button onClick={() => setActiveModal("approve")} className="h-[40px] px-4 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm transition-all cursor-pointer">
                Approve Order
              </button>
            )}

            {(order.status === "Awaiting Payment" || order.payment.status === "Partially Paid") && (
              <button onClick={() => { setPaymentAmount(order.payment.amountDue - order.payment.amountPaid); setActiveModal("payment"); }} className="h-[40px] px-4 rounded-full bg-ink text-white font-[800] text-[14px] hover:bg-black shadow-sm transition-all cursor-pointer">
                Record Payment
              </button>
            )}

            {(order.status === "Paid" || order.status === "Processing") && (
              <button onClick={() => setActiveModal("allocate")} className="h-[40px] px-4 rounded-full bg-ink text-white font-[800] text-[14px] hover:bg-black shadow-sm transition-all cursor-pointer">
                Allocate Stock
              </button>
            )}

            {order.status === "Ready for Dispatch" && (
              <button onClick={() => setActiveModal("dispatch")} className="h-[40px] px-4 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm transition-all cursor-pointer">
                Dispatch Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      {!isCancelled && (
        <Panel className="mb-6 overflow-x-auto">
          <div className="flex items-center min-w-[800px] justify-between relative px-4">
            <div className="absolute left-[3%] right-[3%] top-1/2 -translate-y-1/2 h-1 bg-[#e4ece2] -z-10 rounded-full" />
            <div className="absolute left-[3%] top-1/2 -translate-y-1/2 h-1 bg-brand-green -z-10 rounded-full transition-all duration-500" style={{ width: `${(Math.max(0, currentIndex) / (lifecycleStages.length - 1)) * 94}%` }} />
            
            {lifecycleStages.map((stage, i) => {
              const isPast = i < currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    isPast ? "bg-brand-green border-brand-green text-ink" : 
                    isCurrent ? "bg-white border-brand-green text-brand-green shadow-[0_0_0_4px_rgba(210,255,47,0.2)]" : 
                    "bg-white border-line text-transparent"
                  }`}>
                    {isPast ? <CheckCircle className="w-3.5 h-3.5" /> : "●"}
                  </div>
                  <span className={`text-[12px] font-bold ${isCurrent ? "text-ink" : isPast ? "text-ink" : "text-[#8a949d]"}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main details) */}
        <div className="lg:col-span-2 space-y-6">
          
          <Panel>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d]">Customer Details</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Name</label>
                <div className="text-[14px] font-bold text-ink">{order.customerName}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Company</label>
                <div className="text-[14px] font-bold text-ink">{order.companyName}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Email</label>
                <div className="text-[14px] font-bold text-brand-green hover:underline cursor-pointer">{order.email}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Phone</label>
                <div className="text-[14px] font-bold text-ink">{order.phone}</div>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Order Items</h2>
            <div className="border border-line rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fcfdfa] border-b border-line">
                  <tr>
                    <th className="p-3 font-bold text-[#8a949d]">Product</th>
                    <th className="p-3 font-bold text-[#8a949d]">Qty</th>
                    <th className="p-3 font-bold text-[#8a949d]">Unit Price</th>
                    <th className="p-3 font-bold text-[#8a949d] text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-3 font-bold text-ink">{item.productName}</td>
                      <td className="p-3 font-medium text-ink">{item.quantity}</td>
                      <td className="p-3 font-medium text-ink">₦{item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 font-black text-ink text-right">₦{item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex flex-col items-end text-sm space-y-2">
              <div className="flex justify-between w-64">
                <span className="font-semibold text-[#5b6671]">Subtotal</span>
                <span className="font-bold text-ink">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-64 text-[#a11f1f]">
                <span className="font-semibold">Discount</span>
                <span className="font-bold">-₦{order.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-64">
                <span className="font-semibold text-[#5b6671]">Delivery</span>
                <span className="font-bold text-ink">₦{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-line w-64 pt-2 mt-2 flex justify-between">
                <span className="font-black text-ink">Total</span>
                <span className="font-black text-xl text-ink">₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Inventory Allocation</h2>
            <div className="space-y-4">
              {order.items.map(item => {
                const isFullyAllocated = item.allocatedQuantity >= item.quantity;
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-line rounded-lg bg-[#fcfdfa]">
                    <div>
                      <div className="font-bold text-ink">{item.productName}</div>
                      <div className="text-xs font-semibold text-[#8a949d]">Requested: {item.quantity}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#8a949d]">Allocated</div>
                        <div className={`font-black ${isFullyAllocated ? "text-brand-green" : "text-[#996600]"}`}>{item.allocatedQuantity}</div>
                      </div>
                      <StatusPill status={isFullyAllocated ? "Allocated" : "Partial"} className={isFullyAllocated ? "bg-[#eff5ed] text-brand-green" : ""} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right Column (Status, History, Notes) */}
        <div className="space-y-6">
          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Payment</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Status</span>
                <StatusPill status={order.payment.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Amount Paid</span>
                <span className="text-[15px] font-bold text-ink">₦{order.payment.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Outstanding</span>
                <span className={`text-[15px] font-bold ${order.payment.amountDue - order.payment.amountPaid > 0 ? "text-[#a11f1f]" : "text-brand-green"}`}>
                  ₦{(order.payment.amountDue - order.payment.amountPaid).toLocaleString()}
                </span>
              </div>
              {order.payment.reference && (
                <div className="pt-3 border-t border-line">
                  <div className="text-xs font-semibold text-[#8a949d]">Last Payment</div>
                  <div className="text-sm font-medium text-ink">{order.payment.method} &mdash; Ref: {order.payment.reference}</div>
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4 flex items-center gap-2"><Truck className="w-4 h-4"/> Delivery</h2>
            <div className="space-y-3">
              <div>
                <span className="text-[12px] font-semibold text-[#8a949d]">Status</span>
                <div className="font-bold text-ink">{order.delivery.status}</div>
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#8a949d]">Location</span>
                <div className="font-medium text-ink">{order.delivery.address}</div>
              </div>
              {order.delivery.trackingRef && (
                <div>
                  <span className="text-[12px] font-semibold text-[#8a949d]">Tracking ({order.delivery.carrier})</span>
                  <div className="font-bold text-brand-green">{order.delivery.trackingRef}</div>
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> Order History</h2>
            <div className="relative border-l-2 border-[#e4ece2] ml-3 pl-5 space-y-5 max-h-[300px] overflow-y-auto pr-2">
              {order.activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[27px] bg-brand-green w-2.5 h-2.5 rounded-full border-2 border-white top-1.5 shadow-[0_0_0_3px_rgba(210,255,47,0.3)]"></div>
                  <div className="text-[11px] font-bold text-[#8a949d] mb-0.5 uppercase tracking-wider">{act.type} &middot; {new Date(act.date).toLocaleDateString()}</div>
                  <div className="text-[13px] font-medium text-ink leading-tight mb-1">{act.description}</div>
                  <div className="text-[11px] font-semibold text-[#8a949d]">By {act.actor}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d]">Internal Notes</h2>
              <button onClick={() => setActiveModal("note")} className="text-[12px] font-[800] text-brand-green hover:underline flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3"/> Add</button>
            </div>
            {order.notes.length === 0 ? (
              <div className="text-[13px] text-[#8a949d] italic">No internal notes.</div>
            ) : (
              <div className="space-y-3">
                {order.notes.map((note) => (
                  <div key={note.id} className="bg-[#fffdf5] border border-[#f2e6c4] p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold text-ink">{note.author}</span>
                    </div>
                    <p className="text-[13px] text-ink font-medium leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* --- MODALS --- */}
      <Modal isOpen={activeModal === "approve"} onClose={() => setActiveModal(null)} title="Approve Order">
        <form onSubmit={handleApprove} className="space-y-4">
          <p className="text-sm text-ink mb-4">You are about to approve Order <b>{order.orderNumber}</b> for <b>{order.customerName}</b>.</p>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Approve Order</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "payment"} onClose={() => setActiveModal(null)} title="Record Payment">
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="bg-[#fcfdfa] p-4 rounded-xl border border-line mb-4">
            <div className="text-sm font-semibold text-[#8a949d]">Total Amount: ₦{order.totalAmount.toLocaleString()}</div>
            <div className="text-sm font-semibold text-[#8a949d]">Outstanding: ₦{(order.totalAmount - order.payment.amountPaid).toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Amount Received (₦)</label>
              <input required type="number" min="1" max={order.totalAmount - order.payment.amountPaid} value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Cash</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Payment Reference</label>
            <input required type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. TRN-9982" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-black disabled:opacity-50">Confirm Payment</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "allocate"} onClose={() => setActiveModal(null)} title="Allocate Stock">
        <form onSubmit={handleAllocate} className="space-y-4">
          <p className="text-sm text-ink mb-4">Update the inventory allocated for this order.</p>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-line rounded-lg">
                <div className="w-1/2">
                  <div className="font-bold text-ink text-sm">{item.productName}</div>
                  <div className="text-[11px] font-semibold text-[#8a949d]">Req: {item.quantity}</div>
                </div>
                <div>
                  <input type="number" min="0" max={item.quantity} value={allocations[item.id] || 0} onChange={e => setAllocations({...allocations, [item.id]: Number(e.target.value)})} className="w-24 border border-line rounded-lg px-2 py-1 text-sm focus:outline-brand-green text-center font-bold text-ink" />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-black disabled:opacity-50">Update Allocation</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "dispatch"} onClose={() => setActiveModal(null)} title="Dispatch Order">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Carrier</label>
              <select value={carrier} onChange={e => setCarrier(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option>Company Delivery</option>
                <option>DHL</option>
                <option>FedEx</option>
                <option>Local Logistics</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Tracking Reference</label>
              <input required type="text" value={trackingRef} onChange={e => setTrackingRef(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" placeholder="e.g. TRK-001" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Expected Delivery</label>
            <input required type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Confirm Dispatch</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "status"} onClose={() => setActiveModal(null)} title="Override Order Status">
        <form onSubmit={handleStatus} className="space-y-4">
          <p className="text-[13px] text-[#a11f1f] font-semibold bg-[#fff1f1] p-3 rounded-lg">Warning: Manually overriding status bypasses operational checks.</p>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as OrderStatus)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              {lifecycleStages.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-black disabled:opacity-50">Update Status</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "note"} onClose={() => setActiveModal(null)} title="Add Internal Note">
        <form onSubmit={handleNote} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Note</label>
            <textarea required rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green resize-none" placeholder="Write..." />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Save Note</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
