import { mockOrders } from '../data/mockOrders';
import type { Order, OrderStatus } from '../data/mockOrders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class OrdersService {
  private orders: Order[] = [...mockOrders];

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    await delay(300);
    return this.orders.find(o => o.id === id);
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    await delay(400);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-00${Math.floor(Math.random() * 10000)}`,
      customerName: data.customerName || "Unknown",
      companyName: data.companyName || "",
      email: data.email || "",
      phone: data.phone || "",
      segment: data.segment || "Solar Tech",
      status: "Pending Approval",
      items: data.items || [],
      subtotal: data.subtotal || 0,
      discount: data.discount || 0,
      deliveryFee: data.deliveryFee || 0,
      totalAmount: data.totalAmount || 0,
      payment: {
        status: "Unpaid",
        amountDue: data.totalAmount || 0,
        amountPaid: 0
      },
      delivery: {
        status: "Pending",
        location: data.delivery?.location || "",
        address: data.delivery?.address || ""
      },
      activities: [
        { id: `act-${Date.now()}`, date: new Date().toISOString(), actor: "System", type: "Order Created", description: "Order created manually" }
      ],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.orders = [newOrder, ...this.orders];
    return newOrder;
  }

  async addActivity(orderId: string, type: string, description: string, actor: string = "Operations User"): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const newActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor,
      type,
      description
    };
    
    this.orders[index] = { 
      ...this.orders[index], 
      updatedAt: new Date().toISOString(),
      activities: [newActivity, ...this.orders[index].activities]
    };
    return this.orders[index];
  }
  
  async addNote(orderId: string, text: string, author: string = "Operations User"): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const newNote = {
      id: `not-${Date.now()}`,
      date: new Date().toISOString(),
      author,
      text
    };
    
    this.orders[index] = { 
      ...this.orders[index], 
      notes: [newNote, ...this.orders[index].notes]
    };
    return this.orders[index];
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    this.orders[index] = { ...this.orders[index], status };
    return this.orders[index];
  }

  async recordPayment(orderId: string, amount: number, method: string, reference: string): Promise<Order> {
    await delay(400);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const order = this.orders[index];
    const newAmountPaid = order.payment.amountPaid + amount;
    const newStatus = newAmountPaid >= order.totalAmount ? 'Paid' : 'Partially Paid';
    
    this.orders[index] = {
      ...order,
      status: newStatus === 'Paid' ? 'Paid' : order.status,
      payment: {
        ...order.payment,
        status: newStatus,
        amountPaid: newAmountPaid,
        method,
        reference,
        date: new Date().toISOString()
      }
    };
    
    return this.orders[index];
  }

  async allocateStock(orderId: string, allocations: Record<string, number>): Promise<Order> {
    await delay(400);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const order = this.orders[index];
    const updatedItems = order.items.map(item => ({
      ...item,
      allocatedQuantity: allocations[item.id] !== undefined ? allocations[item.id] : item.allocatedQuantity
    }));
    
    this.orders[index] = { ...order, items: updatedItems };
    return this.orders[index];
  }

  async dispatchOrder(orderId: string, carrier: string, trackingRef: string, expectedDelivery: string): Promise<Order> {
    await delay(400);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    this.orders[index] = {
      ...this.orders[index],
      status: 'In Transit',
      delivery: {
        ...this.orders[index].delivery,
        status: 'In Transit',
        carrier,
        trackingRef,
        dispatchDate: new Date().toISOString(),
        expectedDelivery
      }
    };
    
    return this.orders[index];
  }
}

export const ordersService = new OrdersService();
