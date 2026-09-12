import { Router, Request, Response } from "express";
import { getAllDoctors, getDoctorById, updateDoctorAvailability } from "./doctors.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { departmentId, isAvailable } = req.query;
    const doctors = await getAllDoctors(
      departmentId as string | undefined,
      isAvailable !== undefined ? isAvailable === "true" : undefined
    );
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" });
    }
    res.json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/availability", async (req: Request, res: Response) => {
  try {
    const { isAvailable } = req.body;
    const doctor = await updateDoctorAvailability(req.params.id, !!isAvailable);
    res.json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
