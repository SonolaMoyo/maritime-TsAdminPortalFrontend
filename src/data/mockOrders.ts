export type OrderStatus = 
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
  status: 'Paid';
  amountDue: number;
  amountPaid: number;
  method?: string;
  reference?: string;
  date?: string;
}

export interface DeliveryInfo {
  status: 'Processing' | 'Ready for Dispatch' | 'Dispatched' | 'In Transit' | 'Delivered';
  location: string;
  address: string;
  carrier?: string;
  trackingRef?: string;
  dispatchDate?: string;
  expectedDelivery?: string;
  receivedBy?: string;
  deliveryDate?: string;
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
      { id: "act-1", date: new Date(Date.now() - 172800000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified (₦4,550,000) — moved to Processing" },
      { id: "act-2", date: new Date(Date.now() - 86400000).toISOString(), actor: "Warehouse", type: "Allocation", description: "Stock partially allocated (22/25 units allocated)" }
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
    status: "Processing",
    items: [
      { id: "oi-4", productId: "prod-4", productName: "Premium Chandelier X1", quantity: 2, unitPrice: 1200000, totalPrice: 2400000, allocatedQuantity: 0 },
      { id: "oi-5", productId: "prod-5", productName: "Lounge Seating Set", quantity: 4, unitPrice: 850000, totalPrice: 3400000, allocatedQuantity: 0 },
    ],
    subtotal: 5800000,
    discount: 0,
    deliveryFee: 150000,
    totalAmount: 5950000,
    payment: {
      status: "Paid",
      amountDue: 5950000,
      amountPaid: 5950000,
      method: "Bank Transfer",
      reference: "PAY-002194",
      date: new Date(Date.now() - 10000000).toISOString()
    },
    delivery: {
      status: "Processing",
      location: "Abuja, Nigeria",
      address: "Plot 12A, Central Business District, Abuja",
    },
    activities: [
      { id: "act-5", date: new Date(Date.now() - 10000000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified (₦5,950,000) — moved directly to Processing" }
    ],
    notes: [],
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    updatedAt: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: "ord-4",
    orderNumber: "ORD-001510",
    customerName: "Emeka Okonkwo",
    companyName: "Soltech Solutions",
    email: "emeka@soltech.ng",
    phone: "+234 803 987 6543",
    segment: "Solar Tech",
    status: "Ready for Dispatch",
    items: [
      { id: "oi-7", productId: "prod-1", productName: "Solar Inverter 10kW", quantity: 4, unitPrice: 350000, totalPrice: 1400000, allocatedQuantity: 4 },
      { id: "oi-8", productId: "prod-2", productName: "Lithium Battery 5kWh", quantity: 8, unitPrice: 150000, totalPrice: 1200000, allocatedQuantity: 8 },
    ],
    subtotal: 2600000,
    discount: 0,
    deliveryFee: 100000,
    totalAmount: 2700000,
    payment: {
      status: "Paid",
      amountDue: 2700000,
      amountPaid: 2700000,
      method: "Bank Transfer",
      reference: "PAY-003310",
      date: new Date(Date.now() - 120000000).toISOString()
    },
    delivery: {
      status: "Ready for Dispatch",
      location: "Enugu, Nigeria",
      address: "18 Independence Layout, Enugu",
    },
    activities: [
      { id: "act-11", date: new Date(Date.now() - 120000000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified (₦2,700,000)" },
      { id: "act-12", date: new Date(Date.now() - 70000000).toISOString(), actor: "Warehouse", type: "Allocation", description: "All items fully allocated (12/12 units)" },
      { id: "act-13", date: new Date(Date.now() - 50000000).toISOString(), actor: "Operations", type: "Status Change", description: "Packaging completed. Marked Ready for Dispatch" }
    ],
    notes: [
      { id: "not-3", date: new Date(Date.now() - 60000000).toISOString(), author: "Warehouse Team", text: "Staged in Bay 4 for logistics pickup." }
    ],
    createdAt: new Date(Date.now() - 120000000).toISOString(),
    updatedAt: new Date(Date.now() - 50000000).toISOString()
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
      { id: "act-6", date: new Date(Date.now() - 500000000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified (₦1,300,000)" },
      { id: "act-9", date: new Date(Date.now() - 300000000).toISOString(), actor: "Warehouse", type: "Allocation", description: "Stock fully allocated (3/3 units)" },
      { id: "act-10", date: new Date(Date.now() - 86400000).toISOString(), actor: "Logistics", type: "Dispatch", description: "Order dispatched to Port Harcourt via Company Delivery" }
    ],
    notes: [
      { id: "not-2", date: new Date(Date.now() - 300000000).toISOString(), author: "Warehouse", text: "Packed in 3 separate crates." }
    ],
    createdAt: new Date(Date.now() - 500000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "ord-5",
    orderNumber: "ORD-001350",
    customerName: "Bisi Adebayo",
    companyName: "Apex Media Systems",
    email: "bisi@apexmedia.ng",
    phone: "+234 802 111 2233",
    segment: "Electronics",
    status: "Delivered",
    items: [
      { id: "oi-9", productId: "prod-7", productName: "Studio Audio Mixer 16-Ch", quantity: 2, unitPrice: 380000, totalPrice: 760000, allocatedQuantity: 2 },
    ],
    subtotal: 760000,
    discount: 0,
    deliveryFee: 60000,
    totalAmount: 820000,
    payment: {
      status: "Paid",
      amountDue: 820000,
      amountPaid: 820000,
      method: "Credit Card",
      reference: "CC-771822",
      date: new Date(Date.now() - 600000000).toISOString()
    },
    delivery: {
      status: "Delivered",
      location: "Ibadan, Nigeria",
      address: "7 Ring Road, Ibadan",
      carrier: "DHL Express",
      trackingRef: "DHL-NG-88912",
      dispatchDate: new Date(Date.now() - 300000000).toISOString(),
      expectedDelivery: new Date(Date.now() - 86400000).toISOString(),
      receivedBy: "Bisi Adebayo",
      deliveryDate: new Date(Date.now() - 86400000).toISOString()
    },
    activities: [
      { id: "act-14", date: new Date(Date.now() - 600000000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified" },
      { id: "act-15", date: new Date(Date.now() - 300000000).toISOString(), actor: "Logistics", type: "Dispatch", description: "Dispatched via DHL Express" },
      { id: "act-16", date: new Date(Date.now() - 86400000).toISOString(), actor: "Logistics", type: "Delivered", description: "Delivered and signed by Bisi Adebayo" }
    ],
    notes: [],
    createdAt: new Date(Date.now() - 600000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "ord-6",
    orderNumber: "ORD-001290",
    customerName: "Khadija Bello",
    companyName: "Kano Green Transport",
    email: "khadija@kanogreen.com",
    phone: "+234 809 555 4433",
    segment: "EV",
    status: "Completed",
    items: [
      { id: "oi-10", productId: "prod-6", productName: "EV Charging Station - Level 2", quantity: 6, unitPrice: 450000, totalPrice: 2700000, allocatedQuantity: 6 },
    ],
    subtotal: 2700000,
    discount: 50000,
    deliveryFee: 150000,
    totalAmount: 2800000,
    payment: {
      status: "Paid",
      amountDue: 2800000,
      amountPaid: 2800000,
      method: "Corporate Transfer",
      reference: "PAY-001102",
      date: new Date(Date.now() - 900000000).toISOString()
    },
    delivery: {
      status: "Delivered",
      location: "Kano, Nigeria",
      address: "24 Bompai Industrial Area, Kano",
      carrier: "Company Delivery",
      trackingRef: "MAR-TRK-00140",
      dispatchDate: new Date(Date.now() - 700000000).toISOString(),
      expectedDelivery: new Date(Date.now() - 500000000).toISOString(),
      receivedBy: "Store Manager",
      deliveryDate: new Date(Date.now() - 500000000).toISOString()
    },
    activities: [
      { id: "act-17", date: new Date(Date.now() - 900000000).toISOString(), actor: "System", type: "Order Created", description: "Order confirmed & payment verified" },
      { id: "act-18", date: new Date(Date.now() - 500000000).toISOString(), actor: "Logistics", type: "Delivered", description: "Delivered to Bompai Warehouse" },
      { id: "act-19", date: new Date(Date.now() - 400000000).toISOString(), actor: "Operations User", type: "Completion", description: "Customer acknowledged installation. Order marked Completed." }
    ],
    notes: [],
    createdAt: new Date(Date.now() - 900000000).toISOString(),
    updatedAt: new Date(Date.now() - 400000000).toISOString()
  }
];
