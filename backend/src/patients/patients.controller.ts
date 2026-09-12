import { Router, Request, Response } from "express";
import { getAllPatients, getPatientById, createPatient } from "./patients.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, departmentId, isEmergency, limit } = req.query;
    const patients = await getAllPatients(
      search as string | undefined,
      departmentId as string | undefined,
      isEmergency !== undefined ? isEmergency === "true" : undefined,
      limit ? parseInt(limit as string, 10) : 100
    );
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }
    res.json({ success: true, data: patient });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, age, gender, phone, email, address, bloodGroup, emergencyContact, isEmergency, departmentId, status } = req.body;
    if (!name || !age || !gender || !phone) {
      return res.status(400).json({ success: false, error: "Name, age, gender, and phone are required" });
    }

    const patient = await createPatient({
      name,
      age,
      gender,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      address: address || "Hospital District, Metro City",
      bloodGroup: bloodGroup || "O+",
      emergencyContact: emergencyContact || phone,
      isEmergency,
      departmentId,
      status
    });

    res.status(201).json({ success: true, data: patient });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
