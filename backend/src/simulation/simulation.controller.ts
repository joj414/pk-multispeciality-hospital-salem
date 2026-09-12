import { Router, Request, Response } from "express";
import { runLiveSimulation, getSimulationStatus } from "./simulation.service";

const router = Router();

router.post("/run", async (req: Request, res: Response) => {
  try {
    const result = await runLiveSimulation();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/status", (req: Request, res: Response) => {
  res.json(getSimulationStatus());
});

export default router;
