import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email });
  setAuthCookie(token);

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email },
  });
}



/**
 * example login route
 * 
 * const user = await prisma.user.findUnique({
 *      where: {email} ,
 * });
 * 
 * 
 * server component
 * 
 * const users = await prisma.user.findMany();
 */