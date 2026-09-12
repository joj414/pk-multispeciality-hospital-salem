export type UserRole = "ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST" | "PATIENT";

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "MAINTENANCE";

export type BedType = "ICU" | "EMERGENCY" | "GENERAL" | "PRIVATE" | "PEDIATRIC" | "ISOLATION";

export type AppointmentStatus = "BOOKED" | "WAITING" | "CALLED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type QueueType = "FIFO" | "PRIORITY";

export type NotificationType = "INFO" | "WARNING" | "EMERGENCY" | "SUCCESS";

export interface QueueItem {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  departmentId: string;
  departmentName?: string;
  priorityScore: number; // 1 (Routine) to 5 (Critical)
  queueType: QueueType;
  status: "WAITING" | "CALLED" | "SERVICED" | "CANCELLED";
  enqueuedAt: Date;
  estimatedWaitMin: number;
}

export interface BedAllocationRequest {
  patientId: string;
  requiredType?: BedType;
  departmentId?: string;
  isEmergency?: boolean;
  priorityScore?: number;
  allocatedBy?: string;
  reason?: string;
}

export interface HospitalKPIs {
  totalPatients: number;
  todayAppointments: number;
  waitingPatients: number;
  emergencyCases: number;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  cleaningBeds: number;
  maintenanceBeds: number;
  bedOccupancyRate: number; // percentage e.g. 64.5%
  doctorsAvailable: number;
  activeDoctorsTotal: number;
}
