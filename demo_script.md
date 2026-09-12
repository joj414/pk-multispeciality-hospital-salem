# SMARTCARE FLOW — HACKATHON DEMO SCRIPT & JUDGING WALKTHROUGH

> "Intelligent Hospital Operations. Faster Decisions. Better Patient Flow."

---

## 🎬 1. Executive Summary & Value Proposition (30 Seconds)
"Judges, hospitals today suffer from critical coordination delays: routine appointments clog acute triage lines, bed placement is managed on phone calls and static whiteboards, and operational bottlenecks remain invisible until lives are at risk.

We rebuilt the hospital operational flow from the ground up as **SmartCare Flow**: an interactive 3D WebGL Digital Twin platform powered by a **Priority-Aware Hospital Flow Engine**. It combines deterministic FIFO queuing for routine care with a true Max-Heap priority engine for acute trauma, automated spatial bed allocation, and real-time Socket.IO synchronization."

---

## 🏥 2. The 3D Digital Twin Experience (60 Seconds)
1. **Landing Page (`http://localhost:3000/`)**:
   - Show the 3D hospital hero with dynamic WebGL geometry, procedural lighting, and live KPI counters floating in 3D space.
   - Highlight **SDG 3 (Good Health & Well-Being)**: Reducing patient waiting waste, eliminating emergency bed placement latency, and maximizing clinical asset utilization.
   - Click **[ENTER COMMAND CENTER]**.

2. **3D Hospital Command Center (`/dashboard`)**:
   - **Interactive OrbitControls**: Rotate 360°, zoom into wards, pan along floor corridors.
   - **Floor-by-Floor Cutaway**:
     - Click **Floor 1**: Floors 2 and 3 smoothly lift up, revealing Emergency Resuscitation, Reception Triage, and Diagnostics bays.
     - Click **Floor 2**: Explodes Floor 3 upward, isolating ICU glass pods and General inpatient rooms.
     - Click **Floor 3**: Focuses on Pediatrics and Neurology isolation suites.
   - **Hover over 3D Beds**:
     - Hover over any bed to see its 3D floating tooltip: Bed Code, Status, and Patient Name.
     - Note the color-coded glowing LED beacons:
       - 🟢 **Emerald**: Available
       - 🔴 **Crimson**: Occupied
       - 🟠 **Amber**: Reserved
       - 🔵 **Sky Blue**: Under Sanitization
       - ⚪ **Slate**: Maintenance

---

## ⚡ 3. The Grand Hackathon Demonstration: "RUN LIVE SIMULATION" (90 Seconds)
Click the prominent **[RUN LIVE SIMULATION]** button at the bottom of the Command Center. Watch the automated 6-phase sequence play out live with zero page refreshes:

1. **Phase 1 (T=0s) — EMS Inbound**:
   - Sound and red-orange flashing **Emergency Beacon** strobe triggers at Emergency Bay 1 entrance.
   - Strobe lighting pulses through the 3D environment.
2. **Phase 2 (T=2.5s) — Registration & Max-Heap Triage Escalation**:
   - Inbound acute cardiac arrest patient (Marcus Thorne, 48M) is registered with Priority 5.
   - Patient pre-empts standard queue slots and jumps instantly to rank #1.
3. **Phase 3 (T=5s) — Priority Queue Enqueue**:
   - WebSocket emits `queue.updated`; top queue ticket flashes across all clinical terminals.
4. **Phase 4 (T=7.5s) — Smart Bed Engine Activation**:
   - Engine scans available beds, matching acuity score, nearest ambulance access, and equipment.
5. **Phase 5 (T=9.5s) — Automated 3D Camera Glide & Bed Reservation**:
   - The 3D camera smoothly glides through the hospital, ascending to the exact floor and room where the target bed is located.
   - Bed LED transitions from Available (Green) to Reserved (Amber).
6. **Phase 6 (T=12.5s) — Admission & Real-Time Sync**:
   - Bed turns Occupied (Red).
   - Top KPI counters update (Occupied +1, Available -1, Emergency +1).
   - Activity stream and Audit Log record `BED_ALLOCATED` and `PATIENT_ADMITTED`.

---

## 🔄 4. Priority Queue vs. FIFO Queue Engine (`/queue`)
1. Navigate to `/queue`.
2. Inspect the **Emergency Priority Queue (Max-Heap)** side-by-side with the **Outpatient FIFO Queue**.
3. **Interactive Test**:
   - Click the **↑ Up Arrow** on a patient with Priority 2: watch them immediately bubble up to the top of the queue via the Max-Heap data structure.
   - Click **[Call Next Patient]**: the system announces the next candidate and triggers consultation status transitions.

---

## 🛏️ 5. Bed Management Matrix (`/beds`)
1. Navigate to `/beds`.
2. Filter by Floor (Floor 1, 2, or 3) and Status (Available, Occupied, Cleaning).
3. Click any bed card to open the **Bed Action Modal**:
   - Allocate to an unassigned patient.
   - Trigger status transitions: Available → Reserved → Occupied → Cleaning.
   - Click **Discharge & Send to Cleaning**: Bed turns sky blue and is added to the nurse sanitization queue.

---

## 📊 6. Hospital Operations Analytics (`/analytics`)
1. Navigate to `/analytics`.
2. Review the interactive Recharts visualizations:
   - **Department Utilization %**: ICU, Emergency, and Cardiology occupancy bars.
   - **Hourly Flow & Wait Time Trend**: Visualizing peak admission hours vs. triage response minutes.
   - **Bed Census Pie Chart**: Breakdown of available vs. occupied vs. cleaning beds.

---

## 🔐 7. Multi-Role RBAC & Audit Trail (`/login` & `/admin/dashboard`)
1. Navigate to `/login`.
2. Test **1-Click Demo Personas**:
   - **Dr. Marcus Chen (Doctor)**: View `/doctor/dashboard` to see the active consultation room, call next patient, and complete examinations.
   - **Nurse Sarah (Nurse)**: View `/nurse/dashboard` to process bed turnover and mark sanitized beds ready.
   - **David Miller (Patient)**: View `/patient/dashboard` to check personal queue ticket, wait time, and department directions.
   - **Superadmin**: View `/admin/dashboard` to verify the tamper-evident audit ledger and system diagnostics.