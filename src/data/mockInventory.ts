export type SegmentType = "Solar Tech" | "Luxe" | "EV" | "Electronics";

export interface ProductInventory {
  id: string;
  productId: string;
  productName: string;
  segment: SegmentType;
  warehouseId: string;
  quantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  reorderThreshold: number;
  status: "Healthy" | "Low Stock" | "Out of Stock";
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface InventoryReceipt {
  id: string;
  referenceNumber: string;
  supplierId: string;
  warehouseId: string;
  expectedDate: string;
  status: "Expected" | "In Transit" | "Received" | "Cancelled";
  items: {
    productId: string;
    productName: string;
    expectedQuantity: number;
    receivedQuantity: number;
    unitCost: number;
  }[];
  createdAt: string;
}

export interface InventoryTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "Requested" | "Approved" | "In Transit" | "Completed";
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  productsSupplied: number;
  activeOrders: number;
  status: "Active" | "Inactive";
}

export interface InventoryActivity {
  id: string;
  date: string;
  type: string;
  description: string;
  warehouse: string;
  quantity?: number;
}

export const mockWarehouses: Warehouse[] = [
  { id: "wh-1", name: "Lagos Warehouse", location: "Lagos, Nigeria", address: "123 Industrial Ave", manager: "Tunde Bakare", status: "Active", createdAt: new Date().toISOString() },
  { id: "wh-2", name: "Abuja Hub", location: "Abuja, Nigeria", address: "45 Distribution Way", manager: "Aisha Bello", status: "Active", createdAt: new Date().toISOString() },
  { id: "wh-3", name: "Port Harcourt Depot", location: "Port Harcourt, Nigeria", address: "8 Marina Road", manager: "Chidi Nze", status: "Active", createdAt: new Date().toISOString() }
];

export const mockSuppliers: Supplier[] = [
  { id: "sup-1", name: "Solar Ltd", contactPerson: "John Doe", email: "contact@solarltd.com", phone: "+234 800 123 4567", productsSupplied: 24, activeOrders: 3, status: "Active" },
  { id: "sup-2", name: "EV Motors", contactPerson: "Jane Smith", email: "sales@evmotors.co", phone: "+234 800 987 6543", productsSupplied: 12, activeOrders: 1, status: "Active" },
  { id: "sup-3", name: "Luxe Furnishings", contactPerson: "Mark Anthony", email: "info@luxef.com", phone: "+234 801 234 5678", productsSupplied: 45, activeOrders: 0, status: "Active" },
  { id: "sup-4", name: "Tech Giant Electronics", contactPerson: "Sarah Lee", email: "supply@tge.com", phone: "+234 802 345 6789", productsSupplied: 120, activeOrders: 5, status: "Active" }
];

export const mockInventory: ProductInventory[] = [
  { id: "inv-1", productId: "prod-1", productName: "Solar Inverter 10kW", segment: "Solar Tech", warehouseId: "wh-1", quantity: 100, allocatedQuantity: 25, availableQuantity: 75, reorderThreshold: 20, status: "Healthy", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "inv-2", productId: "prod-1", productName: "Solar Inverter 10kW", segment: "Solar Tech", warehouseId: "wh-2", quantity: 25, allocatedQuantity: 10, availableQuantity: 15, reorderThreshold: 20, status: "Low Stock", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "inv-3", productId: "prod-2", productName: "EV Charger 22kW", segment: "EV", warehouseId: "wh-1", quantity: 30, allocatedQuantity: 15, availableQuantity: 15, reorderThreshold: 15, status: "Low Stock", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "inv-4", productId: "prod-3", productName: "Samsung 85\" QLED TV", segment: "Electronics", warehouseId: "wh-1", quantity: 5, allocatedQuantity: 5, availableQuantity: 0, reorderThreshold: 10, status: "Out of Stock", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "inv-5", productId: "prod-4", productName: "Italian Leather Sofa", segment: "Luxe", warehouseId: "wh-2", quantity: 12, allocatedQuantity: 2, availableQuantity: 10, reorderThreshold: 5, status: "Healthy", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const mockReceipts: InventoryReceipt[] = [
  { id: "rec-1", referenceNumber: "PO-00124", supplierId: "sup-1", warehouseId: "wh-1", expectedDate: new Date(Date.now() + 86400000 * 3).toISOString(), status: "In Transit", items: [{ productId: "prod-1", productName: "Solar Inverter 10kW", expectedQuantity: 100, receivedQuantity: 0, unitCost: 150000 }], createdAt: new Date().toISOString() },
  { id: "rec-2", referenceNumber: "PO-00125", supplierId: "sup-2", warehouseId: "wh-2", expectedDate: new Date(Date.now() + 86400000 * 6).toISOString(), status: "Expected", items: [{ productId: "prod-2", productName: "EV Charger 22kW", expectedQuantity: 50, receivedQuantity: 0, unitCost: 450000 }], createdAt: new Date().toISOString() }
];

export const mockTransfers: InventoryTransfer[] = [
  { id: "trf-1", transferNumber: "TRF-00124", fromWarehouseId: "wh-1", toWarehouseId: "wh-2", productId: "prod-1", productName: "Solar Inverter 10kW", quantity: 20, status: "In Transit", date: new Date().toISOString() },
  { id: "trf-2", transferNumber: "TRF-00125", fromWarehouseId: "wh-2", toWarehouseId: "wh-1", productId: "prod-4", productName: "Italian Leather Sofa", quantity: 5, status: "Completed", date: new Date(Date.now() - 86400000).toISOString() }
];

export const mockActivities: InventoryActivity[] = [
  { id: "act-1", date: new Date().toISOString(), type: "Received", description: "100 Solar Panels received", warehouse: "Lagos Warehouse", quantity: 100 },
  { id: "act-2", date: new Date(Date.now() - 3600000).toISOString(), type: "Transfer", description: "20 EV Chargers transferred", warehouse: "Lagos → Abuja", quantity: 20 },
  { id: "act-3", date: new Date(Date.now() - 7200000).toISOString(), type: "Allocation", description: "10 Solar Inverters allocated to ORD-001482", warehouse: "Lagos Warehouse", quantity: -10 },
  { id: "act-4", date: new Date(Date.now() - 86400000).toISOString(), type: "Threshold", description: "Stock threshold updated for Solar Inverter 10kW", warehouse: "Global" }
];
