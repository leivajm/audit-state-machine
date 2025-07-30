import { transition, AuditState, AuditEvent } from './state-machine';

function logState(state: AuditState) {
    console.log(`[Simulation] Current state: ${state.status}`, state.context);
}

function runSuccessfulAudit() {
    console.log('--- Running Simulation: Successful Audit Flow ---');
    try {
        let currentState: AuditState = {
            status: 'Pending',
            context: { id: 'AUD-001', createdAt: new Date() },
        };
        logState(currentState);

        console.log("\nDispatching event: { type: 'START' }");
        currentState = transition(currentState, { type: 'START' });
        logState(currentState);

        console.log("\nDispatching event: { type: 'COMPLETE', summary: '...' }");
        currentState = transition(currentState, {
            type: 'COMPLETE',
            summary: 'All screenshots verified and updated.',
        });
        logState(currentState);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('An unexpected error occurred:', errorMessage);
    }
    console.log('--- End of Simulation ---\n');
}

function runInvalidTransition() {
    console.log('--- Running Simulation: Invalid Transition Flow ---');
    try {
        let currentState: AuditState = {
            status: 'Pending',
            context: { id: 'AUD-002', createdAt: new Date() },
        };
        logState(currentState);

        console.log("\nDispatching invalid event: { type: 'COMPLETE', summary: '...' }");
        currentState = transition(currentState, {
            type: 'COMPLETE',
            summary: 'This should fail.',
        });
        logState(currentState);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('CAUGHT EXPECTED ERROR:', errorMessage);
    }
    console.log('--- End of Simulation ---\n');
}

runSuccessfulAudit();
runInvalidTransition();