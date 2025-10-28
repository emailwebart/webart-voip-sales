import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/navigation/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-background/95">{children}</main>
      </div>
    </SidebarProvider>
  );
}
