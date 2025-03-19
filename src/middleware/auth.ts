import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// middleware to handle role-based access control (RBAC):

//middleware wrappers
export function withAuth(
  handler: Function,
  requiredPermissions: string[] = []
) {
  return async (request: NextRequest) => {
    const allCookies = await cookies();
    const userPermissions = JSON.parse(
      allCookies.get("user_permissions")?.value || "[]"
    );

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(request);
  };
}

//middleware wrappers
export function withRole(handler: Function, requiredRoles: string[] = []) {
  return async (request: NextRequest) => {
    const allCookies = await cookies();
    const userRoles = JSON.parse(allCookies.get("user_roles")?.value || "[]");

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return NextResponse.json({ error: "Insufficient role" }, { status: 403 });
    }

    return handler(request);
  };
}
