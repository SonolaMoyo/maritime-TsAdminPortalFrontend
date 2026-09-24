import { useState } from "react";
import { Table, TableRow, TableCell } from "../ui/Table";
import { mockAuditLogs } from "../../data/mockRoles";
import type { AuditLogEntry } from "../../data/mockRoles";
import { Search } from "lucide-react";

export function AuditLogTab() {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-[#5b6671] text-sm">Review changes to users, roles, and permissions over time.</div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a949d]" />
          <input 
            type="text" 
            placeholder="Search audit log..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        <Table headers={["Date & Time", "Actor", "Action", "Details"]}>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-[#fcfdfa]">
                <TableCell className="text-[#5b6671]">{log.date}</TableCell>
                <TableCell className="font-bold text-ink">{log.actor}</TableCell>
                <TableCell>
                  <span className="px-2.5 py-1 bg-[#f0f5ff] text-[#1d4ed8] rounded-lg text-xs font-bold">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-[#5b6671]">{log.details}</TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <td colSpan={4} className="text-center py-8 text-[#8a949d]">
                  No audit logs found matching "{searchTerm}"
                </td>
              </TableRow>
            )}
        </Table>
      </div>
    </div>
  );
}
