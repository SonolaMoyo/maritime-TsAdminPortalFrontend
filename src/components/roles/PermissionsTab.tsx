import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { mockPermissions } from "../../data/mockRoles";
import type { Permission } from "../../data/mockRoles";
import { Search } from "lucide-react";

export function PermissionsTab() {
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermissions = permissions.filter(p => 
    p.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-[#5b6671] text-sm">Manage available system permissions.</div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a949d]" />
          <input 
            type="text" 
            placeholder="Search permissions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        <Table headers={["Permission", "Module", "Action", "Description"]}>
            {filteredPermissions.map((permission) => (
              <TableRow key={permission.id} className="hover:bg-[#fcfdfa]">
                <TableCell>
                  <code className="text-xs bg-[#f4f7f4] text-[#005642] px-2 py-1 rounded font-mono font-bold">
                    {permission.key}
                  </code>
                </TableCell>
                <TableCell className="font-bold text-ink">{permission.module}</TableCell>
                <TableCell className="font-bold text-ink">{permission.action}</TableCell>
                <TableCell className="text-[#5b6671]">{permission.description}</TableCell>
              </TableRow>
            ))}
            {filteredPermissions.length === 0 && (
              <TableRow>
                <td colSpan={4} className="text-center py-8 text-[#8a949d]">
                  No permissions found matching "{searchTerm}"
                </td>
              </TableRow>
            )}
        </Table>
      </div>
    </div>
  );
}
