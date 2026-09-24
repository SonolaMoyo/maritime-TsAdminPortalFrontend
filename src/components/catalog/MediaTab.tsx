import { useState, useEffect } from "react";
import { catalogService } from "../../services/catalogService";
import type { MediaAsset } from "../../data/mockCatalog";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus, Image as ImageIcon, FileText } from "lucide-react";
import { Modal } from "../ui/Modal";

export function MediaTab() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: "", type: "image/jpeg", size: "2.1 MB" });

  const loadData = async () => {
    setLoading(true);
    const data = await catalogService.getMedia();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    await catalogService.addMedia(uploadForm);
    setIsUploadOpen(false);
    loadData();
  };

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-line flex justify-between items-center bg-[#fcfdfa]">
        <div className="flex gap-4 text-[14px] font-bold text-[#8a949d]">
          <button className="text-ink">All Media</button>
          <button className="hover:text-ink transition-colors">Images</button>
          <button className="hover:text-ink transition-colors">PDFs</button>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-brand-green2">
          <Plus className="w-4 h-4" /> Upload Media
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading media library...</div>
      ) : (
        <Table headers={["Preview", "File Name", "Size", "Uploaded", "Used By", "Action"]}>
          {media.map((asset) => (
            <TableRow key={asset.id} className="cursor-pointer hover:bg-[#fcfdfa]">
              <TableCell>
                <div className="w-12 h-12 rounded-lg bg-line overflow-hidden flex items-center justify-center">
                  {asset.type.includes('image') ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#8a949d]" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-ink text-[14px]">{asset.name}</div>
                <div className="text-[12px] text-[#8a949d] uppercase">{asset.type.split('/')[1]}</div>
              </TableCell>
              <TableCell><div className="font-medium text-ink text-[13px]">{asset.size}</div></TableCell>
              <TableCell>
                <div className="text-[13px] text-[#5b6671]">
                  {new Date(asset.uploadedAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-ink">{asset.usedBy} places</div>
              </TableCell>
              <TableCell>
                <button className="text-[13px] font-[800] text-brand-green hover:underline cursor-pointer mr-3">
                  View
                </button>
                <button className="text-[13px] font-[800] text-red-500 hover:underline cursor-pointer">
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
          {media.length === 0 && (
            <TableRow>
              <TableCell><div className="p-8 text-center text-[#8a949d] font-semibold w-full block">No media found.</div></TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Media">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-line rounded-xl p-8 flex flex-col items-center justify-center bg-[#fcfdfa]">
            <ImageIcon className="w-8 h-8 text-[#8a949d] mb-3" />
            <div className="text-[14px] font-bold text-ink mb-1">Drag & Drop Files Here</div>
            <div className="text-[12px] text-[#8a949d] mb-4">Supported formats: JPG, PNG, WEBP, PDF</div>
            <button type="button" className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-white transition-colors bg-white shadow-sm">
              Browse Files
            </button>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#8a949d] mb-1">Simulated File Name</label>
            <input required value={uploadForm.name} onChange={e => setUploadForm({...uploadForm, name: e.target.value})} placeholder="e.g. new-product-image.jpg" className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-brand-green" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsUploadOpen(false)} className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green2">Upload</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
