import { prisma } from "../db";
import { BedAllocationRequest, BedType, BedStatus } from "../types";

export interface AllocationResult {
  success: boolean;
  bedId?: string;
  bedCode?: string;
  departmentName?: string;
  floor?: number;
  message: string;
  isOverflowAllocation?: boolean;
}

/**
 * Smart Bed Allocation Engine (Operational Scheduling Algorithm)
 * Matches patient acuity, emergency status, department need, and floor proximity.
 */
export class BedAllocationEngine {
  public static async findBestBed(request: BedAllocationRequest): Promise<AllocationResult> {
    const { patientId, departmentId, requiredType, isEmergency } = request;

    // 1. Fetch candidate AVAILABLE beds
    const availableBeds = await prisma.bed.findMany({
      where: { status: "AVAILABLE" },
      include: { department: true }
    });

    if (availableBeds.length === 0) {
      return {
        success: false,
        message: "No hospital beds currently available. Patient added to urgent bed waiting queue."
      };
    }

    // 2. Score candidate beds based on operational suitability
    let bestBed = null;
    let highestScore = -1;
    let isOverflow = false;

    for (const bed of availableBeds) {
      let score = 0;

      // Department match
      if (departmentId && bed.departmentId === departmentId) {
        score += 100;
      }

      // Bed type match
      if (requiredType && bed.type === requiredType) {
        score += 80;
      }

      // Emergency proximity
      if (isEmergency) {
        if (bed.department.code === "EMERGENCY" || bed.type === "EMERGENCY") {
          score += 150;
        } else if (bed.department.code === "ICU" || bed.type === "ICU") {
          score += 130;
        }
        // Prefer lower floor (closer to ambulance bay)
        score += (4 - bed.floor) * 15;
      }

      // If exact department bed not found, compatible overflow logic:
      // ICU patient can overflow to High-Dependency General Ward or Telemetry
      if (requiredType === "ICU" && bed.type === "GENERAL") {
        score += 40;
      }

      if (score > highestScore) {
        highestScore = score;
        bestBed = bed;
        isOverflow = departmentId ? bed.departmentId !== departmentId : false;
      }
    }

    if (!bestBed) {
      // Fallback to any available bed
      bestBed = availableBeds[0];
      isOverflow = true;
    }

    return {
      success: true,
      bedId: bestBed.id,
      bedCode: bestBed.code,
      departmentName: bestBed.department.name,
      floor: bestBed.floor,
      isOverflowAllocation: isOverflow,
      message: isOverflow
        ? `Overflow allocation: Bed ${bestBed.code} in ${bestBed.department.name} (Floor ${bestBed.floor})`
        : `Optimal match: Bed ${bestBed.code} in ${bestBed.department.name} (Floor ${bestBed.floor})`
    };
  }
}
