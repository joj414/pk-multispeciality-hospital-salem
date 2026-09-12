import { Router, Request, Response } from "express";
import { getAllBeds, getBedById, updateBedStatus, allocateBedSmart, releaseBed } from "./beds.service";
import { BedStatus } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { floor, departmentId, status } = req.query;
    const beds = await getAllBeds(
      floor ? parseInt(floor as string, 10) : undefined,
      departmentId as string | undefined,
      status as string | undefined
    );
    res.json({ success: true, count: beds.length, data: beds });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const bed = await getBedById(req.params.id);
    if (!bed) return res.status(404).json({ success: false, error: "Bed not found" });
    res.json({ success: true, data: bed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ success: false, error: "Status is required" });

    const updated = await updateBedStatus(req.params.id, status as BedStatus, notes);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/allocate", async (req: Request, res: Response) => {
  try {
    const { patientId, requiredType, departmentId, isEmergency, priorityScore, allocatedBy, reason } = req.body;
    if (!patientId) {
      return res.status(400).json({ success: false, error: "patientId is required" });
    }

    const result = await allocateBedSmart({
      patientId,
      requiredType,
      departmentId,
      isEmergency,
      priorityScore,
      allocatedBy,
      reason
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/release", async (req: Request, res: Response) => {
  try {
    const { bedId, setToCleaning } = req.body;
    if (!bedId) return res.status(400).json({ success: false, error: "bedId is required" });

    const result = await releaseBed(bedId, setToCleaning !== false);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
