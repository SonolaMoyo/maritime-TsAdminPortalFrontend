export const demo = {
  products: [
    { id: "p1", name: "YJC All-in-One Inverter & Battery 3.6kW / 6.4kWh", brand: "YJC", category_name: "All-in-One ESS", price: 1850, stock_quantity: 18, reserved_quantity: 4, warehouse_location: "Lagos Warehouse", stock_status: "in stock" },
    { id: "p2", name: "YJC 5.12kWh Wall-Mounted Battery", brand: "YJC", category_name: "Batteries", price: 920, stock_quantity: 9, reserved_quantity: 2, warehouse_location: "Abuja Branch", stock_status: "low stock" },
    { id: "p3", name: "ELECENERGY 12.8kWh Low-Voltage ESS", brand: "ELECENERGY", category_name: "Batteries", price: 2100, stock_quantity: 22, reserved_quantity: 5, warehouse_location: "Lagos Warehouse", stock_status: "in stock" },
    { id: "p4", name: "Solar Street Light 100W", brand: "YJC", category_name: "Lighting", price: 210, stock_quantity: 4, reserved_quantity: 1, warehouse_location: "Port Harcourt", stock_status: "low stock" }
  ],
  orders: [
    { id: "o1", order_number: "MT-1001", customer_name: "Fola Homes Estate", email: "ops@folahomes.com", product_summary: "YJC All-in-One ESS x 5", status: "awaiting payment", payment_status: "unpaid", delivery_status: "not scheduled", total_amount: 9250, created_at: new Date().toISOString() },
    { id: "o2", order_number: "MT-1002", customer_name: "Green Spark Installers", email: "sales@greenspark.ng", product_summary: "YJC 5.12kWh Battery x 10", status: "processing", payment_status: "paid", delivery_status: "scheduled", total_amount: 9200, created_at: new Date().toISOString() },
    { id: "o3", order_number: "MT-1003", customer_name: "Retail Customer", email: "customer@example.com", product_summary: "Solar Street Light x 20", status: "delivered", payment_status: "paid", delivery_status: "delivered", total_amount: 4200, created_at: new Date(Date.now() - 86400000).toISOString() }
  ],
  payments: [
    { id: "pay1", payment_ref: "PAY-001", customer_name: "Green Spark Installers", method: "Bank Transfer", status: "paid", amount: 9200, created_at: new Date().toISOString() },
    { id: "pay2", payment_ref: "PAY-002", customer_name: "Fola Homes Estate", method: "Proforma Invoice", status: "awaiting payment", amount: 9250, created_at: new Date().toISOString() }
  ],
  clients: [
    { id: "c1", name: "Fola Homes Estate", client_type: "Corporate", phone: "+234 000 000 0000", email: "ops@folahomes.com", location: "Lagos", total_purchase_value: 9250, referral_source: "Website", assigned_sales_rep: "Demo Admin" },
    { id: "c2", name: "Green Spark Installers", client_type: "Installer", phone: "+234 000 000 0000", email: "sales@greenspark.ng", location: "Abuja", total_purchase_value: 9200, referral_source: "Installer Network", assigned_sales_rep: "Sales Team" },
    { id: "c3", name: "Retail Customer", client_type: "Residential", phone: "+234 000 000 0000", email: "customer@example.com", location: "Port Harcourt", total_purchase_value: 4200, referral_source: "Instagram", assigned_sales_rep: "Online Sales" }
  ],
  referrals: [
    { id: "r1", name: "Installer Network", referral_type: "Installer", leads_count: 34, converted_sales_count: 12, total_revenue: 21500, commission_rate: 5 },
    { id: "r2", name: "Instagram Campaign", referral_type: "Influencer", leads_count: 49, converted_sales_count: 9, total_revenue: 12800, commission_rate: 3 },
    { id: "r3", name: "Dealer Partner", referral_type: "Dealer", leads_count: 18, converted_sales_count: 7, total_revenue: 17500, commission_rate: 4 }
  ],
  deliveries: [
    { id: "d1", order_number: "MT-1002", customer_name: "Green Spark Installers", delivery_address: "Wuse 2, Abuja", delivery_date: "2026-08-02", logistics_partner: "Internal Logistics", status: "scheduled", proof_of_delivery: "Pending" },
    { id: "d2", order_number: "MT-1003", customer_name: "Retail Customer", delivery_address: "GRA, Port Harcourt", delivery_date: "2026-07-28", logistics_partner: "Courier Partner", status: "delivered", proof_of_delivery: "Confirmed" }
  ],
  distribution: [
    { id: "dist1", destination: "Abuja Branch", product_summary: "YJC Batteries", quantity: 15, branch: "Lagos Warehouse", status: "in transit", assigned_staff: "Logistics Team" },
    { id: "dist2", destination: "Port Harcourt", product_summary: "Solar Street Lights", quantity: 40, branch: "Lagos Warehouse", status: "pending dispatch", assigned_staff: "Warehouse Team" }
  ],
  schedules: [
    { id: "s1", scheduled_date: "2026-08-02", title: "Delivery to Green Spark Installers", client_name: "Green Spark Installers", assigned_to: "Logistics Team", location: "Abuja", status: "scheduled" },
    { id: "s2", scheduled_date: "2026-08-04", title: "Corporate sales follow-up", client_name: "Fola Homes Estate", assigned_to: "Sales Team", location: "Lagos", status: "pending" }
  ],
  sales_pipeline: [
    { stage: "Lead", count: 42, value: 32000 },
    { stage: "Contacted", count: 29, value: 24500 },
    { stage: "Quote Sent", count: 18, value: 19800 },
    { stage: "Awaiting Payment", count: 9, value: 9250 },
    { stage: "Won", count: 12, value: 26800 }
  ]
};
