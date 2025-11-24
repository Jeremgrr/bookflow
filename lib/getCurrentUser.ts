import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token) as { id: string } | null;
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  return user;
}


/**
 * Usage inside a server component
 * 
 * 
 * const user = await getCurrentUser();
 * 
 * if (!user) redirect("/aut/login");
 */