import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, Upload } from "lucide-react";
import { catalogService } from "../../services/catalogService";
import type { CatalogProduct, ProductCategory, Brand, ProductImage, ProductSpecification, ProductDocument } from "../../data/mockCatalog";

export function CatalogProductDetail({ isNew = false }: { isNew?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [form, setForm] = useState<Partial<CatalogProduct>>({
    name: "",
    shortDescription: "",
    description: "",
    segment: "Solar Tech",
    categoryId: "",
    brandId: "",
    status: "Draft",
    isFeatured: false,
    warrantyInformation: "",
    installationInformation: ""
  });

  const [specs, setSpecs] = useState<Partial<ProductSpecification>[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [docs, setDocs] = useState<ProductDocument[]>([]);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [cats, brnds] = await Promise.all([
        catalogService.getCategories(),
        catalogService.getBrands()
      ]);
      setCategories(cats);
      setBrands(brnds);

      if (!isNew && id) {
        const prod = await catalogService.getProduct(id);
        if (prod) {
          setForm(prod);
          setSpecs(prod.specs);
          setImages(prod.images);
          setDocs(prod.docs);
          setStock(prod.stock || 0);
        } else {
          navigate("/catalog");
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, isNew, navigate]);

  const handleSave = async (status: 'Draft' | 'Published') => {
    const dataToSave = { ...form, status };
    if (isNew) {
      await catalogService.addProduct(dataToSave as any);
      navigate("/catalog");
    } else if (id) {
      await catalogService.updateProduct(id, dataToSave as any);
      // For a real app, we'd also save specs, images, docs.
      navigate("/catalog");
    }
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
    <div className="p-6 max-w-[1000px] mx-auto w-full pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/catalog")} className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-[#fcfdfa] text-ink transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-ink">{isNew ? "Create Product" : form.name}</h1>
          <p className="text-[#8a949d] text-[14px] font-medium mt-1">
            {isNew ? "Create a product that will appear on the public website." : `${form.segment} / ${categories.find(c => c.id === form.categoryId)?.name || 'Uncategorized'} / ${brands.find(b => b.id === form.brandId)?.name || 'No Brand'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleSave('Draft')} className="px-5 py-2.5 rounded-full border border-line text-[14px] font-bold text-ink hover:bg-[#fcfdfa] transition-colors">
            Save Draft
          </button>
          <button onClick={() => handleSave('Published')} className="px-5 py-2.5 rounded-full bg-brand-green text-white text-[14px] font-bold flex items-center gap-2 hover:bg-brand-green2 transition-colors">
            <Save className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Basic Info */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-ink mb-6 pb-4 border-b border-line">1. Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-2">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Short Description</label>
              <textarea rows={3} value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green resize-y" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Full Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green resize-y" />
            </div>
          </div>
        </section>

        {/* 2. Classification */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-ink mb-6 pb-4 border-b border-line">2. Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Segment *</label>
              <select value={form.segment} onChange={e => setForm({...form, segment: e.target.value as any})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green bg-white">
                <option value="Solar Tech">Solar Tech</option>
                <option value="Luxe">Luxe</option>
                <option value="EV">EV</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Category *</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green bg-white">
                <option value="">Select Category...</option>
                {categories.filter(c => c.segment === form.segment).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Brand</label>
              <select value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})} className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green bg-white">
                <option value="">Select Brand...</option>
                {brands.filter(b => b.segments.includes(form.segment as string)).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 3. Images */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
            <h2 className="text-[16px] font-bold text-ink">3. Images & Media</h2>
            <button className="text-[13px] font-bold text-brand-green flex items-center gap-1 hover:underline">
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map(img => (
              <div key={img.id} className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-line group">
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                {img.isPrimary && <div className="absolute top-2 left-2 bg-brand-green text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">PRIMARY</div>}
                <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm text-red-500 hover:bg-red-50">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button className="w-32 h-32 flex-shrink-0 rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center text-[#8a949d] hover:bg-[#fcfdfa] hover:border-brand-green hover:text-brand-green transition-colors">
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[12px] font-bold">Add Image</span>
            </button>
          </div>
        </section>

        {/* 4. Specifications */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
            <h2 className="text-[16px] font-bold text-ink">4. Specifications</h2>
            <button onClick={handleAddSpec} className="text-[13px] font-bold text-brand-green flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Spec
            </button>
          </div>
          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-4 gap-3">
                  <input value={spec.groupName} onChange={e => { const s = [...specs]; s[index].groupName = e.target.value; setSpecs(s); }} placeholder="Group (e.g. Electrical)" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] focus:outline-brand-green" />
                  <input value={spec.name} onChange={e => { const s = [...specs]; s[index].name = e.target.value; setSpecs(s); }} placeholder="Name (e.g. Voltage)" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] focus:outline-brand-green" />
                  <input value={spec.value} onChange={e => { const s = [...specs]; s[index].value = e.target.value; setSpecs(s); }} placeholder="Value (e.g. 220)" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] focus:outline-brand-green" />
                  <input value={spec.unit} onChange={e => { const s = [...specs]; s[index].unit = e.target.value; setSpecs(s); }} placeholder="Unit (e.g. V)" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] focus:outline-brand-green" />
                </div>
                <button onClick={() => removeSpec(index)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {specs.length === 0 && <div className="text-center text-[#8a949d] text-[13px] py-4">No specifications added.</div>}
          </div>
        </section>

        {/* 5. Docs, Warranty, Installation */}
        <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-ink mb-6 pb-4 border-b border-line">5. Details & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Warranty Information</label>
              <input value={form.warrantyInformation} onChange={e => setForm({...form, warrantyInformation: e.target.value})} placeholder="e.g. 5 Years Manufacturer Warranty" className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2">Installation Information</label>
              <input value={form.installationInformation} onChange={e => setForm({...form, installationInformation: e.target.value})} placeholder="e.g. Requires certified electrician" className="w-full border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-brand-green" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-2">Documents (Brochures / Datasheets)</label>
              <div className="space-y-2">
                {docs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-line rounded-lg bg-[#fcfdfa]">
                    <div className="text-[13px] font-medium text-ink flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-line text-[10px] font-black uppercase text-[#5b6671]">{doc.type}</span>
                      {doc.name}
                    </div>
                    <button className="text-[12px] font-bold text-red-500 hover:underline">Remove</button>
                  </div>
                ))}
                <button className="text-[13px] font-bold text-brand-green flex items-center gap-1 hover:underline pt-2">
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Inventory Summary */}
        {!isNew && (
          <section className="bg-white border border-line rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
              <h2 className="text-[16px] font-bold text-ink">6. Inventory Overview</h2>
              <button onClick={() => navigate("/inventory")} className="text-[13px] font-bold text-brand-green hover:underline">Manage in Inventory →</button>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-[12px] font-bold text-[#8a949d] uppercase mb-1">Total Available Stock</div>
                <div className="text-3xl font-black text-ink">{stock}</div>
              </div>
              {/* Optional: Add warehouse split if we loaded it, but total stock is fine for Catalog */}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
