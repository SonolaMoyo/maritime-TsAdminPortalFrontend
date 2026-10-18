import { mockRequests } from '../data/mockRequests';
import type { QuoteRequest, RequestStatus } from '../data/mockRequests';
import { apiFetch } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RequestsService {
  private fallbackRequests: QuoteRequest[] = [...mockRequests];

  async getRequests(segment?: string, status?: string): Promise<QuoteRequest[]> {
    try {
      const params = new URLSearchParams();
      if (segment && segment !== 'All') params.append('segment', segment);
      if (status && status !== 'All') params.append('status', status);
      const query = params.toString() ? `?${params.toString()}` : '';

      const response = await apiFetch<QuoteRequest[]>(`/requests${query}`);
      return response.data;
    } catch (err) {
      console.warn('[RequestsService] API error, using placeholder data:', err);
      await delay(200);
      return [...this.fallbackRequests];
    }
  }

  async getRequestById(id: string): Promise<QuoteRequest | undefined> {
    try {
      const response = await apiFetch<QuoteRequest>(`/requests/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`[RequestsService] API error fetching request ${id}, using placeholder:`, err);
      await delay(150);
      return this.fallbackRequests.find(r => r.id === id);
    }
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<QuoteRequest> {
    try {
      const response = await apiFetch<QuoteRequest>(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.data;
    } catch (err) {
      console.warn('[RequestsService] API error updating status, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      this.fallbackRequests[index] = { 
        ...this.fallbackRequests[index], 
        status,
        lastActivity: new Date().toISOString()
      };
      
      return this.fallbackRequests[index];
    }
  }

  async assignRequest(id: string, owner: string): Promise<QuoteRequest> {
    try {
      const response = await apiFetch<QuoteRequest>(`/requests/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ owner }),
      });
      return response.data;
    } catch (err) {
      console.warn('[RequestsService] API error assigning owner, falling back to local simulation:', err);
      await delay(200);
      const index = this.fallbackRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      this.fallbackRequests[index] = { 
        ...this.fallbackRequests[index], 
        owner,
        status: this.fallbackRequests[index].status === 'New' ? 'Assigned' : this.fallbackRequests[index].status,
        lastActivity: new Date().toISOString()
      };
      
      return this.fallbackRequests[index];
    }
  }

  async createRequest(data: Partial<QuoteRequest>): Promise<QuoteRequest> {
    try {
      const response = await apiFetch<QuoteRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (err) {
      console.warn('[RequestsService] API error creating request, falling back to local simulation:', err);
      await delay(200);
      const newReq: QuoteRequest = {
        id: `req-${Date.now()}`,
        requestNumber: `REQ-00${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: data.customerName || '',
        companyName: data.companyName || '',
        email: data.email || '',
        phone: data.phone || '',
        product: data.product || '',
        category: data.category || 'General',
        segment: data.segment || 'Solar Tech',
        quantity: data.quantity || 1,
        deliveryLocation: data.deliveryLocation || '',
        additionalInfo: data.additionalInfo || '',
        status: 'New',
        owner: null,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        activities: [{
          id: `act-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'System',
          description: 'Request received. Lead created automatically.'
        }],
        notes: []
      };
      
      this.fallbackRequests = [newReq, ...this.fallbackRequests];
      return newReq;
    }
  }

  async addActivity(id: string, type: string, description: string): Promise<QuoteRequest> {
    try {
      await apiFetch(`/requests/${id}/activities`, {
        method: 'POST',
        body: JSON.stringify({ type, description }),
      });
      const req = await this.getRequestById(id);
      return req!;
    } catch (err) {
      console.warn('[RequestsService] API error adding activity, falling back to local simulation:', err);
      await delay(150);
      const index = this.fallbackRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      const newActivity = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString(),
        type,
        description
      };
      
      this.fallbackRequests[index] = { 
        ...this.fallbackRequests[index], 
        lastActivity: new Date().toISOString(),
        activities: [newActivity, ...this.fallbackRequests[index].activities]
      };
      
      return this.fallbackRequests[index];
    }
  }

  async addNote(id: string, author: string, text: string): Promise<QuoteRequest> {
    try {
      await apiFetch(`/requests/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ author, text }),
      });
      const req = await this.getRequestById(id);
      return req!;
    } catch (err) {
      console.warn('[RequestsService] API error adding note, falling back to local simulation:', err);
      await delay(150);
      const index = this.fallbackRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      const newNote = {
        id: `not-${Date.now()}`,
        author,
        date: new Date().toISOString(),
        text
      };
      
      this.fallbackRequests[index] = { 
        ...this.fallbackRequests[index], 
        notes: [newNote, ...this.fallbackRequests[index].notes]
      };
      
      return this.fallbackRequests[index];
    }
  }
}

export const requestsService = new RequestsService();
