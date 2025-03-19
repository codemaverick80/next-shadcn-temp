import { database as db } from "@/db";
import { roles, permissions, userRoles, rolePermissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { UserId } from "@/types";
import { Role, Permission } from "@/db/schema/roles";

export async function assignRoleToUser(userId: UserId, roleId: number) {
  return await db
    .insert(userRoles)
    .values({ userId, roleId })
    .onConflictDoNothing()
    .returning();
}

export async function assignPermissionToRole(
  roleId: number,
  permissionId: number
) {
  return await db
    .insert(rolePermissions)
    .values({ roleId, permissionId })
    .onConflictDoNothing()
    .returning();
}

export async function createRole(
  name: string,
  description?: string
): Promise<Role> {
  const [role] = await db
    .insert(roles)
    .values({ name, description })
    .returning();
  return role;
}

export async function createPermission(
  name: string,
  description?: string
): Promise<Permission> {
  const [permission] = await db
    .insert(permissions)
    .values({ name, description })
    .returning();
  return permission;
}

export async function getRoleByName(name: string): Promise<Role | undefined> {
  return await db.query.roles.findFirst({
    where: eq(roles.name, name),
  });
}

export async function assignDefaultRoleToUser(userId: UserId) {
  // Get or create the default role
  let defaultRole = await getRoleByName("user");
  if (!defaultRole) {
    defaultRole = await createRole("user", "Default role for new users");
  }

  // Assign the default role to the user
  await assignRoleToUser(userId, defaultRole.id);
  return defaultRole;
}

export async function removeRoleFromUser(userId: UserId, roleId: number) {
  await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
}

export async function removePermissionFromRole(
  roleId: number,
  permissionId: number
) {
  await db
    .delete(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    );
}
