import { Router, Request, Response } from "express";
import { getAllAppointments, createAppointment, updateAppointmentStatus } from "./appointments.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { date, departmentId, doctorId, status } = req.query;
    const appts = await getAllAppointments(
      date as string | undefined,
      departmentId as string | undefined,
      doctorId as string | undefined,
      status as string | undefined
    );
    res.json({ success: true, count: appts.length, data: appts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, departmentId, date, time, type, priority, isEmergency, reason } = req.body;
    if (!patientId || !doctorId || !departmentId || !date || !time) {
      return res.status(400).json({ success: false, error: "Missing required appointment fields" });
    }

    const appt = await createAppointment({
      patientId,
      doctorId,
      departmentId,
      date,
      time,
      type,
      priority,
      isEmergency,
      reason
    });

    res.status(201).json({ success: true, data: appt });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" });
    }

    const appt = await updateAppointmentStatus(req.params.id, status, notes);
    res.json({ success: true, data: appt });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
