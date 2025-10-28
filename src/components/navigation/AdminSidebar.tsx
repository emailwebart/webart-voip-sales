'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Bell, Home, LineChart, LogOut, Settings, BarChart, PieChart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from '../shared/Logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/reports', label: 'Reports', icon: BarChart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
        <SidebarHeader>
            <Logo />
        </SidebarHeader>
        <SidebarContent className="p-4">
            <SidebarMenu>
            {menuItems.map(item => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton 
                            isActive={pathname === item.href}
                            tooltip={item.label}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Notifications">
                        <Bell />
                        <span>Notifications</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/report" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-4 border-t border-border pt-4 flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold text-sm">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@voip.com</p>
                </div>
            </div>
        </SidebarFooter>
    </Sidebar>
  );
}
