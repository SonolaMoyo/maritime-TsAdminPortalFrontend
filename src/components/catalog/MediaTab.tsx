import { useState, useEffect, useRef } from "react";
import { catalogService } from "../../services/catalogService";
import type { MediaAsset } from "../../data/mockCatalog";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Plus, Image as ImageIcon, FileText, Download, Trash2, Eye, UploadCloud, AlertCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Pagination } from "../ui/Pagination";
import { fileToBase64, validateFileSize, formatFileSize, downloadBase64File } from "../../utils/fileUtils";

export function MediaTab() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaFilter, setMediaFilter] = useState<"All" | "Images" | "PDFs">("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Upload modal & state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View / Preview Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await catalogService.getMedia();
      setMedia(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = async (file: File) => {
    setUploadError(null);
    const validation = validateFileSize(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setUploadError(validation.error || "File exceeds 5MB limit");
      setSelectedFile(null);
      setFilePreview("");
      return;
    }

    setSelectedFile(file);
    setCustomName(file.name);

    if (file.type.startsWith("image/")) {
      const base64 = await fileToBase64(file);
      setFilePreview(base64);
    } else {
      setFilePreview("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload (Max 5MB).");
      return;
    }

    setIsUploading(true);
    try {
      const base64String = await fileToBase64(selectedFile);
      await catalogService.addMedia({
        name: customName || selectedFile.name,
        type: selectedFile.type,
        size: formatFileSize(selectedFile.size),
        base64Data: base64String,
        url: base64String,
      });

      setIsUploadOpen(false);
      setSelectedFile(null);
      setFilePreview("");
      setCustomName("");
      loadData();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await catalogService.deleteMedia(id);
      loadData();
    }
  };

  const filteredMedia = media.filter(m => {
    if (mediaFilter === "Images") return m.type.includes("image");
    if (mediaFilter === "PDFs") return m.type.includes("pdf") || m.type.includes("document");
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredMedia.length / pageSize) || 1;
  const paginatedMedia = filteredMedia.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
      {/* Top Filter and Actions */}
      <div className="p-4 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#fcfdfa]">
        <div className="flex gap-2">
          {(["All", "Images", "PDFs"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => { setMediaFilter(filter); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                mediaFilter === filter
                  ? "bg-brand-green text-white shadow-xs"
                  : "bg-white border border-line text-[#5b6671] hover:text-ink hover:bg-[#f8faf7]"
              }`}
            >
              {filter === "All" ? "All Media" : filter === "PDFs" ? "PDFs & Docs" : "Images"}
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            setUploadError(null);
            setSelectedFile(null);
            setFilePreview("");
            setCustomName("");
            setIsUploadOpen(true);
          }} 
          className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-xl flex items-center gap-2 hover:bg-brand-green2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Upload Media
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#8a949d] font-semibold">Loading media library...</div>
      ) : (
        <>
          <Table headers={["Preview", "File Name", "Size", "Uploaded", "Used By", "Actions"]}>
            {paginatedMedia.map((asset) => {
              const isImage = asset.type.includes("image") || (asset.url && asset.url.startsWith("data:image"));

              return (
                <TableRow key={asset.id} className="hover:bg-[#fcfdfa]">
                  <TableCell>
                    <div 
                      onClick={() => setPreviewAsset(asset)}
                      className="w-12 h-12 rounded-lg bg-[#f4f7f5] border border-line overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {isImage ? (
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-6 h-6 text-brand-green" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-ink text-[14px] max-w-[220px] truncate" title={asset.name}>
                      {asset.name}
                    </div>
                    <div className="text-[11px] font-bold text-[#8a949d] uppercase">
                      {asset.type.split("/")[1] || asset.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[#5b6671] text-[13px]">{asset.size}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] text-[#5b6671]">
                      {new Date(asset.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f4f7f5] text-[#5b6671]">
                      {asset.usedBy} places
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setPreviewAsset(asset)} 
                        title="Preview"
                        className="p-1.5 rounded-lg border border-line bg-white text-ink hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => downloadBase64File(asset.url, asset.name)} 
                        title="Download file"
                        className="p-1.5 rounded-lg border border-line bg-white text-ink hover:text-brand-green hover:border-brand-green transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(asset.id, asset.name)} 
                        title="Delete"
                        className="p-1.5 rounded-lg border border-line bg-white text-[#8a949d] hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMedia.length === 0 && (
              <TableRow>
                <TableCell>
                  <div className="p-8 text-center text-[#8a949d] font-semibold w-full block">
                    No media files found in this category.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMedia.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Upload Media Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Media File (Max 5MB)" size="default">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx"
          />

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {uploadError}
            </div>
          )}

          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-line rounded-2xl p-6 flex flex-col items-center justify-center bg-[#fcfdfa] hover:bg-[#f8faf7] hover:border-brand-green transition-all cursor-pointer text-center"
          >
            {filePreview ? (
              <div className="w-32 h-32 rounded-xl overflow-hidden border border-line shadow-xs mb-3">
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : selectedFile ? (
              <div className="w-16 h-16 rounded-xl bg-[#eaf4ea] text-brand-green flex items-center justify-center mb-3">
                <FileText className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#f4f7f5] text-[#8a949d] flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
            )}

            <div className="text-[14px] font-extrabold text-ink mb-1">
              {selectedFile ? selectedFile.name : "Click to browse or drag & drop"}
            </div>
            <div className="text-[12px] text-[#8a949d]">
              {selectedFile ? `${formatFileSize(selectedFile.size)} • Ready to encode` : "Images (JPG, PNG, WEBP) or Documents (PDF, DOC) up to 5MB"}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#5b6671] mb-1">File Display Name</label>
            <input 
              required 
              value={customName} 
              onChange={e => setCustomName(e.target.value)} 
              placeholder="e.g. inverter-spec-sheet.pdf" 
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-brand-green bg-[#fcfdfa]" 
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-line">
            <button 
              type="button" 
              onClick={() => setIsUploadOpen(false)} 
              className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-extrabold hover:bg-brand-green2 disabled:opacity-50 transition-all shadow-sm"
            >
              {isUploading ? "Encoding & Saving..." : "Save to Database"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <Modal 
          isOpen={Boolean(previewAsset)} 
          onClose={() => setPreviewAsset(null)} 
          title={previewAsset.name}
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-[#f8faf7] border border-line rounded-2xl p-4 flex items-center justify-center min-h-[260px] max-h-[460px] overflow-hidden">
              {previewAsset.type.includes("image") || (previewAsset.url && previewAsset.url.startsWith("data:image")) ? (
                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-[420px] w-auto object-contain rounded-xl shadow-xs" />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-brand-green mx-auto mb-3" />
                  <div className="font-black text-ink text-lg">{previewAsset.name}</div>
                  <div className="text-xs text-[#8a949d] uppercase mt-1">{previewAsset.type} • {previewAsset.size}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-[#fcfdfa] border border-line">
                <div className="text-[11px] font-bold text-[#8a949d] uppercase">Size</div>
                <div className="font-extrabold text-ink mt-0.5">{previewAsset.size}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#fcfdfa] border border-line">
                <div className="text-[11px] font-bold text-[#8a949d] uppercase">Type</div>
                <div className="font-extrabold text-ink mt-0.5">{previewAsset.type}</div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#fcfdfa] border border-line">
                <div className="text-[11px] font-bold text-[#8a949d] uppercase">Uploaded</div>
                <div className="font-extrabold text-ink mt-0.5">{new Date(previewAsset.uploadedAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => downloadBase64File(previewAsset.url, previewAsset.name)}
                className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-extrabold hover:bg-brand-green2 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
