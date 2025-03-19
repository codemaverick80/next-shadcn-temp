import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRoles, getUserPermissions } from "@/app-services/auth.services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/sign-in");

  // Fetch user roles and permissions
  const userRoles = await getUserRoles(user.id);
  const userPermissions = await getUserPermissions(user.id);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-1 justify-end gap-2">
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="font-semibold">Name:</span> {user.name}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roles Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Roles</CardTitle>
                <CardDescription>
                  Assigned roles and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userRoles.map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Permissions</CardTitle>
                <CardDescription>What you can do in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userPermissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role-based content */}
          <div className="mt-8">
            {userRoles.some((role) => role.name === "admin") && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>
                    Administrative controls and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Admin-only content goes here</p>
                </CardContent>
              </Card>
            )}

            {userPermissions.includes("create:users") && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Create and manage users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>User management content goes here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// import {redirect} from "next/navigation";
// import {validateRequest} from "@/auth";
//
// export default async function DashboardPage(){
//
//     const { user } = await validateRequest();
//     if (!user) redirect("");
//
//     return(
//
//         <div>
//             Dashboard
//             <p/>
//             {/*<ShowUserPermission data={data}/>*/}
//         </div>
//
//     )
// }
