export type RequestStatus = 'New' | 'Assigned' | 'Contacted' | 'Quote Sent' | 'Negotiation' | 'Won' | 'Lost';
export type SegmentType = 'Solar Tech' | 'Luxe' | 'EV' | 'Electronics';

export interface Activity {
  id: string;
  date: string;
  type: string;
  description: string;
}

export interface InternalNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface QuoteRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  product: string;
  category: string;
  segment: SegmentType;
  quantity: number;
  deliveryLocation: string;
  additionalInfo: string;
  status: RequestStatus;
  owner: string | null;
  createdAt: string;
  lastActivity: string;
  expectedValue?: string;
  activities: Activity[];
  notes: InternalNote[];
}

export const mockRequests: QuoteRequest[] = [
  {
    id: 'req-1',
    requestNumber: 'REQ-002481',
    customerName: 'John Adewale',
    companyName: 'Adewale Energy Ltd',
    email: 'john@adewaleenergy.com',
    phone: '+234 800 123 4567',
    product: 'SolarMax 10kW Inverter',
    category: 'Inverters',
    segment: 'Solar Tech',
    quantity: 25,
    deliveryLocation: 'Lagos, Nigeria',
    additionalInfo: 'We require the products for a commercial installation scheduled for next month.',
    status: 'Contacted',
    owner: 'Moyo Sonola',
    createdAt: '2026-09-24T10:32:00Z',
    lastActivity: '2026-09-24T13:14:00Z',
    expectedValue: '₦4,500,000',
    activities: [
      { id: 'act-1', date: '2026-09-24T13:14:00Z', type: 'Contact', description: 'Moyo contacted customer. Customer requested formal quotation.' },
      { id: 'act-2', date: '2026-09-24T12:42:00Z', type: 'Assignment', description: 'Request assigned to Moyo Sonola' },
      { id: 'act-3', date: '2026-09-24T10:32:00Z', type: 'System', description: 'Request received from website. System Lead created automatically' }
    ],
    notes: [
      { id: 'not-1', author: 'Moyo Sonola', date: '2026-09-24T14:00:00Z', text: 'Customer is interested in bulk purchase.' }
    ]
  },
  {
    id: 'req-2',
    requestNumber: 'REQ-002482',
    customerName: 'Sarah Jenkins',
    companyName: 'Jenkins & Co',
    email: 'sarah@jenkins.com',
    phone: '+44 7700 900077',
    product: 'EV Fast Charger Pro',
    category: 'Charging Stations',
    segment: 'EV',
    quantity: 5,
    deliveryLocation: 'London, UK',
    additionalInfo: 'Looking for fast delivery.',
    status: 'New',
    owner: null,
    createdAt: '2026-09-24T11:00:00Z',
    lastActivity: '2026-09-24T11:00:00Z',
    activities: [
      { id: 'act-4', date: '2026-09-24T11:00:00Z', type: 'System', description: 'Request received from website.' }
    ],
    notes: []
  },
  {
    id: 'req-3',
    requestNumber: 'REQ-002483',
    customerName: 'Ahmed Hassan',
    companyName: 'Luxe Interiors',
    email: 'ahmed@luxeinteriors.ae',
    phone: '+971 50 123 4567',
    product: 'Premium Smart Refrigerator',
    category: 'Home Appliances',
    segment: 'Luxe',
    quantity: 2,
    deliveryLocation: 'Dubai, UAE',
    additionalInfo: 'Require installation services as well.',
    status: 'Quote Sent',
    owner: 'David Smith',
    createdAt: '2026-09-20T09:15:00Z',
    lastActivity: '2026-09-22T14:30:00Z',
    expectedValue: 'AED 35,000',
    activities: [
      { id: 'act-5', date: '2026-09-22T14:30:00Z', type: 'Quote', description: 'Quotation QT-0922 sent to customer.' },
      { id: 'act-6', date: '2026-09-21T10:00:00Z', type: 'Contact', description: 'David Smith called customer.' },
      { id: 'act-7', date: '2026-09-20T11:00:00Z', type: 'Assignment', description: 'Request assigned to David Smith' },
      { id: 'act-8', date: '2026-09-20T09:15:00Z', type: 'System', description: 'Request received from website.' }
    ],
    notes: []
  },
  {
    id: 'req-4',
    requestNumber: 'REQ-002484',
    customerName: 'Chioma Okafor',
    companyName: 'Tech Hub',
    email: 'chioma@techhub.ng',
    phone: '+234 812 345 6789',
    product: 'Enterprise Router X1',
    category: 'Networking',
    segment: 'Electronics',
    quantity: 10,
    deliveryLocation: 'Abuja, Nigeria',
    additionalInfo: '',
    status: 'Won',
    owner: 'John Doe',
    createdAt: '2026-09-15T08:00:00Z',
    lastActivity: '2026-09-23T16:00:00Z',
    expectedValue: '₦1,200,000',
    activities: [
      { id: 'act-9', date: '2026-09-23T16:00:00Z', type: 'Status', description: 'Marked as Won. Converted to Order ORD-1052.' }
    ],
    notes: []
  }
];
