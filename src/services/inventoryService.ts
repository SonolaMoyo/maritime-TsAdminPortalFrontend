import type { 
  ProductInventory, Warehouse, InventoryReceipt, InventoryTransfer, Supplier, InventoryActivity 
} from '../data/mockInventory';
import { apiFetch } from './apiClient';

class InventoryService {
  async getInventory(segment?: string, warehouseId?: string, status?: string): Promise<ProductInventory[]> {
    const params = new URLSearchParams();
    if (segment && segment !== 'All') params.append('segment', segment);
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (status && status !== 'All') params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await apiFetch<ProductInventory[]>(`/inventory${query}`);
    return response.data || [];
  }

  async getWarehouses(): Promise<Warehouse[]> {
    const response = await apiFetch<Warehouse[]>('/inventory/warehouses');
    return response.data || [];
  }

  async getReceipts(): Promise<InventoryReceipt[]> {
    const response = await apiFetch<InventoryReceipt[]>('/inventory/receipts');
    return response.data || [];
  }

  async getTransfers(): Promise<InventoryTransfer[]> {
    const response = await apiFetch<InventoryTransfer[]>('/inventory/transfers');
    return response.data || [];
  }

  async getSuppliers(): Promise<Supplier[]> {
    const response = await apiFetch<Supplier[]>('/inventory/suppliers');
    return response.data || [];
  }

  async getActivities(): Promise<InventoryActivity[]> {
    const response = await apiFetch<InventoryActivity[]>('/inventory/activities');
    return response.data || [];
  }

  async adjustThreshold(inventoryId: string, newThreshold: number): Promise<ProductInventory> {
    const response = await apiFetch<ProductInventory>(`/inventory/${inventoryId}/threshold`, {
      method: 'PATCH',
      body: JSON.stringify({ reorderThreshold: newThreshold }),
    });
    return response.data;
  }

  async receiveStock(
    inventoryId: string | undefined,
    quantity: number,
    reference?: string,
    description?: string,
    productId?: string,
    warehouseId?: string
  ): Promise<ProductInventory> {
    const endpoint = inventoryId ? `/inventory/${inventoryId}/receive` : '/inventory/receive';
    const response = await apiFetch<ProductInventory>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ quantity, reference, description, productId, warehouseId }),
    });
    return response.data;
  }

  async createTransfer(fromWarehouseId: string, toWarehouseId: string, productId: string, productName: string, quantity: number): Promise<InventoryTransfer> {
    const response = await apiFetch<InventoryTransfer>('/inventory/transfers', {
      method: 'POST',
      body: JSON.stringify({ fromWarehouseId, toWarehouseId, productId, productName, quantity }),
    });
    return response.data;
  }

  async addProduct(product: Partial<ProductInventory>): Promise<ProductInventory> {
    const response = await apiFetch<ProductInventory>('/inventory', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
  }

  async addWarehouse(warehouse: Partial<Warehouse>): Promise<Warehouse> {
    const response = await apiFetch<Warehouse>('/inventory/warehouses', {
      method: 'POST',
      body: JSON.stringify(warehouse),
    });
    return response.data;
  }

  async deleteWarehouse(id: string): Promise<void> {
    await apiFetch(`/inventory/warehouses/${id}`, { method: 'DELETE' });
  }

  async addSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
    const response = await apiFetch<Supplier>('/inventory/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
    return response.data;
  }

  async deleteSupplier(id: string): Promise<void> {
    await apiFetch(`/inventory/suppliers/${id}`, { method: 'DELETE' });
  }
}

export const inventoryService = new InventoryService();
