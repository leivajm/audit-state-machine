# Audit Workflow State Machine

This project is a simple implementation of an "Audit" workflow as a state machine in TypeScript, created for a technical assessment.

The primary goal is to showcase how to model business logic, represent states, enforce transition rules, and test system behavior in a clear, predictable, and maintainable way using a functional approach.

---

## Core Concepts

This implementation follows a functional approach to ensure **type safety**, **immutability**, and **predictability**.

* **Type-Safe States**: States (`Pending`, `InProgress`, `Completed`) and their associated data are modeled using a TypeScript **discriminated union**. This makes invalid states unrepresentable at compile time (e.g., a `Pending` state cannot have a `summary`).

* **Pure Transition Function**: All business logic is centralized in a single, **pure `transition` function**. It takes the current `state` and an `event` object, and returns a new, immutable state, without side effects.

* **Event-Driven Logic**: State changes are driven by explicit **event objects** (e.g., `{ type: 'START' }`), which makes the system's behavior clear and easy to audit.

* **Separation of Concerns**: The core logic is completely decoupled from side effects like logging. The code that *uses* the state machine is responsible for these effects, making the core logic highly testable and reusable.

---

## Prerequisites

* Node.js (v18 or later)
* npm

---

## Installation

Clone the repository and install the development dependencies:

```bash
git clone https://github.com/leivajm/audit-state-machine.git
cd audit-state-machine
npm install
```

---

## How to Run

### 1. Run the Simulation

To see a demonstration of the state machine in action (including both a successful flow and a handled error), run:

```bash
npm run start
```

This will execute the `src/simulation.ts` script.

### 2. Run the Tests

To validate the behavior of the state machine with unit tests, run:

```bash
npm test
```

This will execute the test suite in the `tests/` directory using **Vitest**. It covers both valid ("happy path") and invalid ("unhappy path") transitions to ensure the business rules are correctly enforced.

---

## Considerations for Production and Scalability

The self-contained state machine in this repository is ideal for defining and testing the fundamental business logic of an Audit in a clear and deterministic way. However, for a production system that needs to process thousands of concurrent audits, or a single audit composed of thousands of internal transactions, the architecture would naturally evolve towards an **event-driven** model to ensure scalability, resilience, and traceability.

My vision for this evolution would include the following principles:

* **Event-Driven Orchestration**: A "Dispatcher" service (e.g., AWS Lambda) would divide a large `Audit` into individual tasks. Each task would be published as an event to a message queue (e.g., **AWS SQS** or **Google Pub/Sub**). This decouples the initiation of work from its execution.

* **Parallel and Decoupled Workers**: Serverless functions ("Workers") would listen to the event queue. Each function would process a single task independently, allowing for massive, parallel processing. If one task fails, it does not affect the others.

* **Task-Level State Persistence**: The state of each individual task (not just the overall `Audit`) would be stored in a NoSQL database like **DynamoDB** or **Firestore**. This allows for retries, granular auditing, and the creation of a real-time progress dashboard.

* **Observability and Resilience**: Every step of the process would generate structured logs and metrics. The design of the workers would be **idempotent**, ensuring that a task can be safely retried without causing side effects.

It's important to note that the pure logic of the `transition` function implemented here would remain the core brain within each "worker," ensuring that business rules are applied consistently regardless of the architecture's scale.
