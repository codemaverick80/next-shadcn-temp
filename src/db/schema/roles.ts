import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

// Roles table
export const roles = pgTable("roles", {
  id: serial("role_id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// User roles junction table
export const userRoles = pgTable("user_roles", {
  id: serial("user_role_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
});

// Permissions table
export const permissions = pgTable("permissions", {
  id: serial("permission_id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Role permissions junction table
export const rolePermissions = pgTable("role_permissions", {
  id: serial("role_permission_id").primaryKey(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
});

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);

export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type RolePermission = typeof rolePermissions.$inferSelect;
