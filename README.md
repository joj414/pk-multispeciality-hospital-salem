# 🏥 SMARTCARE FLOW
> **"Intelligent Hospital Operations. Faster Decisions. Better Patient Flow."**

SmartCare Flow is a modern, high-performance interactive 3D WebGL Digital Twin and hospital resource operations platform. It combines a priority-aware patient scheduling engine (FIFO routine queue + Max-Heap emergency preemption), algorithmic bed allocation, real-time Socket.IO synchronization, and role-based clinical dashboards.

---

## 🌟 Key Capabilities

1. **Interactive 3D Digital Twin Hospital**:
   - Built with Three.js, React Three Fiber, and Drei.
   - Architectural layout featuring Floor 1 (Emergency & Diagnostics), Floor 2 (ICU & General Inpatient), Floor 3 (Pediatrics & Neurology), and Helipad.
   - 80 interactive 3D beds with LED status indicators (Emerald = Available, Crimson = Occupied, Amber = Reserved, Cyan = Cleaning, Slate = Maintenance).
   - Smooth OrbitControls, camera pan & glide transitions, hover tooltips, and floor cutaway view modes.

2. **Priority-Aware Hospital Flow Engine**:
   - **Emergency Max-Heap Priority Queue**: Urgency-scored (Level 1 to 5) with timestamp tie-breaking and dynamic priority escalation.
   - **Routine FIFO Queue**: Predictable, orderly scheduling for outpatient consultations.

3. **Smart Bed Allocation Engine**:
   - Operational scheduling algorithm matching patient acuity, required ward type, equipment, and floor proximity.
   - Automated overflow routing and priority bed waitlisting when wards operate at capacity.

4. **Bi-directional Real-Time Events (Socket.IO)**:
   - Synchronizes bed status changes, emergency admissions, queue updates, and notifications across all active client terminals in real-time.

5. **Live Simulation Engine**:
   - 1-click end-to-end demonstration of incoming trauma ambulance arrival, instant queue preemption, automated 3D camera tracking, bed reservation, and KPI synchronization.

6. **Role-Based Portals (RBAC)**:
   - Dedicated workflows for Superadmin, Hospital Operations Director, Emergency Physician, Charge Nurse, and Patient.

7. **Operations Analytics (Recharts)**:
   - Real-time KPIs, bed census distribution, hourly patient traffic, and department utilization metrics.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Three.js, `@react-three/fiber`, `@react-three/drei`, TailwindCSS, Lucide Icons, Recharts, `socket.io-client`.
- **Backend**: Node.js, Express, TypeScript, Socket.IO, `bcryptjs`, `jsonwebtoken`.
- **Database & ORM**: Prisma ORM with SQLite (zero-config turnkey local development) and PostgreSQL support.
- **DevOps**: Docker, Docker Compose multi-container configuration.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Database Setup & Seed
From the project root:
```bash
# Generate Prisma Client and push schema to SQLite database
npm --prefix backend run prisma:push

# Seed database with 50 patients, 20 doctors, 100 appointments, and 80 beds
npm run db:seed
```

### 2. Run Automated Engine Tests
```bash
npm run test
```

### 3. Start Backend API & WebSocket Server (Port 5000)
```bash
npm --prefix backend run dev
```

### 4. Start Next.js 3D Web Application (Port 3000)
```bash
npm --prefix frontend run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🐳 Docker Deployment
To run the full production stack with PostgreSQL, backend, and frontend containers:
```bash
docker-compose up --build
```

---

## 🔑 Demo Access Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Superadmin** | Dr. Alexander Wright | `admin@smartcare.com` | `password123` |
| **Hospital Admin** | Eleanor Vance | `hospital.admin@smartcare.com` | `password123` |
| **Emergency Chief** | Dr. Marcus Chen | `dr.chen@smartcare.com` | `password123` |
| **Head Nurse** | Nurse Sarah Jenkins | `nurse.sarah@smartcare.com` | `password123` |
| **Patient** | David Miller | `patient.john@smartcare.com` | `password123` |

*Single-click login shortcuts for all roles are provided on the `/login` page.*

---

## ⚠️ Educational & Operational Prototype Notice
SmartCare Flow is an educational and operational workflow prototype. It is not a medical diagnostic or clinical decision-support system.