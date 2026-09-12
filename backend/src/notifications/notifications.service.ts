import { prisma } from "../db";
import { broadcastEvent } from "../websocket/socket.service";

export async function createNotification(title: string, message: string, type: "INFO" | "WARNING" | "EMERGENCY" | "SUCCESS" = "INFO", targetRole: string = "ALL") {
  const notif = await prisma.notification.create({
    data: {
      title,
      message,
      type,
      targetRole,
      isRead: false
    }
  });

  // Broadcast to all connected clients immediately
  broadcastEvent("notification.created", notif);
  return notif;
}

export async function getNotifications(limit: number = 30) {
  return await prisma.notification.findMany({
    take: limit,
    orderBy: { createdAt: "desc" }
  });
}

export async function markNotificationRead(id: string) {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
}
