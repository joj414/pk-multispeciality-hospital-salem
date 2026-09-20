export type UserRole = "ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST" | "PATIENT";
export type BedStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "MAINTENANCE";
export type BedType = "ICU" | "EMERGENCY" | "GENERAL" | "PRIVATE" | "PEDIATRIC" | "ISOLATION";

export interface Department {
  id: string;
  name: string;
  code: string;
  floor: number;
  description?: string;
  totalBeds: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  isEmergency: boolean;
  departmentId?: string;
  department?: Department;
  status: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  roomNumber: string;
  isAvailable: boolean;
  departmentId: string;
  department?: Department;
}

export interface Bed {
  id: string;
  code: string;
  departmentId: string;
  department?: Department;
  floor: number;
  room: string;
  type: BedType;
  status: BedStatus;
  positionX: number;
  positionY: number;
  positionZ: number;
  currentPatientId?: string | null;
  currentPatient?: Patient | null;
  lastUpdated?: string;
}

export interface QueueItem {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  departmentId: string;
  departmentName?: string;
  priorityScore: number;
  queueType: "FIFO" | "PRIORITY";
  status: "WAITING" | "CALLED" | "SERVICED" | "CANCELLED";
  enqueuedAt: string;
  estimatedWaitMin: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  departmentId: string;
  department?: Department;
  date: string;
  time: string;
  type: string;
  priority: number;
  isEmergency: boolean;
  reason: string;
  status: string;
  createdAt?: string;
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
  bedOccupancyRate: number;
  doctorsAvailable: number;
  activeDoctorsTotal: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "EMERGENCY" | "SUCCESS";
  targetRole: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  userId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}