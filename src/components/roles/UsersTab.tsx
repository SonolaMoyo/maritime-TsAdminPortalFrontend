import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { StatusPill } from "../ui/StatusPill";
import { Modal } from "../ui/Modal";
import { mockUsers } from "../../data/mockRoles";
import type { User } from "../../data/mockRoles";
import { Search, Filter, Plus } from "lucide-react";

export function UsersTab() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Sales", status: "Active" as const });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-00${users.length + 1}`,
      ...addForm,
      lastActive: 'Never',
      created: 'Just now'
    };
    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    setAddForm({ name: "", email: "", role: "Sales", status: "Active" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a949d]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <button 
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        <Table headers={["User", "Email", "Role", "Status", "Last Active", "Created", "Action"]}>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => setSelectedUser(user)}>
                <TableCell className="font-bold text-ink">{user.name}</TableCell>
                <TableCell className="text-[#5b6671]">{user.email}</TableCell>
                <TableCell>
                  <span className="px-2.5 py-1 bg-[#f3f4f6] text-[#374151] rounded-lg text-xs font-bold">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusPill status={user.status} />
                </TableCell>
                <TableCell className="text-[#5b6671]">{user.lastActive}</TableCell>
                <TableCell className="text-[#5b6671]">{user.created}</TableCell>
                <TableCell className="text-right">
                  <button className="text-brand-green font-bold text-sm hover:underline">View</button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <td colSpan={7} className="text-center py-8 text-[#8a949d]">
                  No users found matching "{searchTerm}"
                </td>
              </TableRow>
            )}
        </Table>
      </div>

      <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add User">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Full Name *</label>
            <input 
              required
              type="text" 
              value={addForm.name}
              onChange={e => setAddForm({...addForm, name: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Email Address *</label>
            <input 
              required
              type="email" 
              value={addForm.email}
              onChange={e => setAddForm({...addForm, email: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
              placeholder="e.g. john@maritama.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Role *</label>
            <select
              value={addForm.role}
              onChange={e => setAddForm({...addForm, role: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
            >
              <option value="Administrator">Administrator</option>
              <option value="Sales">Sales</option>
              <option value="Inventory">Inventory</option>
              <option value="Content Manager">Content Manager</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="sendInvite" defaultChecked className="rounded border-line text-brand-green focus:ring-brand-green" />
            <label htmlFor="sendInvite" className="text-sm text-[#5b6671]">Send invitation email</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
            <button 
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-ink">{selectedUser.name}</h3>
              <p className="text-[#5b6671] mb-3">{selectedUser.email}</p>
              <StatusPill status={selectedUser.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line">
                <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">Role</div>
                <div className="font-bold text-ink">{selectedUser.role}</div>
              </div>
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line">
                <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">Created</div>
                <div className="font-bold text-ink">{selectedUser.created}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-line">
              <h4 className="font-bold text-ink mb-2">Access</h4>
              <p className="text-sm text-[#5b6671]">The {selectedUser.role} role grants access to specific modules and actions. Check the Roles tab for detailed permissions.</p>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-line mt-6">
              <button className="w-full px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
                Change Role
              </button>
              {selectedUser.status === 'Active' ? (
                <button className="w-full px-4 py-2 bg-[#fff0f0] text-[#e02424] rounded-xl text-sm font-bold hover:bg-[#ffe5e5]">
                  Deactivate User
                </button>
              ) : (
                <button className="w-full px-4 py-2 bg-white border border-brand-green text-brand-green rounded-xl text-sm font-bold hover:bg-[#eef5ed]">
                  Reactivate User
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
