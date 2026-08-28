"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Compass,
    ClipboardList,
    Star,
    Users,
    LogOut,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
    const pathname = usePathname();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const { t } = useT("admin");
    const { user, logout } = useAuth();

    const items = [
        { title: t("sidebar.dashboard"), url: `${prefix}/admin`, icon: LayoutDashboard },
        { title: t("sidebar.tours"), url: `${prefix}/admin/tours`, icon: Compass },
        { title: t("sidebar.bookings"), url: `${prefix}/admin/bookings`, icon: ClipboardList },
        { title: t("sidebar.reviews"), url: `${prefix}/admin/reviews`, icon: Star },
        { title: t("sidebar.users"), url: `${prefix}/admin/users`, icon: Users },
    ];

    // SidebarMenuButton class'lariga o'xshash klasslarni to'g'ridan-to'g'ri Link'ga qo'yamiz
    const linkClass = (isActive: boolean) =>
        cn(
            "flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
            "[&>svg]:size-4 [&>svg]:shrink-0",
            isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
        );

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shrink-0">
                        DS
                    </div>
                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="text-base font-bold tracking-tight">
                            Discover<span className="text-accent">Stans</span>
                        </span>
                        <span className="text-xs text-muted-foreground">Admin panel</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive =
                                    item.url === `${prefix}/admin`
                                        ? pathname === item.url
                                        : pathname.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <Link href={item.url} className={linkClass(isActive)}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href={`${prefix}/profile`}
                            className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium shrink-0">
                                {user?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                            <div className="flex flex-col leading-tight overflow-hidden">
                                <span className="truncate text-sm font-medium">{user?.full_name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <button
                            onClick={logout}
                            className={cn(linkClass(false), "cursor-pointer")}
                        >
                            <LogOut />
                            <span>{t("sidebar.logout")}</span>
                        </button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}