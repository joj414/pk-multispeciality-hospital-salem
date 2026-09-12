import { Router, Request, Response } from "express";
import { prisma } from "./db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || "").trim();
    if (!query) {
      return res.json({ success: true, data: { patients: [], doctors: [], beds: [], departments: [] } });
    }

    const [patients, doctors, beds, departments] = await Promise.all([
      prisma.patient.findMany({
        where: {
          OR: [
            { id: { contains: query } },
            { name: { contains: query } },
            { phone: { contains: query } }
          ]
        },
        take: 5
      }),
      prisma.doctor.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { specialty: { contains: query } },
            { roomNumber: { contains: query } }
          ]
        },
        take: 5
      }),
      prisma.bed.findMany({
        where: {
          OR: [
            { id: { contains: query } },
            { code: { contains: query } },
            { room: { contains: query } }
          ]
        },
        include: { department: true },
        take: 5
      }),
      prisma.department.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { code: { contains: query } }
          ]
        },
        take: 5
      })
    ]);

    res.json({
      success: true,
      data: {
        patients,
        doctors,
        beds,
        departments
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;