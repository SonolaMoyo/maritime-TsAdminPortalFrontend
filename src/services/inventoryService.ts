import { 
  mockInventory, mockWarehouses, mockReceipts, mockTransfers, mockSuppliers, mockActivities
} from '../data/mockInventory';
import type { 
  ProductInventory, Warehouse, InventoryReceipt, InventoryTransfer, Supplier, InventoryActivity 
} from '../data/mockInventory';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class InventoryService {
  private inventory: ProductInventory[] = [...mockInventory];
  private warehouses: Warehouse[] = [...mockWarehouses];
  private receipts: InventoryReceipt[] = [...mockReceipts];
  private transfers: InventoryTransfer[] = [...mockTransfers];
  private suppliers: Supplier[] = [...mockSuppliers];
  private activities: InventoryActivity[] = [...mockActivities];

  async getInventory(): Promise<ProductInventory[]> {
    await delay(400);
    return [...this.inventory];
  }

  async getWarehouses(): Promise<Warehouse[]> {
    await delay(200);
    return [...this.warehouses];
  }

  async getReceipts(): Promise<InventoryReceipt[]> {
    await delay(300);
    return [...this.receipts];
  }

  async getTransfers(): Promise<InventoryTransfer[]> {
    await delay(300);
    return [...this.transfers];
  }

  async getSuppliers(): Promise<Supplier[]> {
    await delay(200);
    return [...this.suppliers];
  }

  async getActivities(): Promise<InventoryActivity[]> {
    await delay(200);
    return [...this.activities];
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
    this.activities = [act, ...this.activities];
  }

  async adjustThreshold(inventoryId: string, newThreshold: number): Promise<ProductInventory> {
    await delay(400);
    const index = this.inventory.findIndex(i => i.id === inventoryId);
    if (index === -1) throw new Error("Inventory record not found");
    
    this.inventory[index] = { ...this.inventory[index], reorderThreshold: newThreshold, updatedAt: new Date().toISOString() };
    await this.recordActivity("Threshold", `Threshold updated for ${this.inventory[index].productName}`, "Global");
    return this.inventory[index];
  }

  async receiveStock(inventoryId: string, quantity: number): Promise<ProductInventory> {
    await delay(500);
    const index = this.inventory.findIndex(i => i.id === inventoryId);
    if (index === -1) throw new Error("Inventory record not found");

    const inv = this.inventory[index];
    const newQuantity = inv.quantity + quantity;
    const newAvailable = inv.availableQuantity + quantity;
    
    let newStatus = inv.status;
    if (newAvailable <= 0) newStatus = "Out of Stock";
    else if (newAvailable <= inv.reorderThreshold) newStatus = "Low Stock";
    else newStatus = "Healthy";

    this.inventory[index] = {
      ...inv,
      quantity: newQuantity,
      availableQuantity: newAvailable,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    const warehouse = this.warehouses.find(w => w.id === inv.warehouseId)?.name || "Unknown";
    await this.recordActivity("Received", `${quantity} ${inv.productName} received`, warehouse, quantity);

    return this.inventory[index];
  }

  async createTransfer(fromWarehouseId: string, toWarehouseId: string, productId: string, productName: string, quantity: number): Promise<InventoryTransfer> {
    await delay(500);
    
    // In a real app we'd validate stock availability here
    
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

    this.transfers = [newTransfer, ...this.transfers];
    
    const fromName = this.warehouses.find(w => w.id === fromWarehouseId)?.name || "";
    const toName = this.warehouses.find(w => w.id === toWarehouseId)?.name || "";
    
    await this.recordActivity("Transfer", `${quantity} ${productName} transferred`, `${fromName} → ${toName}`, quantity);
    
    return newTransfer;
  }
  async addProduct(product: Partial<ProductInventory>): Promise<ProductInventory> {
    await delay(300);
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
    this.inventory = [newProduct, ...this.inventory];
    return newProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(300);
    this.inventory = this.inventory.filter(i => i.id !== id);
  }

  async addWarehouse(warehouse: Partial<Warehouse>): Promise<Warehouse> {
    await delay(300);
    const newWh: Warehouse = {
      id: `wh-${Date.now()}`,
      name: warehouse.name || "New Warehouse",
      location: warehouse.location || "Unknown",
      address: warehouse.address || "",
      manager: warehouse.manager || "Unassigned",
      status: warehouse.status || "Active",
      createdAt: new Date().toISOString()
    };
    this.warehouses = [newWh, ...this.warehouses];
    return newWh;
  }

  async deleteWarehouse(id: string): Promise<void> {
    await delay(300);
    this.warehouses = this.warehouses.filter(w => w.id !== id);
  }

  async addSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
    await delay(300);
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
    this.suppliers = [newSup, ...this.suppliers];
    return newSup;
  }

  async deleteSupplier(id: string): Promise<void> {
    await delay(300);
    this.suppliers = this.suppliers.filter(s => s.id !== id);
  }
}

export const inventoryService = new InventoryService();
