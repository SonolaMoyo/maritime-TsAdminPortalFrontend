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
import { apiFetch } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CatalogService {
  private fallbackProducts = [...mockCatalogProducts];
  private fallbackCategories = [...mockCategories];
  private fallbackBrands = [...mockBrands];
  private fallbackImages = [...mockProductImages];
  private fallbackSpecs = [...mockProductSpecs];
  private fallbackDocs = [...mockProductDocs];
  private fallbackMedia = [...mockMediaLibrary];

  async getProducts(segment?: string, categoryId?: string, brandId?: string, isFeatured?: boolean): Promise<(CatalogProduct & { stock: number })[]> {
    try {
      const params = new URLSearchParams();
      if (segment && segment !== 'All') params.append('segment', segment);
      if (categoryId) params.append('categoryId', categoryId);
      if (brandId) params.append('brandId', brandId);
      if (isFeatured !== undefined) params.append('isFeatured', String(isFeatured));
      const query = params.toString() ? `?${params.toString()}` : '';

      const response = await apiFetch<(CatalogProduct & { stock: number })[]>(`/catalog/products${query}`);
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error fetching products, using placeholder:', err);
      await delay(200);
      return this.fallbackProducts.map(p => {
        const invItems = mockInventory.filter(i => i.productId === p.id);
        const totalStock = invItems.reduce((sum, item) => sum + item.quantity, 0);
        return { ...p, stock: totalStock };
      });
    }
  }

  async getProduct(id: string) {
    try {
      const response = await apiFetch<any>(`/catalog/products/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`[CatalogService] API error fetching product ${id}, using placeholder:`, err);
      await delay(200);
      const product = this.fallbackProducts.find(p => p.id === id);
      if (!product) return null;
      
      const productImages = this.fallbackImages.filter(i => i.productId === id);
      const productSpecs = this.fallbackSpecs.filter(s => s.productId === id);
      const productDocs = this.fallbackDocs.filter(d => d.productId === id);
      
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
  }

  async addProduct(product: Partial<CatalogProduct>) {
    try {
      const response = await apiFetch<CatalogProduct>('/catalog/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error adding product, using local fallback:', err);
      await delay(200);
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
      this.fallbackProducts = [newProduct, ...this.fallbackProducts];
      return newProduct;
    }
  }

  async updateProduct(id: string, updates: Partial<CatalogProduct>) {
    try {
      const response = await apiFetch<CatalogProduct>(`/catalog/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error updating product, using local fallback:', err);
      await delay(200);
      this.fallbackProducts = this.fallbackProducts.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
    }
  }

  async getCategories(segment?: string) {
    try {
      const params = segment && segment !== 'All' ? `?segment=${encodeURIComponent(segment)}` : '';
      const response = await apiFetch<ProductCategory[]>(`/catalog/categories${params}`);
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error fetching categories, using placeholder:', err);
      await delay(150);
      return this.fallbackCategories;
    }
  }

  async addCategory(cat: Partial<ProductCategory>) {
    try {
      const response = await apiFetch<ProductCategory>('/catalog/categories', {
        method: 'POST',
        body: JSON.stringify(cat),
      });
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error adding category, using local fallback:', err);
      await delay(150);
      const newCat: ProductCategory = {
        id: `cat-${Date.now()}`,
        name: cat.name || 'New Category',
        segment: cat.segment || 'Solar Tech',
        productCount: 0,
        status: cat.status || 'Active'
      };
      this.fallbackCategories = [newCat, ...this.fallbackCategories];
      return newCat;
    }
  }

  async getBrands(segment?: string) {
    try {
      const params = segment && segment !== 'All' ? `?segment=${encodeURIComponent(segment)}` : '';
      const response = await apiFetch<Brand[]>(`/catalog/brands${params}`);
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error fetching brands, using placeholder:', err);
      await delay(150);
      return this.fallbackBrands;
    }
  }

  async addBrand(brand: Partial<Brand>) {
    try {
      const response = await apiFetch<Brand>('/catalog/brands', {
        method: 'POST',
        body: JSON.stringify(brand),
      });
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error adding brand, using local fallback:', err);
      await delay(150);
      const newBrand: Brand = {
        id: `br-${Date.now()}`,
        name: brand.name || 'New Brand',
        description: brand.description || '',
        website: brand.website || '',
        segments: brand.segments || [],
        productCount: 0,
        status: brand.status || 'Active'
      };
      this.fallbackBrands = [newBrand, ...this.fallbackBrands];
      return newBrand;
    }
  }

  async getMedia() {
    try {
      const response = await apiFetch<MediaAsset[]>('/catalog/media');
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error fetching media, using placeholder:', err);
      await delay(150);
      return this.fallbackMedia;
    }
  }

  async addMedia(file: Partial<MediaAsset> & { base64Data?: string }) {
    try {
      const response = await apiFetch<MediaAsset>('/catalog/media/upload', {
        method: 'POST',
        body: JSON.stringify({
          name: file.name || 'file',
          type: file.type || 'image/png',
          base64Data: file.base64Data || 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        }),
      });
      return response.data;
    } catch (err) {
      console.warn('[CatalogService] API error uploading media, using local fallback:', err);
      await delay(150);
      const newMedia: MediaAsset = {
        id: `media-${Date.now()}`,
        name: file.name || 'file',
        type: file.type || 'image/png',
        size: file.size || '0 KB',
        url: file.url || 'https://placehold.co/400',
        uploadedAt: new Date().toISOString(),
        usedBy: 0
      };
      this.fallbackMedia = [newMedia, ...this.fallbackMedia];
      return newMedia;
    }
  }
}

export const catalogService = new CatalogService();
