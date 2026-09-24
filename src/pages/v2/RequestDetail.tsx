import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, Building, MapPin, Package, Calendar, Clock, Plus } from "lucide-react";
import { requestsService } from "../../services/requestsService";
import type { QuoteRequest, RequestStatus } from "../../data/mockRequests";
import { Panel } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Modal } from "../../components/ui/Modal";

export function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<"assign" | "status" | "quote" | "done" | "email" | "call" | "note" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [assignee, setAssignee] = useState("John Doe");
  const [newStatus, setNewStatus] = useState<RequestStatus>("New");
  const [noteText, setNoteText] = useState("");
  const [quoteAmount, setQuoteAmount] = useState(0);

  const fetchRequest = async () => {
    if (!id) return;
    try {
      const data = await requestsService.getRequestById(id);
      setRequest(data || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRequest();
      setLoading(false);
    };
    init();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-[#8a949d] font-semibold">Loading request details...</div>;
  }

  if (!request) {
    return <div className="p-12 text-center text-[#a11f1f] font-semibold">Request not found.</div>;
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await requestsService.addActivity(request.id, "Assignment", `Request assigned to ${assignee}`);
    // Simulate updating owner (in a real app, there'd be an updateRequest service)
    setRequest(prev => prev ? { ...prev, owner: assignee } : null);
    await fetchRequest();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await requestsService.addActivity(request.id, "Status Change", `Status changed to ${newStatus}`);
    setRequest(prev => prev ? { ...prev, status: newStatus } : null);
    await fetchRequest();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await requestsService.addActivity(request.id, "Quotation", `Quotation sent for ${request.product} (Total: $${quoteAmount})`);
    setRequest(prev => prev ? { ...prev, status: "Quote Sent", expectedValue: `$${quoteAmount}` } : null);
    await fetchRequest();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleDone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await requestsService.addActivity(request.id, "Resolution", `Request marked as ${newStatus}`);
    setRequest(prev => prev ? { ...prev, status: newStatus } : null);
    await fetchRequest();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleContact = async (type: "Email" | "Call") => {
    setIsSubmitting(true);
    await requestsService.addActivity(request.id, "Communication", `${type} sent to customer`);
    await fetchRequest();
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    await requestsService.addNote(request.id, "Demo Admin", noteText);
    await fetchRequest();
    setNoteText("");
    setIsSubmitting(false);
    setActiveModal(null);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      {/* Top Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/v2/requests')} 
          className="flex items-center gap-2 text-[#5b6671] text-sm font-bold hover:text-ink transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-ink">{request.requestNumber}</h1>
              <StatusPill status={request.status} />
            </div>
            <p className="text-[#5b6671] text-[16px] font-medium">
              {request.product} &mdash; {request.quantity} Units
            </p>
            <div className="flex items-center gap-4 mt-3 text-[13px] font-semibold text-[#8a949d]">
              <span className="flex items-center gap-1"><User className="w-4 h-4"/> {request.customerName}</span>
              <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {request.companyName}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Created: {new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveModal("assign")} className="h-[40px] px-4 rounded-full border border-line bg-white text-ink font-[800] text-[14px] hover:bg-[#fcfdfa] shadow-sm transition-all">
              Assign
            </button>
            <button onClick={() => setActiveModal("status")} className="h-[40px] px-4 rounded-full border border-line bg-white text-ink font-[800] text-[14px] hover:bg-[#fcfdfa] shadow-sm transition-all">
              Change Status
            </button>
            <button onClick={() => setActiveModal("quote")} className="h-[40px] px-4 rounded-full bg-ink text-white font-[800] text-[14px] hover:bg-black shadow-sm transition-all">
              Create Quote
            </button>
            <button onClick={() => setActiveModal("done")} className="h-[40px] px-4 rounded-full bg-brand-green text-white font-[800] text-[14px] hover:bg-brand-green2 shadow-sm transition-all">
              Mark as Done
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Information */}
          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Full Name</label>
                <div className="text-[15px] font-bold text-ink">{request.customerName}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Company</label>
                <div className="text-[15px] font-bold text-ink">{request.companyName}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Email</label>
                <div className="text-[15px] font-bold text-brand-green hover:underline cursor-pointer flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5"/> {request.email}
                </div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Phone</label>
                <div className="text-[15px] font-bold text-ink flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5"/> {request.phone}
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2 pt-4 border-t border-line">
              <button onClick={() => setActiveModal("email")} className="text-[13px] font-[800] text-[#5b6671] hover:text-ink px-3 py-1.5 bg-[#fcfdfa] border border-line rounded-lg">Email Customer</button>
              <button onClick={() => setActiveModal("call")} className="text-[13px] font-[800] text-[#5b6671] hover:text-ink px-3 py-1.5 bg-[#fcfdfa] border border-line rounded-lg">Call Customer</button>
            </div>
          </Panel>

          {/* Request Information */}
          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Request Information</h2>
            
            <div className="flex gap-4 p-4 border border-line rounded-xl bg-[#fcfdfa] mb-5 items-start">
              <div className="w-16 h-16 bg-[#eff5ed] rounded-lg flex items-center justify-center flex-shrink-0 text-brand-green">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-ink">{request.product}</h3>
                <div className="text-[13px] font-semibold text-[#8a949d]">{request.segment} / {request.category}</div>
                <div className="text-[14px] font-black text-brand-green mt-1">{request.quantity} Units</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Delivery Location</label>
                <div className="text-[15px] font-bold text-ink">{request.deliveryLocation || "Not specified"}</div>
              </div>
              <div>
                <label className="text-[12px] text-[#5b6671] font-semibold">Additional Information</label>
                <div className="text-[14px] font-medium text-ink bg-[#f4f7f5] p-3 rounded-lg mt-1 italic">
                  "{request.additionalInfo || "No additional information provided."}"
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Sales Information */}
          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Sales Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Owner</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-ink">{request.owner || "Unassigned"}</span>
                  <button onClick={() => setActiveModal("assign")} className="text-[12px] text-brand-green font-[800] hover:underline">Change</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Expected Value</span>
                <span className="text-[14px] font-bold text-ink">{request.expectedValue || "---"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#5b6671]">Next Action</span>
                <span className="text-[13px] font-black text-[#a11f1f]">{
                  request.status === "New" ? "Assign Lead" :
                  request.status === "Assigned" ? "Contact Customer" :
                  request.status === "Contacted" ? "Send Quote" :
                  request.status === "Quote Sent" ? "Follow Up" :
                  request.status === "Negotiation" ? "Close Deal" : "None"
                }</span>
              </div>
            </div>
          </Panel>

          {/* Activity Timeline */}
          <Panel>
            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d] mb-4">Activity Timeline</h2>
            <div className="relative border-l-2 border-[#e4ece2] ml-3 pl-5 space-y-5">
              {request.activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[27px] bg-brand-green w-2.5 h-2.5 rounded-full border-2 border-white top-1.5 shadow-[0_0_0_3px_rgba(210,255,47,0.3)]"></div>
                  <div className="text-[12px] font-semibold text-[#8a949d] flex items-center gap-1 mb-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(act.date).toLocaleDateString()} &middot; {new Date(act.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-[14px] font-medium text-ink leading-tight">{act.description}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Internal Notes */}
          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-[#8a949d]">Internal Notes</h2>
              <button onClick={() => setActiveModal("note")} className="text-[12px] font-[800] text-brand-green hover:underline flex items-center gap-1"><Plus className="w-3 h-3"/> Add Note</button>
            </div>
            
            {request.notes.length === 0 ? (
              <div className="text-[13px] text-[#8a949d] italic text-center p-4 bg-[#fcfdfa] border border-line rounded-lg">No internal notes yet.</div>
            ) : (
              <div className="space-y-3">
                {request.notes.map((note) => (
                  <div key={note.id} className="bg-[#fffdf5] border border-[#f2e6c4] p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold text-ink">{note.author}</span>
                      <span className="text-[11px] font-semibold text-[#8a949d]">{new Date(note.date).toLocaleDateString()}</span>
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
      
      <Modal isOpen={activeModal === "assign"} onClose={() => setActiveModal(null)} title="Assign Request">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Select Sales Representative</label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option>John Doe</option>
              <option>Sarah Smith</option>
              <option>David Williams</option>
              <option>Moyo</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Assign</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "status"} onClose={() => setActiveModal(null)} title="Change Status">
        <form onSubmit={handleStatus} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as RequestStatus)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Contacted">Contacted</option>
              <option value="Quote Sent">Quote Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Update Status</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "quote"} onClose={() => setActiveModal(null)} title="Create Quotation">
        <form onSubmit={handleQuote} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Product Being Quoted</label>
            <input type="text" disabled value={request.product} className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Quantity</label>
              <input type="number" disabled value={request.quantity} className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Total Quote Amount ($)</label>
              <input required type="number" min="0" value={quoteAmount} onChange={e => setQuoteAmount(Number(e.target.value))} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-black disabled:opacity-50">Generate & Send</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "done"} onClose={() => setActiveModal(null)} title="Mark as Done">
        <form onSubmit={handleDone} className="space-y-4">
          <p className="text-sm text-ink mb-4">Did you win or lose this sales opportunity?</p>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Resolution</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as RequestStatus)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green bg-white">
              <option value="Won">Closed - Won</option>
              <option value="Lost">Closed - Lost</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Complete Request</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "email"} onClose={() => setActiveModal(null)} title="Email Customer">
        <div className="space-y-4">
          <p className="text-sm text-ink">Simulate sending an email from the system.</p>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button onClick={() => handleContact("Email")} disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Send Email</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "call"} onClose={() => setActiveModal(null)} title="Call Customer">
        <div className="space-y-4">
          <p className="text-sm text-ink">Log a phone call made to the customer.</p>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button onClick={() => handleContact("Call")} disabled={isSubmitting} className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2 disabled:opacity-50">Log Call</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "note"} onClose={() => setActiveModal(null)} title="Add Internal Note">
        <form onSubmit={handleNote} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Note Details</label>
            <textarea required rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green resize-none" placeholder="Write something..." />
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
