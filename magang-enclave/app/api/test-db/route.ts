import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json({
    success: true,
    count: users.length,
  });
}
