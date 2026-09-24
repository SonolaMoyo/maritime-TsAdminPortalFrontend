import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { StatusPill } from "../ui/StatusPill";
import { Modal } from "../ui/Modal";

export function NotificationsTab() {
  const [isManageRecipientsOpen, setIsManageRecipientsOpen] = useState(false);

  const events = [
    { name: "New Request", email: true, inApp: true, status: "Active" },
    { name: "Request Assigned", email: true, inApp: true, status: "Active" },
    { name: "Request Status Changed", email: true, inApp: true, status: "Active" },
    { name: "New Order", email: true, inApp: true, status: "Active" },
    { name: "Payment Received", email: true, inApp: true, status: "Active" },
    { name: "Order Ready for Dispatch", email: true, inApp: true, status: "Active" },
    { name: "Order Dispatched", email: true, inApp: true, status: "Active" },
    { name: "Low Stock", email: true, inApp: true, status: "Active" },
  ];

  const groups = [
    { name: "Sales Team", count: 3 },
    { name: "Inventory Team", count: 4 },
    { name: "Operations Team", count: 2 },
    { name: "Administrators", count: 3 },
  ];

  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Notifications</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Notification Events</h3>
          <div className="border border-line rounded-xl overflow-hidden">
            <Table headers={["Event", "Email", "In-App", "Status", "Action"]}>
              {events.map((event, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-bold text-ink">{event.name}</TableCell>
                  <TableCell>
                    <input type="checkbox" defaultChecked={event.email} className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
                  </TableCell>
                  <TableCell>
                    <input type="checkbox" defaultChecked={event.inApp} className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
                  </TableCell>
                  <TableCell>
                    <StatusPill status={event.status} />
                  </TableCell>
                  <TableCell>
                    <button className="text-brand-green font-bold text-sm hover:underline">Edit</button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-line">Notification Recipients</h3>
          <p className="text-sm text-[#5b6671] mb-4">Configure recipient groups instead of entering emails repeatedly.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-[#fcfdfa] border border-line rounded-xl p-4 flex items-center justify-between hover:border-brand-green transition-colors">
                <div>
                  <h4 className="font-bold text-ink">{group.name}</h4>
                  <p className="text-xs text-[#8a949d]">{group.count} members</p>
                </div>
                <button 
                  onClick={() => setIsManageRecipientsOpen(true)}
                  className="text-brand-green font-bold text-sm hover:underline"
                >
                  Manage &rarr;
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-line flex justify-end gap-3">
          <button className="px-5 py-2.5 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors rounded-xl hover:bg-[#fcfdfa]">
            Cancel
          </button>
          <button className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow">
            Save Changes
          </button>
        </div>
      </div>

      <Modal isOpen={isManageRecipientsOpen} onClose={() => setIsManageRecipientsOpen(false)} title="Manage Sales Team Recipients">
        <div className="space-y-4">
          <div className="bg-[#f4f7f4] rounded-xl p-4 space-y-3 border border-line">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-bold text-ink">John Doe</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-bold text-ink">Jane Smith</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
              <span className="text-sm font-bold text-ink">Michael Doe</span>
            </label>
          </div>
          
          <button className="w-full py-2 border border-dashed border-brand-green text-brand-green rounded-xl text-sm font-bold hover:bg-[#eff5ed] transition-colors">
            + Add User
          </button>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
          <button onClick={() => setIsManageRecipientsOpen(false)} className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink">Cancel</button>
          <button className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold">Save</button>
        </div>
      </Modal>
    </div>
  );
}
