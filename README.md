# 🏥 PK MULTISPECIALITY HOSPITAL SALEM
> **"Excellence in Patient Care. Advanced Diagnostics. Compassionate Healing."**

A complete, high-performance interactive 3D WebGL Digital Twin and hospital resource operations platform for **PK Multispeciality Hospital Salem**, Tamil Nadu. Unifying 3D facility monitoring, priority-aware triage, 80-bed live tracking, clinical appointments, and operations analytics into an all-in-one single website application.

---

## 🌐 24/7 Permanent Cloud Deployment

To keep the website live **24/7 permanently even when Antigravity or your computer is closed**, deploy directly to the cloud with 1 click:

### Option 1: Deploy to Vercel (Recommended — Free, 24/7 Global CDN)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjoj414%2Fpk-multispeciality-hospital-salem&root-directory=frontend)

1. Click the button above or visit [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select `joj414/pk-multispeciality-hospital-salem`.
3. Set **Root Directory** to `frontend`.
4. Click **Deploy**. Your permanent 24/7 URL will be:  
   👉 **`https://pk-multispeciality-hospital-salem.vercel.app`**

---

### Option 2: Deploy to Render (Full Backend + Frontend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/joj414/pk-multispeciality-hospital-salem)

1. Click the button above or visit [render.com](https://render.com).
2. Connect the repository `joj414/pk-multispeciality-hospital-salem`.
3. Render automatically reads `render.yaml` and deploys both backend and frontend.

---

## 📍 Hospital Location & Contact Details

- **Hospital Name**: PK Multispeciality Hospital Salem
- **Full Address**: 
  > No. 45, Sarada College Road, Near New Bus Stand,  
  > Salem — 636 016, Tamil Nadu, India.
- **24/7 Emergency Line**: `+91 427 400 1000`
- **OPD Appointments**: `+91 427 400 1001`
- **General Enquiry**: `+91 427 400 1002`
- **Ambulance Service**: `+91 98765 43210`

### 🧭 How to Reach the Hospital
- **By Train**: Salem Junction Railway Station (SA) is **3.5 km** away (~10 mins via auto or taxi).
- **By Bus**: Salem New Bus Stand is **0.8 km** away (~5 mins walk). City buses 4, 7A, and 12 stop directly outside the hospital gate.
- **By Road**: NH-44 (Chennai – Salem Highway), exit at Salem Toll Plaza, turn into Sarada College Road.
- **Landmarks**: Located opposite **Sarada College for Women**, adjacent to **Salem Steel Plant Road**.

---

## 🌟 Key Capabilities

1. **Interactive 3D Digital Twin Hospital**:
   - Built with Three.js, React Three Fiber, and Drei.
   - Floor 1 (Emergency & Diagnostics), Floor 2 (ICU & General Inpatient), Floor 3 (Pediatrics & Neurology).
   - 80 interactive 3D beds with status LEDs (Emerald = Available, Crimson = Occupied, Amber = Reserved, Cyan = Cleaning, Slate = Maintenance).
   - Smooth OrbitControls, camera pan & glide transitions, hover tooltips, and floor cutaway view modes.

2. **Priority-Aware Flow Engine**:
   - **Emergency Max-Heap Priority Queue**: Urgency-scored (Level 1 to 5) with timestamp tie-breaking and dynamic priority escalation.
   - **Routine FIFO Queue**: Orderly scheduling for outpatient consultations.

3. **Smart Bed Allocation Engine**:
   - Algorithmic matching of patient acuity, required ward type, equipment, and floor proximity.

4. **Bi-directional Real-Time Events (Socket.IO)**:
   - Synchronizes bed status changes, emergency admissions, queue updates, and notifications across active clients.

5. **Role-Based Portals (RBAC)**:
   - Dedicated workflows for Superadmin, Hospital Operations Director, Emergency Physician, Charge Nurse, and Patient.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Three.js, `@react-three/fiber`, `@react-three/drei`, TailwindCSS, Lucide Icons, Recharts, `socket.io-client`.
- **Backend**: Node.js, Express, TypeScript, Socket.IO, `bcryptjs`, `jsonwebtoken`.
- **Database & ORM**: Prisma ORM with SQLite and PostgreSQL support.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Setup & Seed Database
npm --prefix backend run prisma:push
npm run db:seed

# 2. Run Engine Tests
npm run test

# 3. Start Backend API & WebSocket Server (Port 5000)
$env:NODE_PATH="backend/node_modules"; node backend/node_modules/tsx/dist/cli.mjs backend/src/server.ts

# 4. Start Next.js Frontend (Port 3000)
cd frontend
npm run start
```