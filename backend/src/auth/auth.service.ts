import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { UserRole } from "../types";
import { logAudit } from "../audit/audit.service";

const JWT_SECRET = process.env.JWT_SECRET || "smartcare-flow-hypersecure-jwt-secret-key-2025";
const TOKEN_EXPIRY = "24h";

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string | null;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export async function loginUser(email: string, passwordPlain: string, ipAddress?: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    departmentId: user.departmentId
  };

  const token = generateToken(payload);

  await logAudit("LOGIN", `User ${user.email} (${user.role}) authenticated successfully.`, user.id, ipAddress);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null
    }
  };
}

export async function registerUser(email: string, passwordPlain: string, name: string, role: UserRole = "PATIENT", departmentId?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
      departmentId: departmentId || null
    },
    include: { department: true }
  });

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    departmentId: user.departmentId
  };

  const token = generateToken(payload);
  await logAudit("USER_REGISTERED", `New user registered: ${user.email} with role ${user.role}`, user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null
    }
  };
}
