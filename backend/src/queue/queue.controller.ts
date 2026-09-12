import { Router, Request, Response } from "express";
import { getQueueStatus, enqueuePatient, callNextPatient, updateQueuePriority } from "./queue.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.query;
    const queue = await getQueueStatus(departmentId as string | undefined);
    res.json({ success: true, count: queue.length, data: queue });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { patientId, departmentId, appointmentId, priorityScore, isEmergency } = req.body;
    if (!patientId || !departmentId) {
      return res.status(400).json({ success: false, error: "patientId and departmentId are required" });
    }

    const result = await enqueuePatient({
      patientId,
      departmentId,
      appointmentId,
      priorityScore,
      isEmergency
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/call-next", async (req: Request, res: Response) => {
  try {
    const { departmentId, doctorName } = req.body;
    const nextPatient = await callNextPatient(departmentId, doctorName);
    if (!nextPatient) {
      return res.json({ success: true, message: "Queue is empty", data: null });
    }
    res.json({ success: true, data: nextPatient });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/priority", async (req: Request, res: Response) => {
  try {
    const { priorityScore } = req.body;
    if (typeof priorityScore !== "number") {
      return res.status(400).json({ success: false, error: "Valid priorityScore (1-5) required" });
    }

    const result = await updateQueuePriority(req.params.id, priorityScore);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
