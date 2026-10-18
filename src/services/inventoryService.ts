import { 
  mockInventory, mockWarehouses, mockReceipts, mockTransfers, mockSuppliers, mockActivities
} from '../data/mockInventory';
import type { 
  ProductInventory, Warehouse, InventoryReceipt, InventoryTransfer, Supplier, InventoryActivity 
} from '../data/mockInventory';
import { apiFetch } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class InventoryService {
  private fallbackInventory: ProductInventory[] = [...mockInventory];
  private fallbackWarehouses: Warehouse[] = [...mockWarehouses];
  private fallbackReceipts: InventoryReceipt[] = [...mockReceipts];
  private fallbackTransfers: InventoryTransfer[] = [...mockTransfers];
  private fallbackSuppliers: Supplier[] = [...mockSuppliers];
  private fallbackActivities: InventoryActivity[] = [...mockActivities];

  async getInventory(segment?: string, warehouseId?: string, status?: string): Promise<ProductInventory[]> {
    try {
      const params = new URLSearchParams();
      if (segment && segment !== 'All') params.append('segment', segment);
      if (warehouseId) params.append('warehouseId', warehouseId);
      if (status && status !== 'All') params.append('status', status);
      const query = params.toString() ? `?${params.toString()}` : '';

      const response = await apiFetch<ProductInventory[]>(`/inventory${query}`);
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error, using placeholder data:', err);
      await delay(200);
      return [...this.fallbackInventory];
    }
  }

  async getWarehouses(): Promise<Warehouse[]> {
    try {
      const response = await apiFetch<Warehouse[]>('/inventory/warehouses');
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error fetching warehouses, using placeholder:', err);
      await delay(150);
      return [...this.fallbackWarehouses];
    }
  }

  async getReceipts(): Promise<InventoryReceipt[]> {
    try {
      const response = await apiFetch<InventoryReceipt[]>('/inventory/receipts');
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error fetching receipts, using placeholder:', err);
      await delay(150);
      return [...this.fallbackReceipts];
    }
  }

  async getTransfers(): Promise<InventoryTransfer[]> {
    try {
      const response = await apiFetch<InventoryTransfer[]>('/inventory/transfers');
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error fetching transfers, using placeholder:', err);
      await delay(150);
      return [...this.fallbackTransfers];
    }
  }

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiFetch<Supplier[]>('/inventory/suppliers');
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error fetching suppliers, using placeholder:', err);
      await delay(150);
      return [...this.fallbackSuppliers];
    }
  }

  async getActivities(): Promise<InventoryActivity[]> {
    try {
      const response = await apiFetch<InventoryActivity[]>('/inventory/activities');
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error fetching activities, using placeholder:', err);
      await delay(150);
      return [...this.fallbackActivities];
    }
  }

  async recordActivity(type: string, description: string, warehouse: string, quantity?: number): Promise<void> {
    const act: InventoryActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      description,
      warehouse,
      quantity
    };
    this.fallbackActivities = [act, ...this.fallbackActivities];
  }

  async adjustThreshold(inventoryId: string, newThreshold: number): Promise<ProductInventory> {
    try {
      const response = await apiFetch<ProductInventory>(`/inventory/${inventoryId}/threshold`, {
        method: 'PATCH',
        body: JSON.stringify({ reorderThreshold: newThreshold }),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error adjusting threshold, using local fallback:', err);
      await delay(200);
      const index = this.fallbackInventory.findIndex(i => i.id === inventoryId);
      if (index === -1) throw new Error("Inventory record not found");
      
      this.fallbackInventory[index] = { ...this.fallbackInventory[index], reorderThreshold: newThreshold, updatedAt: new Date().toISOString() };
      return this.fallbackInventory[index];
    }
  }

  async receiveStock(inventoryId: string, quantity: number, reference?: string): Promise<ProductInventory> {
    try {
      const response = await apiFetch<ProductInventory>(`/inventory/${inventoryId}/receive`, {
        method: 'POST',
        body: JSON.stringify({ quantity, reference }),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error receiving stock, using local fallback:', err);
      await delay(200);
      const index = this.fallbackInventory.findIndex(i => i.id === inventoryId);
      if (index === -1) throw new Error("Inventory record not found");

      const inv = this.fallbackInventory[index];
      const newQuantity = inv.quantity + quantity;
      const newAvailable = inv.availableQuantity + quantity;
      
      let newStatus = inv.status;
      if (newAvailable <= 0) newStatus = "Out of Stock";
      else if (newAvailable <= inv.reorderThreshold) newStatus = "Low Stock";
      else newStatus = "Healthy";

      this.fallbackInventory[index] = {
        ...inv,
        quantity: newQuantity,
        availableQuantity: newAvailable,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      return this.fallbackInventory[index];
    }
  }

  async createTransfer(fromWarehouseId: string, toWarehouseId: string, productId: string, productName: string, quantity: number): Promise<InventoryTransfer> {
    try {
      const response = await apiFetch<InventoryTransfer>('/inventory/transfers', {
        method: 'POST',
        body: JSON.stringify({ fromWarehouseId, toWarehouseId, productId, productName, quantity }),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error creating transfer, using local fallback:', err);
      await delay(200);
      const newTransfer: InventoryTransfer = {
        id: `trf-${Date.now()}`,
        transferNumber: `TRF-${Math.floor(Math.random() * 100000)}`,
        fromWarehouseId,
        toWarehouseId,
        productId,
        productName,
        quantity,
        status: "In Transit",
        date: new Date().toISOString()
      };

      this.fallbackTransfers = [newTransfer, ...this.fallbackTransfers];
      return newTransfer;
    }
  }

  async addProduct(product: Partial<ProductInventory>): Promise<ProductInventory> {
    try {
      const response = await apiFetch<ProductInventory>('/inventory', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error adding product, using local fallback:', err);
      await delay(200);
      const newProduct: ProductInventory = {
        id: `inv-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        productName: product.productName || "New Product",
        segment: product.segment || "Solar Tech",
        warehouseId: product.warehouseId || "wh-1",
        quantity: product.quantity || 0,
        allocatedQuantity: 0,
        availableQuantity: product.quantity || 0,
        reorderThreshold: product.reorderThreshold || 10,
        status: product.quantity ? "Healthy" : "Out of Stock",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.fallbackInventory = [newProduct, ...this.fallbackInventory];
      return newProduct;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[InventoryService] API error deleting product, using local fallback:', err);
      this.fallbackInventory = this.fallbackInventory.filter(i => i.id !== id);
    }
  }

  async addWarehouse(warehouse: Partial<Warehouse>): Promise<Warehouse> {
    try {
      const response = await apiFetch<Warehouse>('/inventory/warehouses', {
        method: 'POST',
        body: JSON.stringify(warehouse),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error adding warehouse, using local fallback:', err);
      await delay(150);
      const newWh: Warehouse = {
        id: `wh-${Date.now()}`,
        name: warehouse.name || "New Warehouse",
        location: warehouse.location || "Unknown",
        address: warehouse.address || "",
        manager: warehouse.manager || "Unassigned",
        status: warehouse.status || "Active",
        createdAt: new Date().toISOString()
      };
      this.fallbackWarehouses = [newWh, ...this.fallbackWarehouses];
      return newWh;
    }
  }

  async deleteWarehouse(id: string): Promise<void> {
    try {
      await apiFetch(`/inventory/warehouses/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[InventoryService] API error deleting warehouse, using local fallback:', err);
      this.fallbackWarehouses = this.fallbackWarehouses.filter(w => w.id !== id);
    }
  }

  async addSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await apiFetch<Supplier>('/inventory/suppliers', {
        method: 'POST',
        body: JSON.stringify(supplier),
      });
      return response.data;
    } catch (err) {
      console.warn('[InventoryService] API error adding supplier, using local fallback:', err);
      await delay(150);
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name: supplier.name || "New Supplier",
        contactPerson: supplier.contactPerson || "Unknown",
        email: supplier.email || "",
        phone: supplier.phone || "",
        productsSupplied: 0,
        activeOrders: 0,
        status: supplier.status || "Active"
      };
      this.fallbackSuppliers = [newSup, ...this.fallbackSuppliers];
      return newSup;
    }
  }

  async deleteSupplier(id: string): Promise<void> {
    try {
      await apiFetch(`/inventory/suppliers/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[InventoryService] API error deleting supplier, using local fallback:', err);
      this.fallbackSuppliers = this.fallbackSuppliers.filter(s => s.id !== id);
    }
  }
}

export const inventoryService = new InventoryService();
