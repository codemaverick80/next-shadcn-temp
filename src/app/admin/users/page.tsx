import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRoles, hasPermission } from "@/app-services/auth.services";
import { database as db } from "@/db";
import { users } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  // Check authentication
  const { user } = await validateRequest();
  if (!user) redirect("/sign-in");

  // Check role and permission
  const userRoles = await getUserRoles(user.id);
  const canManageUsers = await hasPermission(user.id, "create:users");

  // Verify admin role
  if (!userRoles.some((role) => role.name === "admin")) {
    redirect("/dashboard?error=unauthorized");
  }

  // Fetch users
  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.id)],
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        {canManageUsers && <Button>Add New User</Button>}
      </div>

      <Table>
        <TableCaption>A list of all users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.emailVerified ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-600">✗</span>
                )}
              </TableCell>
              <TableCell>
                {canManageUsers && (
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
