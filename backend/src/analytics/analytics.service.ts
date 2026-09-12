import { prisma } from "../db";
import { HospitalKPIs } from "../types";

export async function getHospitalKPIs(): Promise<HospitalKPIs> {
  const [
    totalPatients,
    todayAppointments,
    waitingPatients,
    emergencyCases,
    totalBeds,
    availableBeds,
    occupiedBeds,
    reservedBeds,
    cleaningBeds,
    maintenanceBeds,
    doctorsAvailable,
    activeDoctorsTotal
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count({ where: { date: "2026-09-12" } }),
    prisma.queueEntry.count({ where: { status: "WAITING" } }),
    prisma.patient.count({ where: { isEmergency: true } }),
    prisma.bed.count(),
    prisma.bed.count({ where: { status: "AVAILABLE" } }),
    prisma.bed.count({ where: { status: "OCCUPIED" } }),
    prisma.bed.count({ where: { status: "RESERVED" } }),
    prisma.bed.count({ where: { status: "CLEANING" } }),
    prisma.bed.count({ where: { status: "MAINTENANCE" } }),
    prisma.doctor.count({ where: { isAvailable: true } }),
    prisma.doctor.count()
  ]);

  const bedOccupancyRate = totalBeds > 0
    ? Math.round(((occupiedBeds + reservedBeds) / totalBeds) * 1000) / 10
    : 0;

  return {
    totalPatients,
    todayAppointments,
    waitingPatients,
    emergencyCases,
    totalBeds,
    availableBeds,
    occupiedBeds,
    reservedBeds,
    cleaningBeds,
    maintenanceBeds,
    bedOccupancyRate,
    doctorsAvailable,
    activeDoctorsTotal
  };
}

export async function getAnalyticsData() {
  const kpis = await getHospitalKPIs();

  // Bed occupancy by department
  const departments = await prisma.department.findMany({
    include: {
      beds: true,
      doctors: true
    }
  });

  const departmentUtilization = departments.map((d) => {
    const total = d.beds.length;
    const occupied = d.beds.filter((b) => b.status === "OCCUPIED" || b.status === "RESERVED").length;
    const available = d.beds.filter((b) => b.status === "AVAILABLE").length;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return {
      departmentId: d.id,
      name: d.name,
      code: d.code,
      floor: d.floor,
      totalBeds: total,
      occupiedBeds: occupied,
      availableBeds: available,
      utilizationRate: rate,
      doctorCount: d.doctors.length
    };
  });

  // Hourly patient traffic distribution (synthetic/realistic)
  const hourlyFlow = [
    { hour: "00:00", emergency: 4, routine: 0, triageAvgWait: 6 },
    { hour: "02:00", emergency: 3, routine: 0, triageAvgWait: 5 },
    { hour: "04:00", emergency: 5, routine: 0, triageAvgWait: 8 },
    { hour: "06:00", emergency: 6, routine: 2, triageAvgWait: 10 },
    { hour: "08:00", emergency: 8, routine: 18, triageAvgWait: 14 },
    { hour: "10:00", emergency: 9, routine: 25, triageAvgWait: 22 },
    { hour: "12:00", emergency: 7, routine: 20, triageAvgWait: 18 },
    { hour: "14:00", emergency: 10, routine: 22, triageAvgWait: 24 },
    { hour: "16:00", emergency: 11, routine: 15, triageAvgWait: 19 },
    { hour: "18:00", emergency: 8, routine: 8, triageAvgWait: 15 },
    { hour: "20:00", emergency: 7, routine: 2, triageAvgWait: 11 },
    { hour: "22:00", emergency: 5, routine: 1, triageAvgWait: 9 }
  ];

  // Bed status distribution
  const bedStatusDistribution = [
    { name: "Available", value: kpis.availableBeds, color: "#10B981" },
    { name: "Occupied", value: kpis.occupiedBeds, color: "#EF4444" },
    { name: "Reserved", value: kpis.reservedBeds, color: "#F59E0B" },
    { name: "Cleaning", value: kpis.cleaningBeds, color: "#0EA5E9" },
    { name: "Maintenance", value: kpis.maintenanceBeds, color: "#64748B" }
  ];

  return {
    kpis,
    departmentUtilization,
    hourlyFlow,
    bedStatusDistribution
  };
}
