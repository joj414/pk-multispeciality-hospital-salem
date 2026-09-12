import { Router, Request, Response } from "express";
import { getHospitalKPIs, getAnalyticsData } from "./analytics.service";

const router = Router();

router.get("/kpis", async (req: Request, res: Response) => {
  try {
    const kpis = await getHospitalKPIs();
    res.json({ success: true, data: kpis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const analytics = await getAnalyticsData();
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
