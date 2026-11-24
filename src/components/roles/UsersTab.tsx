import { useState, useEffect } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { StatusPill } from "../ui/StatusPill";
import { Modal } from "../ui/Modal";
import { rolesService, type UserAccount } from "../../services/rolesService";
import { Search, Filter, Plus, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Select } from "../ui/Select";
import { Pagination } from "../ui/Pagination";

export function UsersTab() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Sales", status: "Active" as const });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await rolesService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 10;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await rolesService.createUser({
        name: addForm.name,
        email: addForm.email,
        role: addForm.role,
        status: addForm.status,
      });

      setFeedback({
        type: 'success',
        message: `User ${addForm.name} created successfully! An onboarding email with login credentials and a password reset link has been dispatched to ${addForm.email}.`,
      });

      setIsAddUserOpen(false);
      setAddForm({ name: "", email: "", role: "Sales", status: "Active" });
      await loadUsers();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || "Failed to create user. Please ensure the email is unique and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedback(null)} 
            className="font-bold ml-4 text-xs opacity-75 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a949d]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-line rounded-xl text-sm font-bold text-ink hover:bg-[#fcfdfa]">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <button 
          onClick={() => {
            setFeedback(null);
            setIsAddUserOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
        <Table headers={["User", "Email", "Role", "Status", "Last Active", "Created", "Action"]}>
            {loading ? (
              <TableRow>
                <td colSpan={7} className="text-center py-12 text-[#8a949d]">
                  Loading operational users...
                </td>
              </TableRow>
            ) : paginatedUsers.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-[#fcfdfa]" onClick={() => setSelectedUser(user)}>
                <TableCell className="font-bold text-ink">{user.name}</TableCell>
                <TableCell className="text-[#5b6671]">{user.email}</TableCell>
                <TableCell>
                  <span className="px-2.5 py-1 bg-[#f3f4f6] text-[#374151] rounded-lg text-xs font-bold">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusPill status={user.status as any} />
                </TableCell>
                <TableCell className="text-[#5b6671]">{user.lastActive || 'Never'}</TableCell>
                <TableCell className="text-[#5b6671]">{user.created || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}</TableCell>
                <TableCell className="text-right">
                  <button className="text-brand-green font-bold text-sm hover:underline cursor-pointer">View</button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredUsers.length === 0 && (
              <TableRow>
                <td colSpan={7} className="text-center py-8 text-[#8a949d]">
                  No users found matching "{searchTerm}"
                </td>
              </TableRow>
            )}
        </Table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
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
            <Select
              label="Role"
              required
              options={["Administrator", "Sales", "Inventory", "Content Manager"]}
              value={addForm.role}
              onChange={val => setAddForm({...addForm, role: val})}
            />
          </div>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 rounded-xl flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              An invitation email will automatically be sent via <b>admin@maritamatrading.com</b> containing their temporary password and a secure link to update their password.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2 text-sm font-bold text-[#5b6671] hover:text-ink transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-bold hover:shadow-lg transition-shadow cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create User"}
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
              <StatusPill status={selectedUser.status as any} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line">
                <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">Role</div>
                <div className="font-bold text-ink">{selectedUser.role}</div>
              </div>
              <div className="bg-[#fcfdfa] p-3 rounded-xl border border-line">
                <div className="text-xs font-semibold text-[#8a949d] uppercase mb-1">Created</div>
                <div className="font-bold text-ink">{selectedUser.created || (selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A')}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-line">
              <h4 className="font-bold text-ink mb-2">Access</h4>
              <p className="text-sm text-[#5b6671]">The {selectedUser.role} role grants access to specific operations modules and workflows.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
