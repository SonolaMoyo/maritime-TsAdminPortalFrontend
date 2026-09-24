import { mockRequests } from '../data/mockRequests';
import type { QuoteRequest, RequestStatus } from '../data/mockRequests';

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RequestsService {
  private requests: QuoteRequest[] = [...mockRequests];

  async getRequests(): Promise<QuoteRequest[]> {
    await delay(600);
    return [...this.requests];
  }

  async getRequestById(id: string): Promise<QuoteRequest | undefined> {
    await delay(400);
    return this.requests.find(r => r.id === id);
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<QuoteRequest> {
    await delay(500);
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    this.requests[index] = { 
      ...this.requests[index], 
      status,
      lastActivity: new Date().toISOString()
    };
    
    return this.requests[index];
  }

  async assignRequest(id: string, owner: string): Promise<QuoteRequest> {
    await delay(500);
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    this.requests[index] = { 
      ...this.requests[index], 
      owner,
      status: this.requests[index].status === 'New' ? 'Assigned' : this.requests[index].status,
      lastActivity: new Date().toISOString()
    };
    
    return this.requests[index];
  }

  async createRequest(data: Partial<QuoteRequest>): Promise<QuoteRequest> {
    await delay(600);
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
        description: 'Request received from website. System Lead created automatically.'
      }],
      notes: []
    };
    
    this.requests = [newReq, ...this.requests];
    return newReq;
  }

  async addActivity(id: string, type: string, description: string): Promise<QuoteRequest> {
    await delay(300);
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    const newActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      description
    };
    
    this.requests[index] = { 
      ...this.requests[index], 
      lastActivity: new Date().toISOString(),
      activities: [newActivity, ...this.requests[index].activities]
    };
    
    return this.requests[index];
  }

  async addNote(id: string, author: string, text: string): Promise<QuoteRequest> {
    await delay(300);
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    const newNote = {
      id: `not-${Date.now()}`,
      author,
      date: new Date().toISOString(),
      text
    };
    
    this.requests[index] = { 
      ...this.requests[index], 
      notes: [newNote, ...this.requests[index].notes]
    };
    
    return this.requests[index];
  }
}

export const requestsService = new RequestsService();
