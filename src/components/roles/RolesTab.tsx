import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { StatusPill } from "../ui/StatusPill";
import { Modal } from "../ui/Modal";
import { mockRoles } from "../../data/mockRoles";
import type { Role } from "../../data/mockRoles";
import { Plus } from "lucide-react";

export function RolesTab() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [addForm, setAddForm] = useState({ name: "", description: "" });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: Role = {
      id: `ROL-00${roles.length + 1}`,
      name: addForm.name,
      description: addForm.description,
      usersCount: 0,
      permissionsCount: 0,
      status: 'Active'
    };
    setRoles([...roles, newRole]);
    setIsAddRoleOpen(false);
    setAddForm({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-[#5b6671] text-sm">Manage access roles and their permissions.</div>
        <button 
          onClick={() => setIsAddRoleOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        <Table headers={["Role", "Description", "Users", "Permissions", "Status", "Action"]}>
            {roles.map((role) => (
              <TableRow key={role.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => setSelectedRole(role)}>
                <TableCell className="font-bold text-ink">{role.name}</TableCell>
                <TableCell className="text-[#5b6671] max-w-xs truncate">{role.description}</TableCell>
                <TableCell className="text-right font-semibold text-ink">{role.usersCount}</TableCell>
                <TableCell className="text-right font-semibold text-ink">{role.permissionsCount}</TableCell>
                <TableCell className="pl-8">
                  <StatusPill status={role.status} />
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-brand-green font-bold text-sm hover:underline">View</button>
                </TableCell>
              </TableRow>
            ))}
        </Table>
      </div>

      <Modal isOpen={isAddRoleOpen} onClose={() => setIsAddRoleOpen(false)} title="Create Role">
        <form onSubmit={handleAddRole} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Role Name *</label>
            <input 
              required
              type="text" 
              value={addForm.name}
              onChange={e => setAddForm({...addForm, name: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
              placeholder="e.g. Content Manager"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Description</label>
            <textarea 
              value={addForm.description}
              onChange={e => setAddForm({...addForm, description: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green h-24 resize-none"
              placeholder="Describe what this role is for..."
            />
          </div>
          
          <div className="pt-2 text-sm text-[#5b6671]">
            Note: You can configure permissions for this role after creating it.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
            <button 
              type="button"
              onClick={() => setIsAddRoleOpen(false)}
              className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
            >
              Create Role
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedRole} onClose={() => setSelectedRole(null)} title="Role Details">
        {selectedRole && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-ink">{selectedRole.name}</h3>
              <p className="text-[#5b6671] mb-3">{selectedRole.description}</p>
              <StatusPill status={selectedRole.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line flex flex-col justify-center items-center">
                <div className="text-2xl font-black text-ink">{selectedRole.usersCount}</div>
                <div className="text-xs font-semibold text-[#8a949d] uppercase">Assigned Users</div>
              </div>
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line flex flex-col justify-center items-center">
                <div className="text-2xl font-black text-ink">{selectedRole.permissionsCount}</div>
                <div className="text-xs font-semibold text-[#8a949d] uppercase">Permissions</div>
              </div>
            </div>

            <div className="pt-4 border-t border-line">
              <h4 className="font-bold text-ink mb-3">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="w-full px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
                  Edit Role Details
                </button>
                <button className="w-full px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
                  Configure Permissions
                </button>
                <button className="w-full px-4 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
                  Assign Users
                </button>
                {selectedRole.status === 'Active' ? (
                  <button className="w-full px-4 py-2 bg-[#fff0f0] text-[#e02424] rounded-xl text-sm font-bold hover:bg-[#ffe5e5] mt-2">
                    Deactivate Role
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 bg-white border border-brand-green text-brand-green rounded-xl text-sm font-bold hover:bg-[#eef5ed] mt-2">
                    Reactivate Role
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
