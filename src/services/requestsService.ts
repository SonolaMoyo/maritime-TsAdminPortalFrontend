import type { QuoteRequest, RequestStatus } from '../data/mockRequests';
import { apiFetch } from './apiClient';

class RequestsService {
  async getRequests(segment?: string, status?: string): Promise<QuoteRequest[]> {
    const params = new URLSearchParams();
    if (segment && segment !== 'All') params.append('segment', segment);
    if (status && status !== 'All') params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await apiFetch<QuoteRequest[]>(`/requests${query}`);
    return response.data || [];
  }

  async getRequestById(id: string): Promise<QuoteRequest | undefined> {
    const response = await apiFetch<QuoteRequest>(`/requests/${id}`);
    return response.data;
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<QuoteRequest> {
    const response = await apiFetch<QuoteRequest>(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  async assignRequest(id: string, owner: string): Promise<QuoteRequest> {
    const response = await apiFetch<QuoteRequest>(`/requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ owner }),
    });
    return response.data;
  }

  async createRequest(data: Partial<QuoteRequest>): Promise<QuoteRequest> {
    const response = await apiFetch<QuoteRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async addActivity(requestId: string, type: string, description: string, actor?: string): Promise<QuoteRequest> {
    await apiFetch(`/requests/${requestId}/activities`, {
      method: 'POST',
      body: JSON.stringify({ type, description, actor }),
    });
    const req = await this.getRequestById(requestId);
    return req!;
  }

  async addNote(requestId: string, authorOrText: string, text?: string): Promise<QuoteRequest> {
    const author = text !== undefined ? authorOrText : "Operations User";
    const noteText = text !== undefined ? text : authorOrText;
    await apiFetch(`/requests/${requestId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text: noteText, author }),
    });
    const req = await this.getRequestById(requestId);
    return req!;
  }
}

export const requestsService = new RequestsService();
