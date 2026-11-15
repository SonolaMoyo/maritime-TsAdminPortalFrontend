import type { Order, OrderStatus } from '../data/mockOrders';
import { apiFetch } from './apiClient';

class OrdersService {
  async getOrders(segment?: string, status?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (segment && segment !== 'All') params.append('segment', segment);
    if (status && status !== 'All') params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiFetch<Order[]>(`/orders${query}`);
    return response.data || [];
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const response = await apiFetch<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: Partial<Order> & { paymentMethod?: string; paymentRef?: string }): Promise<Order> {
    const response = await apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async addActivity(orderId: string, type: string, description: string, actor: string = "Operations User"): Promise<Order> {
    await apiFetch(`/orders/${orderId}/activities`, {
      method: 'POST',
      body: JSON.stringify({ type, description, actor }),
    });
    const order = await this.getOrderById(orderId);
    return order!;
  }
  
  async addNote(orderId: string, authorOrText: string, text?: string): Promise<Order> {
    const author = text !== undefined ? authorOrText : "Operations User";
    const noteText = text !== undefined ? text : authorOrText;
    await apiFetch(`/orders/${orderId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text: noteText, author }),
    });
    const order = await this.getOrderById(orderId);
    return order!;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  async allocateStock(orderId: string, allocations: Record<string, number>): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/allocate`, {
      method: 'POST',
      body: JSON.stringify({ allocations }),
    });
    return response.data;
  }

  async markReadyForDispatch(orderId: string): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/ready-for-dispatch`, {
      method: 'POST',
    });
    return response.data;
  }

  async dispatchOrder(orderId: string, carrier: string, trackingRef: string, expectedDelivery: string): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ carrier, trackingRef, expectedDelivery }),
    });
    return response.data;
  }

  async confirmDelivery(orderId: string, receivedBy: string, notes?: string): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/confirm-delivery`, {
      method: 'POST',
      body: JSON.stringify({ receivedBy, notes }),
    });
    return response.data;
  }

  async completeOrder(orderId: string): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/complete`, {
      method: 'POST',
    });
    return response.data;
  }

  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const response = await apiFetch<Order>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  }
}

export const ordersService = new OrdersService();
