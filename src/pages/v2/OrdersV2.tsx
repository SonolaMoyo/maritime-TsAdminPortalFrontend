import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Table, TableRow, TableCell } from "../../components/ui/Table";
import { StatusPill } from "../../components/ui/StatusPill";
import { ordersService } from "../../services/ordersService";
import type { Order, SegmentType } from "../../data/mockOrders";
import { useSegment } from "../../context/SegmentContext";
import { MetricCard } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

export function OrdersV2() {
  const navigate = useNavigate();
  const { segment } = useSegment();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [addForm, setAddForm] = useState({
    customerName: "", companyName: "", email: "", phone: "",
    segment: "Solar Tech" as SegmentType, 
    deliveryLocation: "", deliveryAddress: "",
    productName: "", quantity: 1, unitPrice: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const items = [{
        id: `oi-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        productName: addForm.productName,
        quantity: addForm.quantity,
        unitPrice: addForm.unitPrice,
        totalPrice: addForm.quantity * addForm.unitPrice,
        allocatedQuantity: 0
      }];
      
      const totalAmount = items[0].totalPrice;
      
      await ordersService.createOrder({
        customerName: addForm.customerName,
        companyName: addForm.companyName,
        email: addForm.email,
        phone: addForm.phone,
        segment: addForm.segment,
        items,
        subtotal: totalAmount,
        totalAmount: totalAmount,
        delivery: {
          status: "Pending",
          location: addForm.deliveryLocation,
          address: addForm.deliveryAddress
        }
      });
      await fetchOrders();
      setIsAddModalOpen(false);
      setAddForm({
        customerName: "", companyName: "", email: "", phone: "",
        segment: "Solar Tech", deliveryLocation: "", deliveryAddress: "",
        productName: "", quantity: 1, unitPrice: 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const segmentFiltered = orders.filter(o => segment === "All" || o.segment === segment);

  const stats = {
    total: segmentFiltered.length,
    pending: segmentFiltered.filter(o => o.status === "Pending Approval").length,
    awaitingPayment: segmentFiltered.filter(o => o.status === "Awaiting Payment").length,
    processing: segmentFiltered.filter(o => o.status === "Processing").length,
    inTransit: segmentFiltered.filter(o => o.status === "In Transit").length,
    delivered: segmentFiltered.filter(o => o.status === "Delivered").length,
    totalRevenue: segmentFiltered.reduce((sum, o) => sum + o.payment.amountPaid, 0),
    outstanding: segmentFiltered.reduce((sum, o) => sum + (o.payment.amountDue - o.payment.amountPaid), 0),
  };

  const searchFiltered = segmentFiltered.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.customerName.toLowerCase().includes(q) ||
           o.companyName.toLowerCase().includes(q) ||
           o.orderNumber.toLowerCase().includes(q);
  });

  const finalFiltered = searchFiltered.filter(o => {
    if (activeTab === "All") return true;
    return o.status === activeTab;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">Orders {segment !== 'All' && <span className="text-brand-green">— {segment}</span>}</h1>
          <p className="text-[#5b6671] text-[15px] font-medium">Manage operational orders, payments, fulfillment, and deliveries.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-[44px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <MetricCard 
          title="Revenue Received" 
          value={`₦${stats.totalRevenue.toLocaleString()}`} 
          subtitle="Total confirmed payments" 
          variant="lime"
        />
        <MetricCard 
          title="Outstanding Payments" 
          value={`₦${stats.outstanding.toLocaleString()}`} 
          subtitle="Awaiting payment collection" 
        />
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <MetricCard title="Total Orders" value={stats.total} subtitle="All time" className="min-h-[96px]" />
        <MetricCard title="Pending" value={stats.pending} subtitle="Approval" className="min-h-[96px]" />
        <MetricCard title="Awaiting" value={stats.awaitingPayment} subtitle="Payment" className="min-h-[96px]" />
        <MetricCard title="Processing" value={stats.processing} subtitle="Fulfillment" className="min-h-[96px]" />
        <MetricCard title="In Transit" value={stats.inTransit} subtitle="Delivery" className="min-h-[96px]" />
        <MetricCard title="Delivered" value={stats.delivered} subtitle="Completed" className="min-h-[96px]" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#e4ece2] pb-4">
        <div className="flex gap-6 overflow-x-auto">
          {["All", "Pending Approval", "Awaiting Payment", "Paid", "Processing", "Ready for Dispatch", "In Transit", "Delivered", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 -mb-4 font-[800] text-[14px] whitespace-nowrap transition-colors border-b-[3px] ${
                activeTab === tab ? "border-brand-green text-brand-green" : "border-transparent text-[#8a949d] hover:text-ink cursor-pointer"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a949d]" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[40px] pl-10 pr-4 rounded-full border border-line bg-[#fcfdfa] text-[14px] font-medium text-ink w-[240px] focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>
          <button className="h-[40px] px-4 rounded-full border border-line bg-white text-[#5b6671] font-[800] text-[14px] hover:bg-[#fcfdfa] transition-all flex items-center gap-2 cursor-pointer">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[#8a949d] font-semibold">Loading orders...</div>
        ) : (
          <Table headers={["Order ID", "Customer", "Segment", "Total", "Payment", "Order Status", "Delivery", "Created", "Action"]}>
            {finalFiltered.map((order) => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => navigate(`/v2/orders/${order.id}`)}>
                <TableCell>
                  <div className="font-bold text-ink">{order.orderNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-ink text-[14px]">{order.customerName}</div>
                  <div className="text-[13px] text-[#5b6671]">{order.companyName}</div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{order.segment}</span>
                </TableCell>
                <TableCell>
                  <div className="font-black text-ink text-[14px]">₦{order.totalAmount.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <StatusPill status={order.payment.status} />
                </TableCell>
                <TableCell>
                  <StatusPill status={order.status} />
                </TableCell>
                <TableCell>
                  <div className="text-[14px] font-semibold text-ink">{order.delivery.status}</div>
                </TableCell>
                <TableCell>
                  <div className="text-[14px] font-medium text-ink">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/v2/orders/${order.id}`); }}
                    className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {finalFiltered.length === 0 && (
              <TableRow>
                <TableCell>
                  <div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No orders found.</div>
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Order">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Customer Name *</label>
              <input required type="text" value={addForm.customerName} onChange={e => setAddForm({...addForm, customerName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Company</label>
              <input type="text" value={addForm.companyName} onChange={e => setAddForm({...addForm, companyName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Email *</label>
              <input required type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Phone *</label>
              <input required type="text" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>
          
          <hr className="border-line my-2" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Segment *</label>
              <select required value={addForm.segment} onChange={e => setAddForm({...addForm, segment: e.target.value as SegmentType})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
                <option value="Solar Tech">Solar Tech</option>
                <option value="Luxe">Luxe</option>
                <option value="EV">EV</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Product Name *</label>
              <input required type="text" value={addForm.productName} onChange={e => setAddForm({...addForm, productName: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Quantity *</label>
              <input required type="number" min="1" value={addForm.quantity} onChange={e => setAddForm({...addForm, quantity: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Unit Price (₦) *</label>
              <input required type="number" min="0" value={addForm.unitPrice} onChange={e => setAddForm({...addForm, unitPrice: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isAdding} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">
              {isAdding ? "Saving..." : "Create Order"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
