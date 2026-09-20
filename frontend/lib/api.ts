import { Bed, BedStatus, Department, Doctor, Patient, Appointment, QueueItem, HospitalKPIs, NotificationItem, AuditLogItem } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "" : "http://localhost:5000");

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("smartcare_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.error || `HTTP ${response.status}: Failed request to ${endpoint}`);
  }

  return json.data !== undefined ? json.data : json;
}

// 1. Auth API
export async function apiLogin(email: string, passwordPlain: string) {
  return request<{ token: string; user: any }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: passwordPlain })
  });
}

// 2. Beds API
export async function apiGetBeds(params?: { floor?: number; departmentId?: string; status?: string }): Promise<Bed[]> {
  const query = new URLSearchParams();
  if (params?.floor) query.append("floor", params.floor.toString());
  if (params?.departmentId) query.append("departmentId", params.departmentId);
  if (params?.status) query.append("status", params.status);
  return request<Bed[]>(`/api/beds?${query.toString()}`);
}

export async function apiUpdateBedStatus(id: string, status: BedStatus, notes?: string): Promise<Bed> {
  return request<Bed>(`/api/beds/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes })
  });
}

export async function apiAllocateBed(data: {
  patientId: string;
  requiredType?: string;
  departmentId?: string;
  isEmergency?: boolean;
  priorityScore?: number;
  allocatedBy?: string;
  reason?: string;
}) {
  return request<{ success: boolean; bed: Bed; allocation: any; engineMessage: string }>("/api/beds/allocate", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function apiReleaseBed(bedId: string, setToCleaning: boolean = true): Promise<Bed> {
  return request<Bed>("/api/beds/release", {
    method: "POST",
    body: JSON.stringify({ bedId, setToCleaning })
  });
}

// 3. Patients API
export async function apiGetPatients(params?: { search?: string; departmentId?: string; isEmergency?: boolean }): Promise<Patient[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.departmentId) query.append("departmentId", params.departmentId);
  if (params?.isEmergency !== undefined) query.append("isEmergency", params.isEmergency.toString());
  return request<Patient[]>(`/api/patients?${query.toString()}`);
}

export async function apiCreatePatient(data: Partial<Patient>): Promise<Patient> {
  return request<Patient>("/api/patients", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

// 4. Appointments API
export async function apiGetAppointments(params?: { date?: string; departmentId?: string; doctorId?: string; status?: string }): Promise<Appointment[]> {
  const query = new URLSearchParams();
  if (params?.date) query.append("date", params.date);
  if (params?.departmentId) query.append("departmentId", params.departmentId);
  if (params?.doctorId) query.append("doctorId", params.doctorId);
  if (params?.status) query.append("status", params.status);
  return request<Appointment[]>(`/api/appointments?${query.toString()}`);
}

export async function apiCreateAppointment(data: any): Promise<Appointment> {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function apiUpdateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  return request<Appointment>(`/api/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

// 5. Queue API
export async function apiGetQueue(departmentId?: string): Promise<QueueItem[]> {
  const query = departmentId ? `?departmentId=${departmentId}` : "";
  return request<QueueItem[]>(`/api/queue${query}`);
}

export async function apiEnqueuePatient(data: { patientId: string; departmentId: string; priorityScore?: number; isEmergency?: boolean }) {
  return request<any>("/api/queue", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function apiCallNextPatient(departmentId?: string, doctorName?: string) {
  return request<QueueItem | null>("/api/queue/call-next", {
    method: "POST",
    body: JSON.stringify({ departmentId, doctorName })
  });
}

export async function apiUpdateQueuePriority(id: string, priorityScore: number) {
  return request<any>(`/api/queue/${id}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priorityScore })
  });
}

// 6. Analytics & KPIs
export async function apiGetKPIs(): Promise<HospitalKPIs> {
  return request<HospitalKPIs>("/api/analytics/kpis");
}

export async function apiGetAnalytics(): Promise<any> {
  return request<any>("/api/analytics");
}

// 7. Departments & Doctors
export async function apiGetDepartments(): Promise<Department[]> {
  return request<Department[]>("/api/departments");
}

export async function apiGetDoctors(departmentId?: string): Promise<Doctor[]> {
  const query = departmentId ? `?departmentId=${departmentId}` : "";
  return request<Doctor[]>(`/api/doctors${query}`);
}

// 8. Notifications & Audit
export async function apiGetNotifications(): Promise<NotificationItem[]> {
  return request<NotificationItem[]>("/api/notifications");
}

export async function apiGetAuditLogs(): Promise<AuditLogItem[]> {
  return request<AuditLogItem[]>("/api/audit");
}

// 9. Simulation
export async function apiRunSimulation(): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>("/api/simulation/run", {
    method: "POST"
  });
}

// 10. Global Search
export async function apiSearchGlobal(q: string) {
  return request<{ patients: Patient[]; doctors: Doctor[]; beds: Bed[]; departments: Department[] }>(`/api/search?q=${encodeURIComponent(q)}`);
}