import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, Upload, Download, FileText, Eye, AlertCircle, Check, Star } from "lucide-react";
import { catalogService } from "../../services/catalogService";
import { inventoryService } from "../../services/inventoryService";
import type { CatalogProduct, ProductImage, ProductSpecification, ProductDocument } from "../../data/mockCatalog";
import type { ProductInventory } from "../../data/mockInventory";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { fileToBase64, validateFileSize, formatFileSize, downloadBase64File } from "../../utils/fileUtils";

export function CatalogProductDetail({ isNew = false }: { isNew?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState<ProductInventory[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");

  const [form, setForm] = useState<Partial<CatalogProduct>>({
    name: "",
    shortDescription: "",
    description: "",
    segment: "Solar Tech",
    status: "Draft",
    isFeatured: false,
    warrantyInformation: "",
    installationInformation: ""
  });

  const [specs, setSpecs] = useState<Partial<ProductSpecification>[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [docs, setDocs] = useState<ProductDocument[]>([]);
  const [stock, setStock] = useState(0);

  // File Upload refs & errors
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  // Preview modals
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ProductDocument | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const invs = await inventoryService.getInventory();
      setInventoryProducts(invs);

      if (!isNew && id) {
        const prod = await catalogService.getProduct(id);
        if (prod) {
          setForm(prod);
          setSpecs(prod.specs || []);
          setImages(prod.images || []);
          setDocs(prod.docs || []);
          setStock(prod.stock || 0);

          const matchingInv = invs.find(i => i.productId === prod.id || i.productName.toLowerCase() === prod.name.toLowerCase());
          if (matchingInv) {
            setSelectedInventoryId(matchingInv.productId);
          }
        } else {
          navigate("/catalog");
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, isNew, navigate]);

  const handleInventorySelect = (productId: string) => {
    setSelectedInventoryId(productId);
    const inv = inventoryProducts.find(p => p.productId === productId);
    if (inv) {
      setForm(prev => ({
        ...prev,
        name: inv.productName,
        segment: inv.segment,
      }));
      setStock(inv.quantity);
    }
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    setSaving(true);
    try {
      const dataToSave = { 
        ...form, 
        id: isNew && selectedInventoryId ? selectedInventoryId : form.id,
        status,
        specs,
        images,
        docs
      };

      if (isNew) {
        await catalogService.addProduct(dataToSave as any);
        navigate("/catalog");
      } else if (id) {
        await catalogService.updateProduct(id, dataToSave as any);
        navigate("/catalog");
      }
    } catch (err) {
      console.error("Save product error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Image Upload handler (Max 5MB, base64)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setImageError(null);

    const validation = validateFileSize(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setImageError(validation.error || "Image exceeds 5MB limit");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const newImg: ProductImage = {
        id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: form.id || id || "",
        url: base64,
        isPrimary: images.length === 0,
        altText: file.name
      };
      setImages([...images, newImg]);
    } catch {
      setImageError("Failed to convert image to base64");
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // Set primary image
  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  // Remove image
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  // Document Upload handler (Max 5MB, base64)
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setDocError(null);

    const validation = validateFileSize(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setDocError(validation.error || "Document exceeds 5MB limit");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const isPdf = file.name.toLowerCase().endsWith(".pdf");
      const newDoc: ProductDocument = {
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: form.id || id || "",
        name: file.name,
        title: file.name,
        type: isPdf ? "DATASHEET" : "BROCHURE",
        fileUrl: base64,
        fileSize: formatFileSize(file.size),
        createdAt: new Date().toISOString()
      };
      setDocs([...docs, newDoc]);
    } catch {
      setDocError("Failed to convert document to base64");
    } finally {
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const removeDoc = (index: number) => {
    setDocs(docs.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { groupName: "General", name: "", value: "", unit: "", displayOrder: specs.length + 1 }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-12 text-center text-[#8a949d] font-semibold">Loading product...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1000px] mx-auto w-full pb-24">
      {/* Hidden file pickers */}
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={docInputRef} 
        onChange={handleDocUpload} 
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <button 
            onClick={() => navigate("/catalog")} 
            className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-[#fcfdfa] text-ink transition-colors flex-shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-ink truncate">
              {isNew ? "Create Product" : form.name}
            </h1>
            <p className="text-[#8a949d] text-xs sm:text-[14px] font-medium mt-0.5 truncate">
              {isNew ? "Create a product that will appear on the public catalog." : `${form.segment} • Commercial Catalog Product`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={() => handleSave('Draft')} 
            disabled={saving}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full border border-line text-[13px] sm:text-[14px] font-bold text-ink hover:bg-[#fcfdfa] transition-colors cursor-pointer text-center disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('Published')} 
            disabled={saving}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full bg-brand-green text-white text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-brand-green2 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* 1. Basic Info */}
        <section className="bg-white border border-line rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-line">
            <h2 className="text-[15px] sm:text-[16px] font-bold text-ink">1. Basic Information</h2>
            {stock > 0 && (
              <span className="text-[12px] font-bold text-brand-green bg-[#eff5ed] px-3 py-1 rounded-full">
                {stock} Units in Inventory
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-bold text-ink">
                  Link to Inventory Product *
                </label>
                {selectedInventoryId && (
                  <span className="text-[12px] font-bold text-brand-green flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Linked to inventory
                  </span>
                )}
              </div>
              <Select
                placeholder="-- Choose Product from Inventory --"
                options={inventoryProducts.map(inv => ({
                  value: inv.productId,
                  label: inv.productName,
                  sublabel: `${inv.availableQuantity} available • ${inv.segment}`,
                }))}
                value={selectedInventoryId}
                onChange={val => handleInventorySelect(val)}
              />
              <p className="text-[12px] text-[#8a949d] mt-1.5 font-medium">
                Selecting a product links it directly to warehouse inventory stock, tracking, and segment automatically.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-2">Product Name *</label>
              <input 
                required 
                value={form.name || ""} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full border border-line rounded-xl px-4 py-3 text-[14px] focus:outline-brand-green font-semibold text-ink bg-[#fcfdfa]" 
                placeholder="Product name populated from inventory" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Short Description</label>
              <textarea 
                rows={3} 
                value={form.shortDescription || ""} 
                onChange={e => setForm({...form, shortDescription: e.target.value})} 
                className="w-full border border-line rounded-xl p-3 text-[14px] focus:outline-brand-green bg-[#fcfdfa] resize-y" 
                placeholder="Brief summary for product cards"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Full Description</label>
              <textarea 
                rows={3} 
                value={form.description || ""} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full border border-line rounded-xl p-3 text-[14px] focus:outline-brand-green bg-[#fcfdfa] resize-y" 
                placeholder="Detailed commercial description"
              />
            </div>
          </div>
        </section>

        {/* 2. Classification: Classified ONLY by Segment (Category and Brand removed per prompt) */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
            <div>
              <h2 className="text-[16px] font-bold text-ink">2. Segment Classification</h2>
              <p className="text-xs text-[#8a949d] mt-0.5">Assigned business segment for catalog filtering and customer portal grouping.</p>
            </div>
            <span className="text-xs font-bold text-brand-green bg-[#eaf4ea] px-3 py-1 rounded-full">
              Segment-Driven
            </span>
          </div>
          <div className="max-w-md">
            <Select
              label="Segment"
              required
              options={["Solar Tech", "Luxe", "EV", "Electronics"]}
              value={form.segment}
              onChange={val => setForm({...form, segment: val as any})}
            />
          </div>
        </section>

        {/* 3. Images (Upload, Base64 storage, Download, Preview, 5MB limit) */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-line">
            <div>
              <h2 className="text-[16px] font-bold text-ink">3. Images & Media (Max 5MB each)</h2>
              <p className="text-xs text-[#8a949d]">Upload product gallery images. Encoded and saved as Base64 in database.</p>
            </div>
            <button 
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 hover:bg-brand-green2 cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" /> Upload Image
            </button>
          </div>

          {imageError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {imageError}
            </div>
          )}

          <div className="flex gap-4 overflow-x-auto pb-2 items-center">
            {images.map((img, idx) => (
              <div 
                key={img.id || idx} 
                className="relative w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden border border-line group bg-[#f8faf7] shadow-2xs"
              >
                <img 
                  src={img.url} 
                  alt={img.altText || `Product Image ${idx + 1}`} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewImage(img)}
                />

                {img.isPrimary && (
                  <div className="absolute top-2 left-2 bg-brand-green text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> PRIMARY
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button 
                      type="button"
                      onClick={() => downloadBase64File(img.url, img.altText || `product-image-${idx + 1}.png`)}
                      title="Download image"
                      className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xs text-ink hover:text-brand-green cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      title="Delete image"
                      className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xs text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img)}
                      className="px-2 py-1 bg-white/90 rounded text-[10px] font-bold text-ink hover:bg-white flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className="px-2 py-1 bg-brand-green text-white rounded text-[10px] font-bold hover:bg-brand-green2 cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-36 h-36 flex-shrink-0 rounded-2xl border-2 border-dashed border-line flex flex-col items-center justify-center text-[#8a949d] hover:bg-[#fcfdfa] hover:border-brand-green hover:text-brand-green transition-all cursor-pointer p-3 text-center"
            >
              <Plus className="w-6 h-6 mb-1 text-brand-green" />
              <span className="text-[12px] font-extrabold text-ink">Add Image</span>
              <span className="text-[10px] text-[#8a949d] mt-0.5">Max 5MB</span>
            </button>
          </div>
        </section>

        {/* 4. Specifications */}
        <section className="bg-white border border-line rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
            <div>
              <h2 className="text-[16px] font-bold text-ink">4. Technical Specifications</h2>
              <p className="text-xs text-[#8a949d]">Key product metrics and electrical/physical properties.</p>
            </div>
            <button 
              type="button"
              onClick={handleAddSpec} 
              className="text-[13px] font-bold text-brand-green flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Spec
            </button>
          </div>
          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-2 sm:gap-3 items-start">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <input value={spec.groupName} onChange={e => { const s = [...specs]; s[index].groupName = e.target.value; setSpecs(s); }} placeholder="Group (e.g. Electrical)" className="w-full border border-line rounded-xl px-3 py-2 text-[13px] focus:outline-brand-green bg-[#fcfdfa]" />
                  <input value={spec.name} onChange={e => { const s = [...specs]; s[index].name = e.target.value; setSpecs(s); }} placeholder="Name (e.g. Voltage)" className="w-full border border-line rounded-xl px-3 py-2 text-[13px] focus:outline-brand-green bg-[#fcfdfa]" />
                  <input value={spec.value} onChange={e => { const s = [...specs]; s[index].value = e.target.value; setSpecs(s); }} placeholder="Value (e.g. 220)" className="w-full border border-line rounded-xl px-3 py-2 text-[13px] focus:outline-brand-green bg-[#fcfdfa]" />
                  <input value={spec.unit} onChange={e => { const s = [...specs]; s[index].unit = e.target.value; setSpecs(s); }} placeholder="Unit (e.g. V)" className="w-full border border-line rounded-xl px-3 py-2 text-[13px] focus:outline-brand-green bg-[#fcfdfa]" />
                </div>
                <button 
                  type="button"
                  onClick={() => removeSpec(index)} 
                  className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {specs.length === 0 && <div className="text-center text-[#8a949d] text-[13px] py-4 font-semibold">No specifications added yet.</div>}
          </div>
        </section>

        {/* 5. Documents & Spec Sheets (Upload, Download, Display, 5MB limit) */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
            <div>
              <h2 className="text-[16px] font-bold text-ink">5. Technical Documents & Spec Sheets (Max 5MB)</h2>
              <p className="text-xs text-[#8a949d]">Datasheets, installation manuals, warranties and user guides.</p>
            </div>
            <button 
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="px-4 py-2 bg-brand-green text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 hover:bg-brand-green2 cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" /> Upload Document
            </button>
          </div>

          {docError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {docError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">Warranty Information</label>
              <input 
                value={form.warrantyInformation || ""} 
                onChange={e => setForm({...form, warrantyInformation: e.target.value})} 
                placeholder="e.g. 5 Years Manufacturer Warranty" 
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-brand-green bg-[#fcfdfa]" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">Installation Information</label>
              <input 
                value={form.installationInformation || ""} 
                onChange={e => setForm({...form, installationInformation: e.target.value})} 
                placeholder="e.g. Requires certified electrical technician" 
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-brand-green bg-[#fcfdfa]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-2">Attached Documents</label>
            <div className="space-y-2.5">
              {docs.map((doc, idx) => (
                <div 
                  key={doc.id || idx} 
                  className="flex items-center justify-between p-3.5 border border-line rounded-xl bg-[#fcfdfa] hover:border-brand-green/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#eaf4ea] text-brand-green flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-ink truncate" title={doc.name || doc.title}>
                        {doc.name || doc.title}
                      </div>
                      <div className="text-[11px] font-bold text-[#8a949d] flex items-center gap-2">
                        <span className="uppercase">{doc.type}</span>
                        {doc.fileSize && <span>• {doc.fileSize}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      type="button"
                      onClick={() => downloadBase64File(doc.fileUrl, doc.name || doc.title || "spec-sheet.pdf")}
                      className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold text-brand-green hover:bg-[#eaf4ea] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold text-ink hover:bg-[#f8faf7] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeDoc(idx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                      title="Remove document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {docs.length === 0 && (
                <div 
                  onClick={() => docInputRef.current?.click()}
                  className="border-2 border-dashed border-line rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#fcfdfa] hover:bg-[#f8faf7] hover:border-brand-green transition-all cursor-pointer"
                >
                  <FileText className="w-8 h-8 text-[#8a949d] mb-1.5" />
                  <div className="text-[13px] font-bold text-ink">Upload Specification Datasheet or Brochure</div>
                  <div className="text-[11px] text-[#8a949d] mt-0.5">PDF, DOC, DOCX up to 5MB</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. Inventory Summary */}
        {!isNew && (
          <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
              <h2 className="text-[16px] font-bold text-ink">6. Inventory Overview</h2>
              <button 
                type="button"
                onClick={() => navigate("/inventory")} 
                className="text-[13px] font-bold text-brand-green hover:underline cursor-pointer"
              >
                Manage in Inventory →
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Total Available Stock</div>
                <div className="text-3xl font-black text-ink">{stock} <span className="text-base text-[#8a949d] font-semibold">units</span></div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <Modal 
          isOpen={Boolean(previewImage)} 
          onClose={() => setPreviewImage(null)} 
          title={previewImage.altText || "Image Preview"}
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-[#f8faf7] rounded-2xl p-4 max-h-[500px] overflow-hidden border border-line">
              <img src={previewImage.url} alt={previewImage.altText} className="max-h-[460px] w-auto object-contain rounded-xl shadow-xs" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => downloadBase64File(previewImage.url, previewImage.altText || "product-image.png")}
                className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-extrabold hover:bg-brand-green2 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Document View / Preview Modal */}
      {previewDoc && (
        <Modal 
          isOpen={Boolean(previewDoc)} 
          onClose={() => setPreviewDoc(null)} 
          title={previewDoc.name || previewDoc.title || "Document Details"}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-8 text-center bg-[#f8faf7] border border-line rounded-2xl">
              <FileText className="w-16 h-16 text-brand-green mx-auto mb-3" />
              <div className="font-black text-ink text-lg">{previewDoc.name || previewDoc.title}</div>
              <div className="text-xs text-[#8a949d] uppercase mt-1">
                Type: {previewDoc.type} {previewDoc.fileSize && `• ${previewDoc.fileSize}`}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-full border border-line text-sm font-bold text-ink hover:bg-[#fcfdfa]"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => downloadBase64File(previewDoc.fileUrl, previewDoc.name || previewDoc.title || "spec.pdf")}
                className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-extrabold hover:bg-brand-green2 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Document
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
