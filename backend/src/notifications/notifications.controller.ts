import { Router, Request, Response } from "express";
import { getNotifications, markNotificationRead, createNotification } from "./notifications.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
    const notifs = await getNotifications(limit);
    res.json({ success: true, count: notifs.length, data: notifs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, message, type, targetRole } = req.body;
    const notif = await createNotification(title, message, type, targetRole);
    res.status(201).json({ success: true, data: notif });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch("/:id/read", async (req: Request, res: Response) => {
  try {
    const notif = await markNotificationRead(req.params.id);
    res.json({ success: true, data: notif });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
