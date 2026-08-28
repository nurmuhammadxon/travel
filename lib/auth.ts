import type { User, UserRole } from "@/types";

export const ADMIN_ROLES: UserRole[] = ["admin", "agent"];

export function isAdminUser(user?: User | null): boolean {
    if (!user) return false;
    return ADMIN_ROLES.includes(user.role);
}