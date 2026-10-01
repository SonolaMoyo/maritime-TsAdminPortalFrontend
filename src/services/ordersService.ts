import { mockOrders } from '../data/mockOrders';
import type { Order, OrderStatus } from '../data/mockOrders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class OrdersService {
  private orders: Order[] = [...mockOrders];

  async getOrders(): Promise<Order[]> {
    await delay(300);
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    await delay(200);
    return this.orders.find(o => o.id === id);
  }

  async createOrder(data: Partial<Order> & { paymentMethod?: string; paymentRef?: string }): Promise<Order> {
    await delay(300);
    const totalAmount = data.totalAmount || 0;
    const paymentMethod = data.paymentMethod || data.payment?.method || "Bank Transfer";
    const paymentRef = data.paymentRef || data.payment?.reference || `PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-00${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: data.customerName || "Unknown",
      companyName: data.companyName || "",
      email: data.email || "",
      phone: data.phone || "",
      segment: data.segment || "Solar Tech",
      // Orders are already confirmed and paid for, so they enter Processing immediately
      status: "Processing",
      items: data.items || [],
      subtotal: data.subtotal || totalAmount,
      discount: data.discount || 0,
      deliveryFee: data.deliveryFee || 0,
      totalAmount: totalAmount,
      payment: {
        status: "Paid",
        amountDue: totalAmount,
        amountPaid: totalAmount,
        method: paymentMethod,
        reference: paymentRef,
        date: new Date().toISOString()
      },
      delivery: {
        status: "Processing",
        location: data.delivery?.location || "",
        address: data.delivery?.address || ""
      },
      activities: [
        { 
          id: `act-${Date.now()}`, 
          date: new Date().toISOString(), 
          actor: "System", 
          type: "Order Created", 
          description: `Order confirmed & payment verified (₦${totalAmount.toLocaleString()} via ${paymentMethod}) — moved directly to Processing` 
        }
      ],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.orders = [newOrder, ...this.orders];
    return newOrder;
  }

  async addActivity(orderId: string, type: string, description: string, actor: string = "Operations User"): Promise<Order> {
    await delay(200);
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
    await delay(200);
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
    await delay(250);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    this.orders[index] = { 
      ...this.orders[index], 
      status,
      updatedAt: new Date().toISOString()
    };
    return this.orders[index];
  }

  async allocateStock(orderId: string, allocations: Record<string, number>): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const order = this.orders[index];
    const updatedItems = order.items.map(item => ({
      ...item,
      allocatedQuantity: allocations[item.id] !== undefined ? allocations[item.id] : item.allocatedQuantity
    }));

    const isFullyAllocated = updatedItems.every(i => i.allocatedQuantity >= i.quantity);
    
    this.orders[index] = { 
      ...order, 
      items: updatedItems,
      // If fully allocated and still processing, we keep processing or allow transitioning to Ready for Dispatch
      delivery: {
        ...order.delivery,
        status: isFullyAllocated ? "Ready for Dispatch" : "Processing"
      },
      updatedAt: new Date().toISOString()
    };
    return this.orders[index];
  }

  async markReadyForDispatch(orderId: string): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const activity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor: "Operations User",
      type: "Fulfillment",
      description: "Packaging completed. Order marked Ready for Dispatch"
    };

    this.orders[index] = {
      ...this.orders[index],
      status: 'Ready for Dispatch',
      delivery: {
        ...this.orders[index].delivery,
        status: 'Ready for Dispatch'
      },
      activities: [activity, ...this.orders[index].activities],
      updatedAt: new Date().toISOString()
    };
    return this.orders[index];
  }

  async dispatchOrder(orderId: string, carrier: string, trackingRef: string, expectedDelivery: string): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    
    const activity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor: "Logistics Team",
      type: "Dispatch",
      description: `Dispatched via ${carrier}. Tracking: ${trackingRef}`
    };

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
      },
      activities: [activity, ...this.orders[index].activities],
      updatedAt: new Date().toISOString()
    };
    
    return this.orders[index];
  }

  async confirmDelivery(orderId: string, receivedBy: string, notes?: string): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const activity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor: "Logistics Team",
      type: "Delivered",
      description: `Delivery confirmed. Received by ${receivedBy}${notes ? ` (${notes})` : ''}`
    };

    this.orders[index] = {
      ...this.orders[index],
      status: 'Delivered',
      delivery: {
        ...this.orders[index].delivery,
        status: 'Delivered',
        receivedBy,
        deliveryDate: new Date().toISOString()
      },
      activities: [activity, ...this.orders[index].activities],
      updatedAt: new Date().toISOString()
    };

    return this.orders[index];
  }

  async completeOrder(orderId: string): Promise<Order> {
    await delay(250);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const activity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor: "Operations User",
      type: "Completion",
      description: "Order finalized and marked Completed"
    };

    this.orders[index] = {
      ...this.orders[index],
      status: 'Completed',
      activities: [activity, ...this.orders[index].activities],
      updatedAt: new Date().toISOString()
    };

    return this.orders[index];
  }

  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    await delay(250);
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const activity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      actor: "Operations User",
      type: "Cancellation",
      description: `Order cancelled. Reason: ${reason}`
    };

    this.orders[index] = {
      ...this.orders[index],
      status: 'Cancelled',
      activities: [activity, ...this.orders[index].activities],
      updatedAt: new Date().toISOString()
    };

    return this.orders[index];
  }
}

export const ordersService = new OrdersService();
