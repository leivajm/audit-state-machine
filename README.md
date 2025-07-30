# Audit Workflow State Machine

This project is a simple implementation of an "Audit" workflow as a state machine in TypeScript, as part of a technical assessment.

The primary goal is to showcase how to model business logic, represent states, enforce transition rules, and test system behavior in a clear and maintainable way.

## Core Concepts

-   **State Representation**: States (`Pending`, `InProgress`, `Completed`, `Cancelled`) are represented using a TypeScript `union type` for type safety.
-   **Encapsulation**: The entire workflow logic is encapsulated within the `AuditWorkflow` class, which manages the internal state and exposes methods for transitions (`start()`, `complete()`, `cancel()`).
-   **Business Rules**: Each transition method validates if the move is legal based on the current state. Invalid transitions throw descriptive errors.
-   **Observability**: Each state transition logs its action to the console, simulating a logging or event-emitting mechanism.

## Prerequisites

-   Node.js (v18 or later)
-   npm

## Installation

Clone the repository and install the development dependencies:

```bash
git clone https://github.com/leivajm/audit-state-machine.git
cd audit-state-machine
npm install
```

## How to Run

### 1. Run the Simulation

To see a demonstration of the state machine in action (including both a successful flow and a handled error), run:

```bash
npm start
```

This will execute the `src/simulation.ts` script using `ts-node`.

### 2. Run the Tests

To validate the behavior of the state machine with unit tests, run:

```bash
npm test
```

This will execute the test suite located in `tests/` using **Vitest**. It covers both valid ("happy path") and invalid ("unhappy path") transitions to ensure the business rules are correctly enforced.