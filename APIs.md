# Backend API Specification (`APIs.md`)
**Maritama Trading Operations Portal (TsAdminPortal)**

This document details all backend REST API endpoints required by the `maritime-TsAdminPortalFrontend` application.

> **CRITICAL INSTRUCTION FOR AGENTS & DEVELOPERS:**  
> Whenever subsequent frontend implementations introduce, modify, or deprecate any API interactions, query parameters (e.g. pagination, filters, sorting), request payloads, or response schemas, you **MUST** update this file to keep the backend implementation specifications strictly aligned.

---

## 1. Global API Conventions

* **Base URL**: `/api/v1`
* **Content Type**: `application/json` (except file uploads which use `multipart/form-data`)
* **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <jwt_token>`)
* **Standard Pagination Query Parameters**:
  * `page` (integer, default: `1`): Current page number.
  * `limit` (integer, default: `20`, max: `100`): Number of items per page.
* **Standard Sorting Parameters**:
  * `sortBy` (string): Field name to sort by (e.g., `createdAt`, `totalAmount`).
  * `sortOrder` (string, `asc` | `desc`, default: `desc`).
* **Standard Multi-Segment Filtering**:
  * `segment` (string, optional): `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`.
* **Standard Success Response Format**:
```json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  },
  "message": "Resource retrieved successfully"
}
```
* **Standard Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested entity could not be found.",
    "details": []
  }
}
```

---

## 2. Authentication & Session (`/api/v1/auth`)

### 2.1 User Login
* **Endpoint**: `POST /api/v1/auth/login`
* **Description**: Authenticates portal operator/admin using email and password.
* **Request Body**:
```json
{
  "email": "ops@maritamatrading.com",
  "password": "Password123!"
}
```
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USR-001",
      "name": "Moyo Sonola",
      "email": "moyo@maritama.com",
      "role": "Administrator",
      "permissions": ["requests.view", "orders.approve", "inventory.receive"]
    },
    "token": "jwt_access_token_here",
    "refreshToken": "jwt_refresh_token_here",
    "expiresIn": 86400
  }
}
```

### 2.2 Get Current User Profile
* **Endpoint**: `GET /api/v1/auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "USR-001",
    "name": "Moyo Sonola",
    "email": "moyo@maritama.com",
    "role": "Administrator",
    "status": "Active"
  }
}
```

### 2.3 Refresh Token
* **Endpoint**: `POST /api/v1/auth/refresh-token`
* **Request Body**:
```json
{
  "refreshToken": "jwt_refresh_token_here"
}
```

### 2.4 Logout
* **Endpoint**: `POST /api/v1/auth/logout`
* **Response `200 OK`**: `{ "success": true, "message": "Logged out successfully" }`

### 2.5 Forgot Password
* **Endpoint**: `POST /api/v1/auth/forgot-password`
* **Request Body**: `{ "email": "user@maritama.com" }`

---

## 3. Analytics & Dashboard (`/api/v1/analytics`)

### 3.1 Operations Dashboard Data & Movement Graphs
* **Endpoint**: `GET /api/v1/analytics/dashboard`
* **Frontend Consumer**: [DashboardV2.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/DashboardV2.tsx)
* **Query Parameters**:
  * `segment` (optional): `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`
  * `year` (string, required): e.g. `'2026'`, `'2025'`, `'2024'`
  * `month` (string, required): `'all'` or `'1'` through `'12'`
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "kpis": {
      "orders": {
        "total": 47,
        "revenue": 13395000,
        "inFulfillment": 20,
        "fulfilled": 27
      },
      "requests": {
        "total": 60,
        "won": 29,
        "active": 31,
        "pipelineValue": 24600000
      },
      "inventory": {
        "totalStock": 340,
        "healthPct": 94,
        "warehouses": 4,
        "incoming": 3
      },
      "catalog": {
        "published": 24,
        "categories": 8,
        "featured": 6
      }
    },
    "movementGraphs": {
      "orders": [
        { "label": "W1", "value": 6 },
        { "label": "W2", "value": 9 },
        { "label": "W3", "value": 14 },
        { "label": "W4", "value": 18 }
      ],
      "requests": [
        { "label": "W1", "value": 8 },
        { "label": "W2", "value": 12 },
        { "label": "W3", "value": 17 },
        { "label": "W4", "value": 23 }
      ],
      "inventory": [
        { "label": "W1", "value": 210 },
        { "label": "W2", "value": 245 },
        { "label": "W3", "value": 290 },
        { "label": "W4", "value": 340 }
      ],
      "catalog": [
        { "label": "W1", "value": 16 },
        { "label": "W2", "value": 18 },
        { "label": "W3", "value": 21 },
        { "label": "W4", "value": 24 }
      ]
    },
    "recentActivity": [
      {
        "id": "act-1",
        "timestamp": "2026-10-18T14:30:00Z",
        "actor": "Moyo Sonola",
        "action": "Order Dispatched",
        "reference": "ORD-003412"
      }
    ]
  }
}
```

---

## 4. Quote Requests & Leads (`/api/v1/requests`)

### 4.1 List Requests (Paginated & Filterable)
* **Endpoint**: `GET /api/v1/requests`
* **Frontend Consumer**: [Requests.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/Requests.tsx)
* **Query Parameters**:
  * `page` (number, default: 1)
  * `limit` (number, default: 20)
  * `segment` (optional): `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`
  * `status` (optional): `'New'` | `'Assigned'` | `'Contacted'` | `'Quote Sent'` | `'Negotiation'` | `'Won'` | `'Lost'`
  * `tab` (optional filter alias): `'All'` | `'Pending'` (New, Assigned) | `'In Progress'` (Contacted, Quote Sent, Negotiation) | `'Completed'` (Won, Lost)
  * `search` (optional string): Queries customer name, company name, request number, or product.
  * `sortBy` (optional): `createdAt` | `lastActivity` | `requestNumber` | `quantity`
  * `sortOrder` (optional): `asc` | `desc`
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "req-1",
      "requestNumber": "REQ-002481",
      "customerName": "John Adewale",
      "companyName": "Adewale Energy Ltd",
      "email": "john@adewaleenergy.com",
      "phone": "+234 800 123 4567",
      "product": "SolarMax 10kW Inverter",
      "category": "Inverters",
      "segment": "Solar Tech",
      "quantity": 25,
      "deliveryLocation": "Lagos, Nigeria",
      "additionalInfo": "We require the products for commercial installation.",
      "status": "Contacted",
      "owner": "Moyo Sonola",
      "createdAt": "2026-09-24T10:32:00Z",
      "lastActivity": "2026-09-24T13:14:00Z",
      "expectedValue": "₦4,500,000"
    }
  ],
  "stats": {
    "total": 45,
    "pending": 12,
    "inProgress": 21,
    "completed": 12
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 4.2 Create New Quote Request
* **Endpoint**: `POST /api/v1/requests`
* **Request Body**:
```json
{
  "customerName": "John Adewale",
  "companyName": "Adewale Energy Ltd",
  "email": "john@adewaleenergy.com",
  "phone": "+234 800 123 4567",
  "product": "SolarMax 10kW Inverter",
  "category": "Inverters",
  "segment": "Solar Tech",
  "quantity": 25,
  "deliveryLocation": "Lagos, Nigeria",
  "additionalInfo": "Commercial setup",
  "expectedValue": "₦4,500,000"
}
```

### 4.3 Get Request Details by ID
* **Endpoint**: `GET /api/v1/requests/:id`
* **Frontend Consumer**: [RequestDetail.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/RequestDetail.tsx)
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "req-1",
    "requestNumber": "REQ-002481",
    "customerName": "John Adewale",
    "companyName": "Adewale Energy Ltd",
    "email": "john@adewaleenergy.com",
    "phone": "+234 800 123 4567",
    "product": "SolarMax 10kW Inverter",
    "category": "Inverters",
    "segment": "Solar Tech",
    "quantity": 25,
    "deliveryLocation": "Lagos, Nigeria",
    "additionalInfo": "Commercial setup",
    "status": "Contacted",
    "owner": "Moyo Sonola",
    "expectedValue": "₦4,500,000",
    "createdAt": "2026-09-24T10:32:00Z",
    "lastActivity": "2026-09-24T13:14:00Z",
    "activities": [
      {
        "id": "act-1",
        "date": "2026-09-24T13:14:00Z",
        "type": "Contact",
        "description": "Moyo contacted customer. Customer requested formal quotation."
      }
    ],
    "notes": [
      {
        "id": "not-1",
        "author": "Moyo Sonola",
        "date": "2026-09-24T13:15:00Z",
        "text": "Client requested discounted volume pricing."
      }
    ]
  }
}
```

### 4.4 Update Request Status
* **Endpoint**: `PATCH /api/v1/requests/:id/status`
* **Request Body**:
```json
{
  "status": "Quote Sent"
}
```

### 4.5 Assign Request to Staff
* **Endpoint**: `PATCH /api/v1/requests/:id/assign`
* **Request Body**:
```json
{
  "owner": "Moyo Sonola"
}
```

### 4.6 Append Activity Log
* **Endpoint**: `POST /api/v1/requests/:id/activities`
* **Request Body**:
```json
{
  "type": "Quote Sent",
  "description": "Official quote #Q-2026-091 sent to client email."
}
```

### 4.7 Add Internal Note
* **Endpoint**: `POST /api/v1/requests/:id/notes`
* **Request Body**:
```json
{
  "text": "Waiting on updated payment confirmation."
}
```

---

## 5. Orders & Fulfillment (`/api/v1/orders`)

### 5.1 List Orders (Paginated & Filterable)
* **Endpoint**: `GET /api/v1/orders`
* **Frontend Consumer**: [OrdersV2.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/OrdersV2.tsx)
* **Query Parameters**:
  * `page` (number, default: 1)
  * `limit` (number, default: 20)
  * `segment` (optional): `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`
  * `status` (optional): `'All'` | `'Processing'` | `'Ready for Dispatch'` | `'In Transit'` | `'Delivered'` | `'Completed'` | `'Cancelled'`
  * `search` (optional string): Customer name, company, order number, or payment reference.
  * `dateFrom` / `dateTo` (ISO dates, optional)
  * `sortBy` (optional): `createdAt` | `totalAmount` | `orderNumber`
  * `sortOrder` (optional): `asc` | `desc`
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ord-1",
      "orderNumber": "ORD-003891",
      "customerName": "Tunde Bakare",
      "companyName": "Apex Logistics",
      "email": "tunde@apexlogistics.ng",
      "phone": "+234 802 334 5566",
      "segment": "Solar Tech",
      "status": "In Transit",
      "items": [
        {
          "id": "oi-1",
          "productId": "prod-1",
          "productName": "SolarMax 10kW Hybrid Inverter",
          "quantity": 4,
          "unitPrice": 850000,
          "totalPrice": 3400000,
          "allocatedQuantity": 4
        }
      ],
      "subtotal": 3400000,
      "discount": 0,
      "deliveryFee": 50000,
      "totalAmount": 3450000,
      "payment": {
        "status": "Paid",
        "amountDue": 3450000,
        "amountPaid": 3450000,
        "method": "Bank Transfer",
        "reference": "PAY-889123",
        "date": "2026-10-12T09:00:00Z"
      },
      "delivery": {
        "status": "In Transit",
        "location": "Ikeja, Lagos",
        "address": "Plot 14 Commercial Ave, Ikeja",
        "carrier": "Company Delivery Truck A",
        "trackingRef": "TRK-2026-9921",
        "dispatchDate": "2026-10-14T08:30:00Z",
        "expectedDelivery": "2026-10-15T16:00:00Z"
      },
      "createdAt": "2026-10-12T09:00:00Z",
      "updatedAt": "2026-10-14T08:30:00Z"
    }
  ],
  "stats": {
    "total": 48,
    "processing": 8,
    "readyForDispatch": 5,
    "inTransit": 9,
    "delivered": 12,
    "completed": 12,
    "cancelled": 2,
    "totalRevenue": 42500000,
    "activeFulfillmentValue": 18200000
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 48,
    "totalPages": 3
  }
}
```

### 5.2 Create New Confirmed Order
* **Endpoint**: `POST /api/v1/orders`
* **Request Body**:
```json
{
  "customerName": "Tunde Bakare",
  "companyName": "Apex Logistics",
  "email": "tunde@apexlogistics.ng",
  "phone": "+234 802 334 5566",
  "segment": "Solar Tech",
  "deliveryLocation": "Ikeja, Lagos",
  "deliveryAddress": "Plot 14 Commercial Ave, Ikeja",
  "items": [
    {
      "productId": "prod-1",
      "productName": "SolarMax 10kW Hybrid Inverter",
      "quantity": 2,
      "unitPrice": 850000,
      "totalPrice": 1700000
    }
  ],
  "totalAmount": 1700000,
  "paymentMethod": "Bank Transfer",
  "paymentRef": "PAY-993821"
}
```

### 5.3 Get Order Details
* **Endpoint**: `GET /api/v1/orders/:id`
* **Frontend Consumer**: [OrderDetail.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/OrderDetail.tsx)
* **Response `200 OK`**: Returns full Order schema including line-item inventory allocations, activities, and internal notes.

### 5.4 Allocate Warehouse Stock
* **Endpoint**: `POST /api/v1/orders/:id/allocate`
* **Description**: Allocates reserved stock from inventory to order line items.
* **Request Body**:
```json
{
  "allocations": {
    "oi-1": 4,
    "oi-2": 2
  }
}
```

### 5.5 Mark Order Ready for Dispatch
* **Endpoint**: `POST /api/v1/orders/:id/ready-for-dispatch`
* **Description**: Transitions status from `Processing` to `Ready for Dispatch` once packaging is completed.

### 5.6 Dispatch Order
* **Endpoint**: `POST /api/v1/orders/:id/dispatch`
* **Request Body**:
```json
{
  "carrier": "Red Star Express",
  "trackingRef": "RSX-8829103",
  "expectedDelivery": "2026-10-20T17:00:00Z"
}
```

### 5.7 Confirm Delivery
* **Endpoint**: `POST /api/v1/orders/:id/confirm-delivery`
* **Request Body**:
```json
{
  "receivedBy": "Michael Obi (Facility Manager)",
  "notes": "Delivered in good condition and tested."
}
```

### 5.8 Complete Order
* **Endpoint**: `POST /api/v1/orders/:id/complete`
* **Description**: Finalizes order upon customer verification and warranty initiation.

### 5.9 Cancel Order
* **Endpoint**: `POST /api/v1/orders/:id/cancel`
* **Request Body**:
```json
{
  "reason": "Customer cancelled before warehouse packaging."
}
```

### 5.10 Add Order Internal Note & Activity
* `POST /api/v1/orders/:id/notes`: `{ "text": "Customer confirmed site delivery window." }`
* `POST /api/v1/orders/:id/activities`: `{ "type": "Inspection", "description": "Serial numbers verified." }`

### 5.11 Get Printable Packing Slip
* **Endpoint**: `GET /api/v1/orders/:id/packing-slip`
* **Description**: Returns formatted HTML or PDF download URL for packing slips.

---

## 6. Multi-Warehouse Inventory (`/api/v1/inventory`)

### 6.1 List Product Inventory Records
* **Endpoint**: `GET /api/v1/inventory`
* **Frontend Consumer**: [InventoryV2.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/InventoryV2.tsx)
* **Query Parameters**:
  * `page`, `limit`
  * `segment`: `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`
  * `warehouseId` (string, optional)
  * `status` (optional): `'Healthy'` | `'Low Stock'` | `'Out of Stock'`
  * `search` (optional string): Matches product name or SKU.
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "inv-1",
      "productId": "prod-1",
      "productName": "SolarMax 10kW Hybrid Inverter",
      "segment": "Solar Tech",
      "warehouseId": "wh-1",
      "quantity": 18,
      "allocatedQuantity": 4,
      "availableQuantity": 14,
      "reorderThreshold": 10,
      "status": "Healthy",
      "createdAt": "2026-08-01T00:00:00Z",
      "updatedAt": "2026-10-14T08:30:00Z"
    }
  ],
  "stats": {
    "totalUnits": 520,
    "lowStockCount": 3,
    "outOfStockCount": 1,
    "healthyCount": 28
  },
  "pagination": { "page": 1, "limit": 20, "total": 32, "totalPages": 2 }
}
```

### 6.2 Receive Stock
* **Endpoint**: `POST /api/v1/inventory/:id/receive`
* **Request Body**:
```json
{
  "quantity": 25,
  "reference": "PO-2026-0045"
}
```

### 6.3 Adjust Stock Reorder Threshold
* **Endpoint**: `PATCH /api/v1/inventory/:id/threshold`
* **Request Body**:
```json
{
  "reorderThreshold": 15
}
```

### 6.4 Create Inter-Warehouse Stock Transfer
* **Endpoint**: `POST /api/v1/inventory/transfers`
* **Request Body**:
```json
{
  "fromWarehouseId": "wh-1",
  "toWarehouseId": "wh-2",
  "productId": "prod-1",
  "productName": "SolarMax 10kW Hybrid Inverter",
  "quantity": 5
}
```

### 6.5 List Stock Transfers
* **Endpoint**: `GET /api/v1/inventory/transfers`
* **Query Parameters**: `page`, `limit`, `status` (`'In Transit'` | `'Completed'` | `'Cancelled'`)

### 6.6 List Warehouses
* **Endpoint**: `GET /api/v1/inventory/warehouses`
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "wh-1",
      "name": "Lagos Central Hub",
      "location": "Lagos",
      "address": "Oregun Industrial Estate, Ikeja",
      "manager": "Adekunle George",
      "status": "Active"
    }
  ]
}
```

### 6.7 Create / Delete Warehouse
* `POST /api/v1/inventory/warehouses`: `{ "name": "Abuja Depot", "location": "Abuja", "address": "Idu Industrial Yard", "manager": "John Audu", "status": "Active" }`
* `DELETE /api/v1/inventory/warehouses/:id`

### 6.8 Suppliers Management
* `GET /api/v1/inventory/suppliers`
* `POST /api/v1/inventory/suppliers`: `{ "name": "Growatt Solar Co.", "contactPerson": "Zhang Wei", "email": "export@growatt.com", "phone": "+86 755 123456", "status": "Active" }`
* `DELETE /api/v1/inventory/suppliers/:id`

### 6.9 Inventory Receipts & Incoming Shipments
* `GET /api/v1/inventory/receipts`
* **Response**: List of incoming shipments, PO numbers, suppliers, estimated arrival dates, and arrival statuses.

### 6.10 Inventory Audit Trail
* `GET /api/v1/inventory/activities`
* **Query Parameters**: `limit`, `warehouseId`

---

## 7. Product Catalog & Media (`/api/v1/catalog`)

### 7.1 List Catalog Products
* **Endpoint**: `GET /api/v1/catalog/products`
* **Frontend Consumer**: [Catalog.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/Catalog.tsx)
* **Query Parameters**:
  * `page`, `limit`
  * `segment`: `'All'` | `'Solar Tech'` | `'Luxe'` | `'EV'` | `'Electronics'`
  * `categoryId` (string, optional)
  * `brandId` (string, optional)
  * `status` (optional): `'All'` | `'Draft'` | `'Published'`
  * `isFeatured` (boolean, optional)
  * `search` (string, optional)
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "SolarMax 10kW Hybrid Inverter",
      "slug": "solarmax-10kw-hybrid-inverter",
      "shortDescription": "High-efficiency commercial hybrid inverter.",
      "segment": "Solar Tech",
      "categoryId": "cat-1",
      "brandId": "br-1",
      "status": "Published",
      "isFeatured": true,
      "stock": 18,
      "createdAt": "2026-08-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 24, "totalPages": 2 }
}
```

### 7.2 Get Detailed Catalog Product
* **Endpoint**: `GET /api/v1/catalog/products/:id`
* **Frontend Consumer**: [CatalogProductDetail.tsx](file:///Users/moscotechh/Downloads/myProjectFolder/maritimetrading-ts/maritime-TsAdminPortalFrontend/src/pages/v2/CatalogProductDetail.tsx)
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "prod-1",
    "name": "SolarMax 10kW Hybrid Inverter",
    "slug": "solarmax-10kw-hybrid-inverter",
    "shortDescription": "High-efficiency hybrid inverter.",
    "description": "Comprehensive product narrative with technical overview...",
    "segment": "Solar Tech",
    "categoryId": "cat-1",
    "brandId": "br-1",
    "status": "Published",
    "isFeatured": true,
    "warrantyInformation": "5 Years Manufacturer Warranty",
    "installationInformation": "Certified installer installation recommended",
    "stock": 18,
    "images": [
      { "id": "img-1", "productId": "prod-1", "url": "https://...", "isPrimary": true }
    ],
    "specs": [
      { "id": "spec-1", "productId": "prod-1", "groupName": "Electrical", "name": "Max AC Output", "value": "10", "unit": "kW" }
    ],
    "docs": [
      { "id": "doc-1", "productId": "prod-1", "title": "Installation Manual", "fileUrl": "https://...", "fileType": "PDF" }
    ]
  }
}
```

### 7.3 Create Product
* **Endpoint**: `POST /api/v1/catalog/products`
* **Request Body**: Includes all metadata, category, brand, specs, images, and documentation.

### 7.4 Update Product
* **Endpoint**: `PUT /api/v1/catalog/products/:id`

### 7.5 Delete Product
* **Endpoint**: `DELETE /api/v1/catalog/products/:id`

### 7.6 Toggle Homepage Featured Status
* **Endpoint**: `PATCH /api/v1/catalog/products/:id/featured`
* **Request Body**:
```json
{
  "isFeatured": true,
  "displayOrder": 1
}
```

### 7.7 Product Categories
* `GET /api/v1/catalog/categories` (query: `segment`)
* `POST /api/v1/catalog/categories`: `{ "name": "Lithium Batteries", "segment": "Solar Tech", "status": "Active" }`
* `PUT /api/v1/catalog/categories/:id`
* `DELETE /api/v1/catalog/categories/:id`

### 7.8 Brands
* `GET /api/v1/catalog/brands` (query: `segment`)
* `POST /api/v1/catalog/brands`: `{ "name": "Growatt", "description": "Global inverter leader", "website": "https://growatt.com", "segments": ["Solar Tech"], "status": "Active" }`
* `PUT /api/v1/catalog/brands/:id`
* `DELETE /api/v1/catalog/brands/:id`

### 7.9 Media Library & File Uploads
* `GET /api/v1/catalog/media` (query: `page`, `limit`, `type`: `'image'` | `'pdf'` | `'all'`, `search`)
* `POST /api/v1/catalog/media/upload` (`multipart/form-data`, file input `file`, optional string `name`)
* `DELETE /api/v1/catalog/media/:id`

### 7.10 Segment Marketing Content
* `GET /api/v1/catalog/segments/:segment/content`
* `PUT /api/v1/catalog/segments/:segment/content`
* **Request Body**:
```json
{
  "title": "Maritama Solar Tech",
  "intro": "Empowering businesses with scalable, high-efficiency solar energy solutions.",
  "capabilities": "Our solar division specializes in grid-tied and hybrid solar installations.",
  "bannerImageUrl": "https://..."
}
```

---

## 8. Roles & Access Control (`/api/v1/roles` & `/api/v1/users`)

### 8.1 Users
* `GET /api/v1/users` (query: `search`, `role`, `status`, `page`, `limit`)
* `POST /api/v1/users`: `{ "name": "Sarah Ade", "email": "sarah@maritama.com", "role": "Sales", "status": "Active" }`
* `PATCH /api/v1/users/:id`: `{ "role": "Inventory", "status": "Inactive" }`
* `DELETE /api/v1/users/:id`

### 8.2 Roles & Permissions
* `GET /api/v1/roles`: Lists all roles, user counts, and active permission counts.
* `POST /api/v1/roles`: `{ "name": "Warehouse Dispatcher", "description": "Manages order dispatch and packing", "permissionIds": ["orders.dispatch", "inventory.transfer"] }`
* `PUT /api/v1/roles/:id`
* `DELETE /api/v1/roles/:id`
* `GET /api/v1/permissions`: Returns all granular system permission keys categorized by module (`Requests`, `Orders`, `Inventory`, `Catalog`, `Settings`).

### 8.3 Activity & Audit Log
* `GET /api/v1/audit-logs`
* **Query Parameters**: `page`, `limit`, `actor`, `module`, `dateFrom`, `dateTo`
* **Response**: Chronological record of administrative and security actions.

---

## 9. System Settings (`/api/v1/settings`)

### 9.1 General Settings
* `GET /api/v1/settings/general`
* `PUT /api/v1/settings/general`:
```json
{
  "portalName": "Maritama Trading Portal",
  "websiteName": "Maritama Trading",
  "defaultLanguage": "English",
  "currency": "NGN",
  "timezone": "Africa/Lagos",
  "dateFormat": "DD/MM/YYYY",
  "timeFormat": "12-hour"
}
```

### 9.2 Company & Contact Profile
* `GET /api/v1/settings/company`
* `PUT /api/v1/settings/company`:
```json
{
  "companyName": "Maritama Trading Ltd",
  "registrationNumber": "RC-1298492",
  "description": "Leading distributor of commercial solar, EV and electrical engineering hardware.",
  "logoUrl": "https://...",
  "faviconUrl": "https://...",
  "emails": { "primary": "info@maritamatrading.com", "orders": "orders@maritamatrading.com" },
  "phones": { "primary": "+234 1 234 5678" },
  "headquartersAddress": "Victoria Island, Lagos, Nigeria"
}
```

### 9.3 Public Portal Configuration
* `GET /api/v1/settings/portal-config`
* `PUT /api/v1/settings/portal-config`:
```json
{
  "websiteStatus": "Live",
  "allowQuoteRequests": true,
  "allowCartOrders": true,
  "showProductPrices": false,
  "showOutOfStockProducts": true,
  "showFeaturedProducts": true,
  "autoCreateLeadsFromQuotes": true,
  "sendCustomerConfirmationEmail": true
}
```

### 9.4 Inventory Global Settings
* `GET /api/v1/settings/inventory`
* `PUT /api/v1/settings/inventory`:
```json
{
  "defaultLowStockThreshold": 10,
  "defaultCriticalStockThreshold": 5,
  "alertOnLowStock": true,
  "alertOnCriticalStock": true
}
```

### 9.5 Notification Rules & Recipient Groups
* `GET /api/v1/settings/notifications`
* `PUT /api/v1/settings/notifications`:
```json
{
  "events": [
    { "name": "New Request", "email": true, "inApp": true, "status": "Active" },
    { "name": "New Order", "email": true, "inApp": true, "status": "Active" },
    { "name": "Order Dispatched", "email": true, "inApp": true, "status": "Active" },
    { "name": "Low Stock", "email": true, "inApp": true, "status": "Active" }
  ],
  "recipientGroups": [
    { "name": "Sales Team", "emails": ["sales@maritamatrading.com"] },
    { "name": "Operations Team", "emails": ["ops@maritamatrading.com"] }
  ]
}
```

### 9.6 Business Segments Configuration
* `GET /api/v1/settings/segments`
* `PUT /api/v1/settings/segments/:code`: Enables, disables, or updates business segment definitions (`SOL`, `LUX`, `EV`, `ELE`).

---

## 10. Universal Navigation Services (`Topbar`)

### 10.1 Global Universal Search
* **Endpoint**: `GET /api/v1/search`
* **Query Parameters**: `q` (string, required)
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "orders": [{ "id": "ord-1", "orderNumber": "ORD-003891", "title": "Apex Logistics" }],
    "requests": [{ "id": "req-1", "requestNumber": "REQ-002481", "title": "John Adewale" }],
    "products": [{ "id": "prod-1", "name": "SolarMax 10kW Hybrid Inverter" }],
    "customers": [{ "name": "Tunde Bakare", "email": "tunde@apexlogistics.ng" }]
  }
}
```

### 10.2 Notifications & Alerts
* `GET /api/v1/notifications` (query: `unreadOnly=true`, `page`, `limit`)
* `GET /api/v1/notifications/unread-count`: Returns `{ "unreadCount": 2 }`
* `PATCH /api/v1/notifications/:id/read`
* `POST /api/v1/notifications/mark-all-read`
