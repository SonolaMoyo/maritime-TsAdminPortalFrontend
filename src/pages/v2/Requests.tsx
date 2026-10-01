import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Table, TableRow, TableCell } from "../../components/ui/Table";
import { StatusPill } from "../../components/ui/StatusPill";
import { requestsService } from "../../services/requestsService";
import type { QuoteRequest, SegmentType } from "../../data/mockRequests";
import { useSegment } from "../../context/SegmentContext";
import { MetricCard } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

export function Requests() {
  const navigate = useNavigate();
  const { segment } = useSegment();
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Add Form State
  const [addForm, setAddForm] = useState({
    customerName: "", companyName: "", email: "", phone: "",
    product: "", segment: "Solar Tech" as SegmentType, quantity: 1, deliveryLocation: ""
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await requestsService.createRequest(addForm);
      await fetchRequests();
      setIsAddModalOpen(false);
      setAddForm({ customerName: "", companyName: "", email: "", phone: "", product: "", segment: "Solar Tech", quantity: 1, deliveryLocation: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // 1. Filter by Segment
  const segmentFiltered = requests.filter(r => segment === "All" || r.segment === segment);

  // 2. Compute Stats based on Segment
  const stats = {
    total: segmentFiltered.length,
    pending: segmentFiltered.filter(r => ["New", "Assigned"].includes(r.status)).length,
    inProgress: segmentFiltered.filter(r => ["Contacted", "Quote Sent", "Negotiation"].includes(r.status)).length,
    completed: segmentFiltered.filter(r => ["Won", "Lost"].includes(r.status)).length,
  };

  // 3. Filter by Search Query
  const searchFiltered = segmentFiltered.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.customerName.toLowerCase().includes(q) ||
           r.companyName.toLowerCase().includes(q) ||
           r.requestNumber.toLowerCase().includes(q) ||
           r.product.toLowerCase().includes(q);
  });

  // 4. Filter by Status Tab
  const finalFiltered = searchFiltered.filter(r => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return ["New", "Assigned"].includes(r.status);
    if (activeTab === "In Progress") return ["Contacted", "Quote Sent", "Negotiation"].includes(r.status);
    if (activeTab === "Completed") return ["Won", "Lost"].includes(r.status);
    return true;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink mb-1">Requests {segment !== 'All' && <span className="text-brand-green">— {segment}</span>}</h1>
          <p className="text-[#5b6671] text-[15px] font-medium">Manage customer enquiries, quote requests and sales opportunities.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-[44px] px-5 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Requests" value={stats.total} subtitle="All time" />
        <MetricCard title="Pending" value={stats.pending} subtitle="Needs action" variant="lime" />
        <MetricCard title="In Progress" value={stats.inProgress} subtitle="Currently working" />
        <MetricCard title="Completed" value={stats.completed} subtitle="Won or Lost" />
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#e4ece2] pb-4">
        <div className="flex gap-6 overflow-x-auto">
          {["All", "Pending", "In Progress", "Completed"].map((tab) => (
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
              placeholder="Search requests..." 
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

      {/* Table */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[#8a949d] font-semibold">Loading requests...</div>
        ) : (
          <Table headers={["Request ID", "Customer", "Product", "Segment", "Quantity", "Date", "Owner", "Status", "Action"]}>
            {finalFiltered.map((req) => (
              <TableRow key={req.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => navigate(`/requests/${req.id}`)}>
                <TableCell>
                  <div className="font-bold text-ink">{req.requestNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-ink text-[14px]">{req.customerName}</div>
                  <div className="text-[13px] text-[#5b6671]">{req.companyName}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-ink text-[14px] max-w-[200px] truncate">{req.product}</div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-bold text-[#5b6671] bg-[#f4f7f5] px-2 py-1 rounded-md">{req.segment}</span>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-ink">{req.quantity} units</div>
                </TableCell>
                <TableCell>
                  <div className="text-[14px] font-medium text-ink">
                    {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-[14px] font-semibold text-[#5b6671]">
                    {req.owner || <span className="text-[#a11f1f] text-[12px] uppercase tracking-wider">Unassigned</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill status={req.status} />
                </TableCell>
                <TableCell>
                  <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer">
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {finalFiltered.length === 0 && (
              <TableRow>
                <TableCell>
                  <div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No requests found.</div>
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      {/* Add Request Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Request">
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
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Product *</label>
              <input required type="text" value={addForm.product} onChange={e => setAddForm({...addForm, product: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Quantity *</label>
              <input required type="number" min="1" value={addForm.quantity} onChange={e => setAddForm({...addForm, quantity: Number(e.target.value)})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Delivery Location</label>
              <input type="text" value={addForm.deliveryLocation} onChange={e => setAddForm({...addForm, deliveryLocation: e.target.value})} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isAdding} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">
              {isAdding ? "Saving..." : "Create Request"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
