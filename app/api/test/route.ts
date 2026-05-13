import { prisma } from "@/lib/prisma";

export async function GET() {
  return Response.json({
    ok: true
  });
}