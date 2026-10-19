import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-ink bg-bg relative">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      <main className="flex-1 min-w-0 flex flex-col w-full">
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />
        <div className="p-3.5 sm:p-5 lg:p-7 flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
