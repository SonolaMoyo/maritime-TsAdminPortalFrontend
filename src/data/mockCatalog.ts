export type ProductStatus = 'Published' | 'Draft' | 'Deactivated';

export interface CatalogProduct {
  id: string; // same as productId in inventory for simplicity
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  segment: 'Solar Tech' | 'Luxe' | 'EV' | 'Electronics';
  categoryId: string;
  brandId: string;
  status: ProductStatus;
  isFeatured: boolean;
  warrantyInformation: string;
  installationInformation: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  segment: 'Solar Tech' | 'Luxe' | 'EV' | 'Electronics';
  productCount: number;
  status: 'Active' | 'Inactive';
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  website: string;
  segments: string[];
  productCount: number;
  status: 'Active' | 'Inactive';
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
  altText: string;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  groupName: string;
  name: string;
  value: string;
  unit?: string;
  displayOrder: number;
}

export interface ProductDocument {
  id: string;
  productId: string;
  type: 'BROCHURE' | 'DATASHEET';
  name: string;
  fileUrl: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: string;
  usedBy: number;
}

export const mockCategories: ProductCategory[] = [
  { id: 'cat-1', name: 'Inverters', segment: 'Solar Tech', productCount: 24, status: 'Active' },
  { id: 'cat-2', name: 'Batteries', segment: 'Solar Tech', productCount: 18, status: 'Active' },
  { id: 'cat-3', name: 'EV Chargers', segment: 'EV', productCount: 12, status: 'Active' },
  { id: 'cat-4', name: 'Televisions', segment: 'Electronics', productCount: 40, status: 'Active' },
];

export const mockBrands: Brand[] = [
  { id: 'br-1', name: 'SolarMax', description: 'Leading solar provider', website: 'https://solarmax.com', segments: ['Solar Tech'], productCount: 24, status: 'Active' },
  { id: 'br-2', name: 'EVPower', description: 'Advanced EV charging', website: 'https://evpower.com', segments: ['EV'], productCount: 12, status: 'Active' },
  { id: 'br-3', name: 'Samsung', description: 'Electronics manufacturer', website: 'https://samsung.com', segments: ['Electronics'], productCount: 40, status: 'Active' },
];

export const mockCatalogProducts: CatalogProduct[] = [
  {
    id: 'prod-1', // maps to inventory prod-1
    name: 'SolarMax 10kW Hybrid Inverter',
    slug: 'solarmax-10kw-hybrid',
    shortDescription: 'High efficiency 10kW hybrid inverter for residential solar systems.',
    description: 'The SolarMax 10kW Hybrid Inverter is a top-tier energy management solution designed to optimize solar power generation and battery storage usage.',
    segment: 'Solar Tech',
    categoryId: 'cat-1',
    brandId: 'br-1',
    status: 'Published',
    isFeatured: true,
    warrantyInformation: '5 Years Manufacturer Warranty',
    installationInformation: 'Requires certified electrician for installation.',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    publishedAt: '2023-01-16T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'EVPower 22kW Wallbox',
    slug: 'evpower-22kw-wallbox',
    shortDescription: 'Fast AC charging station for electric vehicles.',
    description: 'A 22kW fast-charging AC wallbox compatible with all Type-2 electric vehicles, featuring smart load balancing.',
    segment: 'EV',
    categoryId: 'cat-3',
    brandId: 'br-2',
    status: 'Published',
    isFeatured: false,
    warrantyInformation: '2 Years Manufacturer Warranty',
    installationInformation: 'Professional installation required. 3-phase power supply needed.',
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2023-02-10T10:00:00Z',
    publishedAt: '2023-02-11T10:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Samsung 55" QLED 4K TV',
    slug: 'samsung-55-qled-4k',
    shortDescription: 'Stunning 4K QLED picture quality.',
    description: 'Experience stunning 4K visuals with Samsung\'s Quantum Dot technology and ultra-slim design.',
    segment: 'Electronics',
    categoryId: 'cat-4',
    brandId: 'br-3',
    status: 'Draft',
    isFeatured: false,
    warrantyInformation: '1 Year Manufacturer Warranty',
    installationInformation: 'Tabletop or wall mount (sold separately).',
    createdAt: '2023-03-05T10:00:00Z',
    updatedAt: '2023-03-05T10:00:00Z'
  }
];

export const mockProductImages: ProductImage[] = [
  { id: 'img-1', productId: 'prod-1', url: 'https://placehold.co/400?text=SolarMax+10kW', isPrimary: true, displayOrder: 1, altText: 'SolarMax 10kW Inverter Front' },
  { id: 'img-2', productId: 'prod-2', url: 'https://placehold.co/400?text=EVPower+22kW', isPrimary: true, displayOrder: 1, altText: 'EVPower 22kW Charger' },
];

export const mockProductSpecs: ProductSpecification[] = [
  { id: 'spec-1', productId: 'prod-1', groupName: 'Electrical', name: 'Voltage', value: '220', unit: 'V', displayOrder: 1 },
  { id: 'spec-2', productId: 'prod-1', groupName: 'Electrical', name: 'Power Output', value: '10', unit: 'kW', displayOrder: 2 },
  { id: 'spec-3', productId: 'prod-1', groupName: 'Electrical', name: 'Efficiency', value: '98', unit: '%', displayOrder: 3 },
];

export const mockProductDocs: ProductDocument[] = [
  { id: 'doc-1', productId: 'prod-1', type: 'BROCHURE', name: 'SolarMax 10kW Brochure', fileUrl: '/docs/solarmax-10kw-brochure.pdf', createdAt: '2023-01-16T10:00:00Z' },
  { id: 'doc-2', productId: 'prod-1', type: 'DATASHEET', name: 'Technical Datasheet', fileUrl: '/docs/solarmax-10kw-data.pdf', createdAt: '2023-01-16T10:00:00Z' }
];

export const mockMediaLibrary: MediaAsset[] = [
  { id: 'media-1', name: 'solarmax-hero.jpg', type: 'image/jpeg', size: '1.2 MB', url: 'https://placehold.co/800x400?text=Solar+Hero', uploadedAt: '2023-01-01T10:00:00Z', usedBy: 3 },
  { id: 'media-2', name: 'ev-charging-banner.png', type: 'image/png', size: '2.5 MB', url: 'https://placehold.co/800x400?text=EV+Charging', uploadedAt: '2023-01-02T10:00:00Z', usedBy: 1 },
];
