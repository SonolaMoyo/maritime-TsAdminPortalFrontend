export type OrderStatus = 
  | 'Pending Approval' 
  | 'Awaiting Payment' 
  | 'Paid' 
  | 'Processing' 
  | 'Ready for Dispatch' 
  | 'In Transit' 
  | 'Delivered' 
  | 'Completed'
  | 'Cancelled';

export type SegmentType = 'Solar Tech' | 'Luxe' | 'EV' | 'Electronics';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  allocatedQuantity: number;
}

export interface PaymentInfo {
  status: 'Unpaid' | 'Paid' | 'Partially Paid';
  amountDue: number;
  amountPaid: number;
  method?: string;
  reference?: string;
  date?: string;
}

export interface DeliveryInfo {
  status: 'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  location: string;
  address: string;
  carrier?: string;
  trackingRef?: string;
  dispatchDate?: string;
  expectedDelivery?: string;
}

export interface OrderActivity {
  id: string;
  date: string;
  actor: string;
  type: string;
  description: string;
}

export interface OrderNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  segment: SegmentType;
  status: OrderStatus;
  
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;

  payment: PaymentInfo;
  delivery: DeliveryInfo;
  
  activities: OrderActivity[];
  notes: OrderNote[];

  relatedRequestId?: string;
  relatedQuotationId?: string;

  createdAt: string;
  updatedAt: string;
}

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-001482",
    customerName: "John Adewale",
    companyName: "Adewale Energy Ltd",
    email: "john@email.com",
    phone: "+234 800 123 4567",
    segment: "Solar Tech",
    status: "Processing",
    items: [
      { id: "oi-1", productId: "prod-1", productName: "Solar Inverter 10kW", quantity: 10, unitPrice: 350000, totalPrice: 3500000, allocatedQuantity: 10 },
      { id: "oi-2", productId: "prod-2", productName: "Lithium Battery 5kWh", quantity: 5, unitPrice: 150000, totalPrice: 750000, allocatedQuantity: 5 },
      { id: "oi-3", productId: "prod-3", productName: "Solar Panel 400W", quantity: 10, unitPrice: 25000, totalPrice: 250000, allocatedQuantity: 7 },
    ],
    subtotal: 4500000,
    discount: 50000,
    deliveryFee: 100000,
    totalAmount: 4550000,
    payment: {
      status: "Paid",
      amountDue: 4550000,
      amountPaid: 4550000,
      method: "Bank Transfer",
      reference: "PAY-001824",
      date: new Date(Date.now() - 86400000).toISOString()
    },
    delivery: {
      status: "Processing",
      location: "Lagos, Nigeria",
      address: "14 Industrial Avenue, Ikeja, Lagos",
    },
    activities: [
      { id: "act-1", date: new Date(Date.now() - 172800000).toISOString(), actor: "System", type: "Order Created", description: "Order created from Request REQ-002481" },
      { id: "act-2", date: new Date(Date.now() - 150000000).toISOString(), actor: "John Doe", type: "Approval", description: "Order approved" },
      { id: "act-3", date: new Date(Date.now() - 86400000).toISOString(), actor: "Finance", type: "Payment", description: "Payment confirmed (₦4,550,000)" },
      { id: "act-4", date: new Date(Date.now() - 40000000).toISOString(), actor: "Moyo Sonola", type: "Status Change", description: "Order marked as Processing" }
    ],
    notes: [
      { id: "not-1", date: new Date(Date.now() - 86400000).toISOString(), author: "Moyo Sonola", text: "Customer requested delivery before Friday." }
    ],
    relatedRequestId: "REQ-002481",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 40000000).toISOString()
  },
  {
    id: "ord-2",
    orderNumber: "ORD-001503",
    customerName: "Sarah Smith",
    companyName: "Luxe Hotels Group",
    email: "sarah.smith@luxe.com",
    phone: "+44 20 7123 4567",
    segment: "Luxe",
    status: "Pending Approval",
    items: [
      { id: "oi-4", productId: "prod-4", productName: "Premium Chandelier X1", quantity: 2, unitPrice: 1200000, totalPrice: 2400000, allocatedQuantity: 0 },
      { id: "oi-5", productId: "prod-5", productName: "Lounge Seating Set", quantity: 4, unitPrice: 850000, totalPrice: 3400000, allocatedQuantity: 0 },
    ],
    subtotal: 5800000,
    discount: 0,
    deliveryFee: 150000,
    totalAmount: 5950000,
    payment: {
      status: "Unpaid",
      amountDue: 5950000,
      amountPaid: 0,
    },
    delivery: {
      status: "Pending",
      location: "Abuja, Nigeria",
      address: "Plot 12A, Central Business District, Abuja",
    },
    activities: [
      { id: "act-5", date: new Date(Date.now() - 10000000).toISOString(), actor: "System", type: "Order Created", description: "Order created manually by Sales" }
    ],
    notes: [],
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    updatedAt: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: "ord-3",
    orderNumber: "ORD-001399",
    customerName: "David Williams",
    companyName: "Volt Mobility",
    email: "david@voltmobility.com",
    phone: "+234 812 345 6789",
    segment: "EV",
    status: "In Transit",
    items: [
      { id: "oi-6", productId: "prod-6", productName: "EV Charging Station - Level 2", quantity: 3, unitPrice: 450000, totalPrice: 1350000, allocatedQuantity: 3 },
    ],
    subtotal: 1350000,
    discount: 50000,
    deliveryFee: 0,
    totalAmount: 1300000,
    payment: {
      status: "Paid",
      amountDue: 1300000,
      amountPaid: 1300000,
      method: "Credit Card",
      reference: "CC-998273",
      date: new Date(Date.now() - 400000000).toISOString()
    },
    delivery: {
      status: "In Transit",
      location: "Port Harcourt, Nigeria",
      address: "45 Trans-Amadi Industrial Layout",
      carrier: "Company Delivery",
      trackingRef: "MAR-TRK-00182",
      dispatchDate: new Date(Date.now() - 86400000).toISOString(),
      expectedDelivery: new Date(Date.now() + 86400000).toISOString()
    },
    activities: [
      { id: "act-6", date: new Date(Date.now() - 500000000).toISOString(), actor: "System", type: "Order Created", description: "Order created" },
      { id: "act-7", date: new Date(Date.now() - 450000000).toISOString(), actor: "Manager", type: "Approval", description: "Order approved" },
      { id: "act-8", date: new Date(Date.now() - 400000000).toISOString(), actor: "Finance", type: "Payment", description: "Payment confirmed via Credit Card" },
      { id: "act-9", date: new Date(Date.now() - 300000000).toISOString(), actor: "Warehouse", type: "Allocation", description: "Stock fully allocated" },
      { id: "act-10", date: new Date(Date.now() - 86400000).toISOString(), actor: "Logistics", type: "Dispatch", description: "Order dispatched to Port Harcourt" }
    ],
    notes: [
      { id: "not-2", date: new Date(Date.now() - 300000000).toISOString(), author: "Warehouse", text: "Packed in 3 separate crates." }
    ],
    createdAt: new Date(Date.now() - 500000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];
