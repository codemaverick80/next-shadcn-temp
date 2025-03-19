import { NextRequest, NextResponse } from "next/server";
import { withRole, withAuth } from "@/middleware/auth";
import { database as db } from "@/db";
import { users } from "@/db/schema";

// Handler for getting all users - requires admin role
async function getUsers(req: NextRequest) {
  const allUsers = await db.query.users.findMany();
  return NextResponse.json(allUsers);
}

// Handler for creating a new user - requires create:users permission
async function createUser(req: NextRequest) {
  const data = await req.json();
  const newUser = await db.insert(users).values(data).returning();
  return NextResponse.json(newUser[0]);
}

// Protected routes
export const GET = withRole(getUsers, ["admin"]);
export const POST = withAuth(createUser, ["create:users"]);
