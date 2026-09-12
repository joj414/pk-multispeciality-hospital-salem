import { PriorityQueueEngine } from "../queue/PriorityQueue";
import { QueueItem } from "../types";
import { generateToken, verifyToken, AuthPayload } from "../auth/auth.service";

console.log("============================================================");
console.log("🧪 RUNNING SMARTCARE FLOW CORE ENGINE TESTS");
console.log("============================================================");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  // Test 1: Priority Queue Max-Heap ordering
  console.log("\n--- TEST SUITE 1: Priority Queue Engine (Max-Heap) ---");
  const pq = new PriorityQueueEngine();

  const t1 = new Date(Date.now() - 3000);
  const t2 = new Date(Date.now() - 2000);
  const t3 = new Date(Date.now() - 1000);

  const itemRoutine: QueueItem = {
    id: "q-1",
    ticketNumber: "Q-001",
    patientId: "P000001",
    patientName: "Alice Routine",
    departmentId: "dept-gen",
    priorityScore: 1,
    queueType: "FIFO",
    status: "WAITING",
    enqueuedAt: t1,
    estimatedWaitMin: 35
  };

  const itemUrgent: QueueItem = {
    id: "q-2",
    ticketNumber: "Q-002",
    patientId: "P000002",
    patientName: "Bob Urgent",
    departmentId: "dept-gen",
    priorityScore: 3,
    queueType: "PRIORITY",
    status: "WAITING",
    enqueuedAt: t2,
    estimatedWaitMin: 20
  };

  const itemCritical: QueueItem = {
    id: "q-3",
    ticketNumber: "EM-001",
    patientId: "P000003",
    patientName: "Charlie Critical",
    departmentId: "dept-emerg",
    priorityScore: 5,
    queueType: "PRIORITY",
    status: "WAITING",
    enqueuedAt: t3,
    estimatedWaitMin: 0
  };

  pq.enqueue(itemRoutine);
  pq.enqueue(itemUrgent);
  pq.enqueue(itemCritical);

  assert(pq.size() === 3, "Queue size should be 3");
  assert(pq.peek()?.id === "q-3", "Highest priority (5 - Critical) should peek at top");
  assert(pq.queuePosition("q-3") === 1, "Critical patient rank should be #1");
  assert(pq.queuePosition("q-2") === 2, "Urgent patient rank should be #2");
  assert(pq.queuePosition("q-1") === 3, "Routine patient rank should be #3");

  // Test Dequeue in strict priority order
  const dequeued1 = pq.dequeue();
  assert(dequeued1?.id === "q-3", "First dequeued must be Critical (Priority 5)");

  const dequeued2 = pq.dequeue();
  assert(dequeued2?.id === "q-2", "Second dequeued must be Urgent (Priority 3)");

  const dequeued3 = pq.dequeue();
  assert(dequeued3?.id === "q-1", "Third dequeued must be Routine (Priority 1)");
  assert(pq.isEmpty(), "Queue should be empty after dequeuing all");

  // Test 2: Priority Escalation & Dynamic Rebalancing
  console.log("\n--- TEST SUITE 2: Dynamic Queue Priority Escalation ---");
  const pqDynamic = new PriorityQueueEngine();
  pqDynamic.enqueue({ ...itemRoutine, id: "dyn-1", priorityScore: 1 });
  pqDynamic.enqueue({ ...itemUrgent, id: "dyn-2", priorityScore: 2 });

  assert(pqDynamic.peek()?.id === "dyn-2", "Item with priority 2 should peek first");

  // Patient 1 condition deteriorates -> Escalate priority from 1 to 5
  pqDynamic.updatePriority("dyn-1", 5);
  assert(pqDynamic.peek()?.id === "dyn-1", "Escalated patient should immediately jump to top (#1)");
  assert(pqDynamic.queuePosition("dyn-1") === 1, "dyn-1 rank should be 1 after escalation");

  // Test 3: JWT Authentication & RBAC Payloads
  console.log("\n--- TEST SUITE 3: Security & RBAC Token Generation ---");
  const testPayload: AuthPayload = {
    userId: "usr-test-123",
    email: "dr.chen@smartcare.com",
    name: "Dr. Marcus Chen",
    role: "DOCTOR",
    departmentId: "dept-emerg"
  };

  const token = generateToken(testPayload);
  assert(typeof token === "string" && token.length > 20, "JWT token generated successfully");

  const decoded = verifyToken(token);
  assert(decoded.userId === testPayload.userId, "Decoded token matches userId");
  assert(decoded.role === "DOCTOR", "Decoded token role matches DOCTOR");
  assert(decoded.email === testPayload.email, "Decoded token matches email");

  console.log("\n============================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});