import type {
  CatalogProduct,
  ProductCategory,
  Brand,
  MediaAsset
} from '../data/mockCatalog';
import { apiFetch } from './apiClient';

class CatalogService {
  async getProducts(segment?: string, categoryId?: string, brandId?: string, isFeatured?: boolean): Promise<(CatalogProduct & { stock: number })[]> {
    const params = new URLSearchParams();
    if (segment && segment !== 'All') params.append('segment', segment);
    if (categoryId) params.append('categoryId', categoryId);
    if (brandId) params.append('brandId', brandId);
    if (isFeatured !== undefined) params.append('isFeatured', String(isFeatured));
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await apiFetch<(CatalogProduct & { stock: number })[]>(`/catalog/products${query}`);
    return response.data || [];
  }

  async getProduct(id: string) {
    const response = await apiFetch<any>(`/catalog/products/${id}`);
    return response.data;
  }

  async addProduct(product: Partial<CatalogProduct>) {
    const response = await apiFetch<CatalogProduct>('/catalog/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.data;
  }

  async updateProduct(id: string, updates: Partial<CatalogProduct>) {
    const response = await apiFetch<CatalogProduct>(`/catalog/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await apiFetch<any>(`/catalog/products/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  async getCategories(segment?: string) {
    const params = segment && segment !== 'All' ? `?segment=${encodeURIComponent(segment)}` : '';
    const response = await apiFetch<ProductCategory[]>(`/catalog/categories${params}`);
    return response.data || [];
  }

  async addCategory(cat: Partial<ProductCategory>) {
    const response = await apiFetch<ProductCategory>('/catalog/categories', {
      method: 'POST',
      body: JSON.stringify(cat),
    });
    return response.data;
  }

  async getBrands(segment?: string) {
    const params = segment && segment !== 'All' ? `?segment=${encodeURIComponent(segment)}` : '';
    const response = await apiFetch<Brand[]>(`/catalog/brands${params}`);
    return response.data || [];
  }

  async addBrand(brand: Partial<Brand>) {
    const response = await apiFetch<Brand>('/catalog/brands', {
      method: 'POST',
      body: JSON.stringify(brand),
    });
    return response.data;
  }

  async getMedia() {
    const response = await apiFetch<MediaAsset[]>('/catalog/media');
    return response.data || [];
  }

  async addMedia(file: Partial<MediaAsset> & { base64Data?: string }) {
    const response = await apiFetch<MediaAsset>('/catalog/media/upload', {
      method: 'POST',
      body: JSON.stringify({
        name: file.name || 'file',
        type: file.type || 'image/png',
        base64Data: file.base64Data,
      }),
    });
    return response.data;
  }

  async deleteMedia(id: string) {
    await apiFetch(`/catalog/media/${id}`, { method: 'DELETE' });
  }

  async getSegmentContent(segment: string) {
    const response = await apiFetch<{
      id: string;
      segment: string;
      title: string;
      intro: string;
      capabilities: string;
      bannerImageUrl?: string;
    }>(`/catalog/segments/${encodeURIComponent(segment)}/content`);
    return response.data;
  }

  async saveSegmentContent(segment: string, content: {
    title: string;
    intro: string;
    capabilities: string;
    bannerImageUrl?: string;
  }) {
    const response = await apiFetch<any>(`/catalog/segments/${encodeURIComponent(segment)}/content`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
    return response.data;
  }
}

export const catalogService = new CatalogService();
