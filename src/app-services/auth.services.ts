import { database as db } from "@/db";
import { roles, permissions, userRoles, rolePermissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { UserId } from "@/types";
import { Role, Permission } from "@/db/schema/roles";

export async function getUserRoles(userId: UserId): Promise<Role[]> {
  const userRolesList = await db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
    with: {
      role: true,
    },
  });
  return userRolesList.map((ur) => ur.role);
}

export async function getRolePermissions(
  roleId: number
): Promise<Permission[]> {
  const rolePermissionsList = await db.query.rolePermissions.findMany({
    where: eq(rolePermissions.roleId, roleId),
    with: {
      permission: true,
    },
  });
  return rolePermissionsList.map((rp) => rp.permission);
}

export async function getUserPermissions(userId: UserId): Promise<string[]> {
  const userRolesList = await getUserRoles(userId);
  const permissions = new Set<string>();

  for (const role of userRolesList) {
    const rolePerms = await getRolePermissions(role.id);
    rolePerms.forEach((p) => permissions.add(p.name));
  }

  return Array.from(permissions);
}

export async function hasPermission(
  userId: UserId,
  permissionName: string
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId);
  return userPerms.includes(permissionName);
}

export async function hasRole(
  userId: UserId,
  roleName: string
): Promise<boolean> {
  const userRolesList = await getUserRoles(userId);
  return userRolesList.some((role) => role.name === roleName);
}
