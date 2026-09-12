import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";
import { authenticateJWT, AuthenticatedRequest } from "./auth.middleware";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const result = await loginUser(email, password, ipAddress);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, departmentId } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: "Email, password, and name are required" });
    }

    const result = await registerUser(email, password, name, role, departmentId);
    res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/me", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

export default router;
