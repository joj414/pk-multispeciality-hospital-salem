import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { initSocket } from "./websocket/socket.service";

import authRouter from "./auth/auth.controller";
import patientsRouter from "./patients/patients.controller";
import doctorsRouter from "./doctors/doctors.controller";
import departmentsRouter from "./departments.controller";
import appointmentsRouter from "./appointments/appointments.controller";
import queueRouter from "./queue/queue.controller";
import bedsRouter from "./beds/beds.controller";
import notificationsRouter from "./notifications/notifications.controller";
import analyticsRouter from "./analytics/analytics.controller";
import auditRouter from "./audit/audit.controller";
import simulationRouter from "./simulation/simulation.controller";
import searchRouter from "./search.controller";
import { getHospitalKPIs } from "./analytics/analytics.service";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/queue", queueRouter);
app.use("/api/beds", bedsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/audit", auditRouter);
app.use("/api/simulation", simulationRouter);
app.use("/api/search", searchRouter);

// Convenient alias for /api/dashboard
app.get("/api/dashboard", async (req, res) => {
  try {
    const kpis = await getHospitalKPIs();
    res.json({ success: true, data: kpis });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    system: "SmartCare Flow Engine",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  ============================================================
  🏥 SMARTCARE FLOW — 3D DIGITAL HOSPITAL ENGINE
  ============================================================
  🚀 REST API & WebSockets live on: http://localhost:${PORT}
  📡 Socket.IO initialized for real-time events
  📊 Database: Prisma SQLite / PostgreSQL ready
  ============================================================
  `);
});

export default app;
