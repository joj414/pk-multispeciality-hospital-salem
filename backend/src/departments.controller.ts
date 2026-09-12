import { Router, Request, Response } from "express";
import { prisma } from "./db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            beds: true,
            doctors: true,
            patients: true
          }
        }
      },
      orderBy: { floor: "asc" }
    });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;