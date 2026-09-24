import { 
  mockCatalogProducts, 
  mockCategories, 
  mockBrands, 
  mockProductImages,
  mockProductSpecs,
  mockProductDocs,
  mockMediaLibrary
} from '../data/mockCatalog';
import type {
  CatalogProduct,
  ProductCategory,
  Brand,
  MediaAsset
} from '../data/mockCatalog';
import { mockInventory } from '../data/mockInventory';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CatalogService {
  private products = [...mockCatalogProducts];
  private categories = [...mockCategories];
  private brands = [...mockBrands];
  private images = [...mockProductImages];
  private specs = [...mockProductSpecs];
  private docs = [...mockProductDocs];
  private media = [...mockMediaLibrary];

  async getProducts(): Promise<(CatalogProduct & { stock: number })[]> {
    await delay(300);
    return this.products.map(p => {
      const invItems = mockInventory.filter(i => i.productId === p.id);
      const totalStock = invItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...p, stock: totalStock };
    });
  }

  async getProduct(id: string) {
    await delay(300);
    const product = this.products.find(p => p.id === id);
    if (!product) return null;
    
    const productImages = this.images.filter(i => i.productId === id);
    const productSpecs = this.specs.filter(s => s.productId === id);
    const productDocs = this.docs.filter(d => d.productId === id);
    
    const invItems = mockInventory.filter(i => i.productId === id);
    const stock = invItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...product,
      images: productImages,
      specs: productSpecs,
      docs: productDocs,
      stock
    };
  }

  async addProduct(product: Partial<CatalogProduct>) {
    await delay(300);
    const newProduct: CatalogProduct = {
      id: `prod-${Date.now()}`,
      name: product.name || 'New Product',
      slug: (product.name || 'New Product').toLowerCase().replace(/\s+/g, '-'),
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      segment: product.segment || 'Solar Tech',
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      status: product.status || 'Draft',
      isFeatured: product.isFeatured || false,
      warrantyInformation: product.warrantyInformation || '',
      installationInformation: product.installationInformation || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products = [newProduct, ...this.products];
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<CatalogProduct>) {
    await delay(300);
    this.products = this.products.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
  }

  async getCategories() {
    await delay(300);
    return this.categories;
  }

  async addCategory(cat: Partial<ProductCategory>) {
    await delay(300);
    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'New Category',
      segment: cat.segment || 'Solar Tech',
      productCount: 0,
      status: cat.status || 'Active'
    };
    this.categories = [newCat, ...this.categories];
    return newCat;
  }

  async getBrands() {
    await delay(300);
    return this.brands;
  }

  async addBrand(brand: Partial<Brand>) {
    await delay(300);
    const newBrand: Brand = {
      id: `br-${Date.now()}`,
      name: brand.name || 'New Brand',
      description: brand.description || '',
      website: brand.website || '',
      segments: brand.segments || [],
      productCount: 0,
      status: brand.status || 'Active'
    };
    this.brands = [newBrand, ...this.brands];
    return newBrand;
  }

  async getMedia() {
    await delay(300);
    return this.media;
  }

  async addMedia(file: Partial<MediaAsset>) {
    await delay(300);
    const newMedia: MediaAsset = {
      id: `media-${Date.now()}`,
      name: file.name || 'file',
      type: file.type || 'image/png',
      size: file.size || '0 KB',
      url: file.url || 'https://placehold.co/400',
      uploadedAt: new Date().toISOString(),
      usedBy: 0
    };
    this.media = [newMedia, ...this.media];
    return newMedia;
  }
}

export const catalogService = new CatalogService();
