import { prisma } from "../db";

export async function getAllDoctors(departmentId?: string, isAvailable?: boolean) {
  const where: any = {};
  if (departmentId) where.departmentId = departmentId;
  if (isAvailable !== undefined) where.isAvailable = isAvailable;

  return await prisma.doctor.findMany({
    where,
    include: {
      department: true,
      appointments: {
        where: { status: { in: ["WAITING", "CALLED", "IN_PROGRESS"] } },
        include: { patient: true }
      }
    },
    orderBy: { name: "asc" }
  });
}

export async function getDoctorById(id: string) {
  return await prisma.doctor.findUnique({
    where: { id },
    include: {
      department: true,
      appointments: {
        include: { patient: true },
        orderBy: { time: "asc" }
      }
    }
  });
}

export async function updateDoctorAvailability(id: string, isAvailable: boolean) {
  return await prisma.doctor.update({
    where: { id },
    data: { isAvailable }
  });
}
