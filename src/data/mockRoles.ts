export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  created: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionsCount: number;
  status: 'Active' | 'Inactive';
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  action: string;
  description: string;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  details: string;
}

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Moyo Sonola', email: 'moyo@maritama.com', role: 'Administrator', status: 'Active', lastActive: 'Today', created: '12 Sep 2026' },
  { id: 'USR-002', name: 'John Doe', email: 'john@maritama.com', role: 'Sales', status: 'Active', lastActive: 'Today', created: '15 Sep 2026' },
  { id: 'USR-003', name: 'David Smith', email: 'david@maritama.com', role: 'Inventory', status: 'Inactive', lastActive: '10 Sep 2026', created: '01 Aug 2026' },
  { id: 'USR-004', name: 'Sarah Ade', email: 'sarah@maritama.com', role: 'Content Manager', status: 'Active', lastActive: 'Yesterday', created: '20 Aug 2026' },
];

export const mockRoles: Role[] = [
  { id: 'ROL-001', name: 'Administrator', description: 'Full access to all system features and settings.', usersCount: 3, permissionsCount: 42, status: 'Active' },
  { id: 'ROL-002', name: 'Sales', description: 'Manage customer requests and orders.', usersCount: 6, permissionsCount: 14, status: 'Active' },
  { id: 'ROL-003', name: 'Inventory', description: 'Manage stock, warehouses and suppliers.', usersCount: 4, permissionsCount: 12, status: 'Active' },
  { id: 'ROL-004', name: 'Content Manager', description: 'Manage product catalog and website content.', usersCount: 2, permissionsCount: 10, status: 'Active' },
];

export const mockPermissions: Permission[] = [
  { id: 'PERM-001', key: 'requests.view', module: 'Requests', action: 'View', description: 'View customer requests' },
  { id: 'PERM-002', key: 'requests.create', module: 'Requests', action: 'Create', description: 'Create a request' },
  { id: 'PERM-003', key: 'requests.edit', module: 'Requests', action: 'Edit', description: 'Edit request details' },
  { id: 'PERM-004', key: 'orders.approve', module: 'Orders', action: 'Approve', description: 'Approve an order' },
  { id: 'PERM-005', key: 'inventory.receive', module: 'Inventory', action: 'Receive', description: 'Receive stock' },
  { id: 'PERM-006', key: 'catalog.publish', module: 'Catalog', action: 'Publish', description: 'Publish products' },
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: 'AUD-001', date: '24 Sep 2026 · 14:20', actor: 'Moyo Sonola', action: 'Role Changed', details: 'Changed role of John Doe from Sales to Inventory' },
  { id: 'AUD-002', date: '23 Sep 2026 · 09:12', actor: 'System', action: 'User Activated', details: 'David Smith was activated' },
  { id: 'AUD-003', date: '22 Sep 2026 · 16:45', actor: 'Moyo Sonola', action: 'User Created', details: 'Created user Sarah Ade' },
];
