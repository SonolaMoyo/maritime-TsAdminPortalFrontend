import { mockOrders } from '../data/mockOrders';
import type { Order, OrderStatus } from '../data/mockOrders';
import { apiFetch } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class OrdersService {
  private fallbackOrders: Order[] = [...mockOrders];

  async getOrders(segment?: string, status?: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (segment && segment !== 'All') params.append('segment', segment);
      if (status && status !== 'All') params.append('status', status);
      const query = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiFetch<Order[]>(`/orders${query}`);
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API unavailable, using placeholder mock data:', err);
      await delay(200);
      return [...this.fallbackOrders];
    }
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    try {
      const response = await apiFetch<Order>(`/orders/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`[OrdersService] API error fetching order ${id}, using placeholder data:`, err);
      await delay(150);
      return this.fallbackOrders.find(o => o.id === id);
    }
  }

  async createOrder(data: Partial<Order> & { paymentMethod?: string; paymentRef?: string }): Promise<Order> {
    try {
      const response = await apiFetch<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error creating order, falling back to local simulation:', err);
      await delay(200);
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
      
      this.fallbackOrders = [newOrder, ...this.fallbackOrders];
      return newOrder;
    }
  }

  async addActivity(orderId: string, type: string, description: string, actor: string = "Operations User"): Promise<Order> {
    try {
      await apiFetch(`/orders/${orderId}/activities`, {
        method: 'POST',
        body: JSON.stringify({ type, description }),
      });
      const order = await this.getOrderById(orderId);
      return order!;
    } catch (err) {
      console.warn('[OrdersService] API error adding activity, falling back to local simulation:', err);
      await delay(150);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');
      
      const newActivity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor,
        type,
        description
      };
      
      this.fallbackOrders[index] = { 
        ...this.fallbackOrders[index], 
        updatedAt: new Date().toISOString(),
        activities: [newActivity, ...this.fallbackOrders[index].activities]
      };
      return this.fallbackOrders[index];
    }
  }
  
  async addNote(orderId: string, text: string, author: string = "Operations User"): Promise<Order> {
    try {
      await apiFetch(`/orders/${orderId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const order = await this.getOrderById(orderId);
      return order!;
    } catch (err) {
      console.warn('[OrdersService] API error adding note, falling back to local simulation:', err);
      await delay(150);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');
      
      const newNote = {
        id: `not-${Date.now()}`,
        date: new Date().toISOString(),
        author,
        text
      };
      
      this.fallbackOrders[index] = { 
        ...this.fallbackOrders[index], 
        notes: [newNote, ...this.fallbackOrders[index].notes]
      };
      return this.fallbackOrders[index];
    }
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error updating status, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');
      this.fallbackOrders[index] = { 
        ...this.fallbackOrders[index], 
        status,
        updatedAt: new Date().toISOString()
      };
      return this.fallbackOrders[index];
    }
  }

  async allocateStock(orderId: string, allocations: Record<string, number>): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/allocate`, {
        method: 'POST',
        body: JSON.stringify({ allocations }),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error allocating stock, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');
      
      const order = this.fallbackOrders[index];
      const updatedItems = order.items.map(item => ({
        ...item,
        allocatedQuantity: allocations[item.id] !== undefined ? allocations[item.id] : item.allocatedQuantity
      }));

      const isFullyAllocated = updatedItems.every(i => i.allocatedQuantity >= i.quantity);
      
      this.fallbackOrders[index] = { 
        ...order, 
        items: updatedItems,
        delivery: {
          ...order.delivery,
          status: isFullyAllocated ? "Ready for Dispatch" : "Processing"
        },
        updatedAt: new Date().toISOString()
      };
      return this.fallbackOrders[index];
    }
  }

  async markReadyForDispatch(orderId: string): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/ready-for-dispatch`, {
        method: 'POST',
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');

      const activity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor: "Operations User",
        type: "Fulfillment",
        description: "Packaging completed. Order marked Ready for Dispatch"
      };

      this.fallbackOrders[index] = {
        ...this.fallbackOrders[index],
        status: 'Ready for Dispatch',
        delivery: {
          ...this.fallbackOrders[index].delivery,
          status: 'Ready for Dispatch'
        },
        activities: [activity, ...this.fallbackOrders[index].activities],
        updatedAt: new Date().toISOString()
      };
      return this.fallbackOrders[index];
    }
  }

  async dispatchOrder(orderId: string, carrier: string, trackingRef: string, expectedDelivery: string): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/dispatch`, {
        method: 'POST',
        body: JSON.stringify({ carrier, trackingRef, expectedDelivery }),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error dispatching order, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');
      
      const activity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor: "Logistics Team",
        type: "Dispatch",
        description: `Dispatched via ${carrier}. Tracking: ${trackingRef}`
      };

      this.fallbackOrders[index] = {
        ...this.fallbackOrders[index],
        status: 'In Transit',
        delivery: {
          ...this.fallbackOrders[index].delivery,
          status: 'In Transit',
          carrier,
          trackingRef,
          dispatchDate: new Date().toISOString(),
          expectedDelivery
        },
        activities: [activity, ...this.fallbackOrders[index].activities],
        updatedAt: new Date().toISOString()
      };
      
      return this.fallbackOrders[index];
    }
  }

  async confirmDelivery(orderId: string, receivedBy: string, notes?: string): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/confirm-delivery`, {
        method: 'POST',
        body: JSON.stringify({ receivedBy, notes }),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error confirming delivery, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');

      const activity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor: "Logistics Team",
        type: "Delivered",
        description: `Delivery confirmed. Received by ${receivedBy}${notes ? ` (${notes})` : ''}`
      };

      this.fallbackOrders[index] = {
        ...this.fallbackOrders[index],
        status: 'Delivered',
        delivery: {
          ...this.fallbackOrders[index].delivery,
          status: 'Delivered',
          receivedBy,
          deliveryDate: new Date().toISOString()
        },
        activities: [activity, ...this.fallbackOrders[index].activities],
        updatedAt: new Date().toISOString()
      };

      return this.fallbackOrders[index];
    }
  }

  async completeOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/complete`, {
        method: 'POST',
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error completing order, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');

      const activity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor: "Operations User",
        type: "Completion",
        description: "Order finalized and marked Completed"
      };

      this.fallbackOrders[index] = {
        ...this.fallbackOrders[index],
        status: 'Completed',
        activities: [activity, ...this.fallbackOrders[index].activities],
        updatedAt: new Date().toISOString()
      };

      return this.fallbackOrders[index];
    }
  }

  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    try {
      const response = await apiFetch<Order>(`/orders/${orderId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return response.data;
    } catch (err) {
      console.warn('[OrdersService] API error cancelling order, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackOrders.findIndex(o => o.id === orderId);
      if (index === -1) throw new Error('Order not found');

      const activity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        actor: "Operations User",
        type: "Cancellation",
        description: `Order cancelled. Reason: ${reason}`
      };

      this.fallbackOrders[index] = {
        ...this.fallbackOrders[index],
        status: 'Cancelled',
        activities: [activity, ...this.fallbackOrders[index].activities],
        updatedAt: new Date().toISOString()
      };

      return this.fallbackOrders[index];
    }
  }
}

export const ordersService = new OrdersService();
