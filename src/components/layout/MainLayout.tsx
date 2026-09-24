import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex text-ink bg-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-7 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
