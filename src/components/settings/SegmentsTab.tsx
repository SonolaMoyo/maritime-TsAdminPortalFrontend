import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { StatusPill } from "../ui/StatusPill";
import { Modal } from "../ui/Modal";

export function SegmentsTab() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  const segments = [
    { name: "Solar Tech", code: "SOL", status: "Active", products: 42, featured: 8 },
    { name: "Luxe", code: "LUX", status: "Active", products: 18, featured: 4 },
    { name: "EV", code: "EV", status: "Active", products: 25, featured: 5 },
    { name: "Electronics", code: "ELE", status: "Active", products: 61, featured: 12 },
  ];

  const handleEdit = (segment: any) => {
    setSelectedSegment(segment);
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h2 className="text-xl font-black text-ink mb-6">Segment Configuration</h2>
      
      <div className="space-y-6">
        <p className="text-sm text-[#5b6671]">
          Manage the configuration and availability of business segments. 
          Note: Content for these segments (like banners or featured products) is managed in the Catalog.
        </p>

        <div className="bg-white rounded-xl border border-line overflow-hidden">
          <Table headers={["Segment", "Code", "Products", "Featured", "Status", "Action"]}>
            {segments.map((segment, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold text-ink">{segment.name}</TableCell>
                <TableCell>
                  <code className="text-xs bg-[#f4f7f4] text-[#005642] px-2 py-1 rounded font-mono font-bold">
                    {segment.code}
                  </code>
                </TableCell>
                <TableCell className="text-right font-semibold text-ink">{segment.products}</TableCell>
                <TableCell className="text-right font-semibold text-ink">{segment.featured}</TableCell>
                <TableCell>
                  <StatusPill status={segment.status} />
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    onClick={() => handleEdit(segment)}
                    className="text-brand-green font-bold text-sm hover:underline"
                  >
                    Manage
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Segment">
        {selectedSegment && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Segment Name</label>
                <input type="text" defaultValue={selectedSegment.name} className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Segment Code</label>
                <input type="text" defaultValue={selectedSegment.code} disabled className="w-full px-3 py-2 bg-[#f4f7f4] border border-line rounded-xl text-sm text-[#8a949d] cursor-not-allowed" />
                <p className="text-xs text-[#8a949d] mt-1">Segment codes are used as unique identifiers and cannot be changed.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green h-20 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Status</label>
                <select className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-line">
              <h4 className="font-bold text-ink mb-3 text-sm">Portal Behaviour</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
                  <span className="text-sm font-medium text-ink">Visible on website</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
                  <span className="text-sm font-medium text-ink">Allow requests</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green w-4 h-4" />
                  <span className="text-sm font-medium text-ink">Allow orders</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
