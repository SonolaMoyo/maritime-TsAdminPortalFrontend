import { useState, useMemo } from "react";
import { Panel } from "../components/ui/Card";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { StatusPill } from "../components/ui/StatusPill";
import { Pagination } from "../components/ui/Pagination";
import { demo } from "../data/mockData";

export function Schedule() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(demo.schedules.length / pageSize) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return demo.schedules.slice(start, start + pageSize);
  }, [currentPage, pageSize]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Schedule</h1>
          <p className="text-text mt-2 max-w-[780px]">Operations calendar for meetings, deliveries, and follow-ups.</p>
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <Table headers={["Date", "Title", "Client", "Location", "Assigned To", "Status"]}>
          {paginatedSchedules.map(schedule => (
            <TableRow key={schedule.id}>
              <TableCell><b className="block">{schedule.scheduled_date}</b></TableCell>
              <TableCell>{schedule.title}</TableCell>
              <TableCell>{schedule.client_name}</TableCell>
              <TableCell>{schedule.location}</TableCell>
              <TableCell>{schedule.assigned_to}</TableCell>
              <TableCell><StatusPill status={schedule.status} /></TableCell>
            </TableRow>
          ))}
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={demo.schedules.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </Panel>
    </div>
  );
}
