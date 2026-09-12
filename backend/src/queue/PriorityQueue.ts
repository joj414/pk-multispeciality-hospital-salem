import { QueueItem } from "../types";

/**
 * High-performance Max-Heap Priority Queue for Emergency and Triage Patient Scheduling.
 * Evaluates priorityScore (5: Critical, 1: Minor) with timestamp tie-breaking (FIFO for equal priorities).
 */
export class PriorityQueueEngine {
  private heap: QueueItem[] = [];

  constructor(initialItems?: QueueItem[]) {
    if (initialItems && initialItems.length > 0) {
      for (const item of initialItems) {
        this.enqueue(item);
      }
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): QueueItem | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public enqueue(item: QueueItem): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public dequeue(): QueueItem | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return top;
  }

  public updatePriority(itemIdOrPatientId: string, newPriority: number): boolean {
    const index = this.heap.findIndex(
      (item) => item.id === itemIdOrPatientId || item.patientId === itemIdOrPatientId
    );

    if (index === -1) return false;

    const oldPriority = this.heap[index].priorityScore;
    this.heap[index].priorityScore = newPriority;

    if (newPriority > oldPriority) {
      this.bubbleUp(index);
    } else if (newPriority < oldPriority) {
      this.bubbleDown(index);
    }

    return true;
  }

  public queuePosition(itemIdOrPatientId: string): number {
    const sorted = this.getAllSorted();
    const idx = sorted.findIndex(
      (item) => item.id === itemIdOrPatientId || item.patientId === itemIdOrPatientId
    );
    return idx === -1 ? -1 : idx + 1;
  }

  public getAllSorted(): QueueItem[] {
    // Clone heap and sort by priorityScore DESC, then enqueuedAt ASC
    return [...this.heap].sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.enqueuedAt).getTime() - new Date(b.enqueuedAt).getTime();
    });
  }

  public remove(itemId: string): boolean {
    const index = this.heap.findIndex((item) => item.id === itemId);
    if (index === -1) return false;

    if (index === this.heap.length - 1) {
      this.heap.pop();
      return true;
    }

    this.heap[index] = this.heap.pop()!;
    this.bubbleDown(index);
    this.bubbleUp(index);
    return true;
  }

  public clear(): void {
    this.heap = [];
  }

  private compare(i: number, j: number): number {
    const a = this.heap[i];
    const b = this.heap[j];

    if (a.priorityScore !== b.priorityScore) {
      return a.priorityScore - b.priorityScore; // higher is better
    }
    // For tie-breaking, earlier time has higher priority
    return new Date(b.enqueuedAt).getTime() - new Date(a.enqueuedAt).getTime();
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(index, parent) > 0) {
        this.swap(index, parent);
        index = parent;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let largest = index;

      if (left < length && this.compare(left, largest) > 0) {
        largest = left;
      }

      if (right < length && this.compare(right, largest) > 0) {
        largest = right;
      }

      if (largest !== index) {
        this.swap(index, largest);
        index = largest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
