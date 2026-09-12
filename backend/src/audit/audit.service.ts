import { prisma } from "../db";

export async function logAudit(action: string, details: string, userId?: string, ipAddress?: string) {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        details,
        userId: userId || null,
        ipAddress: ipAddress || "127.0.0.1"
      }
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return null;
  }
}

export async function getAuditLogs(limit: number = 50) {
  return await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" }
  });
}
