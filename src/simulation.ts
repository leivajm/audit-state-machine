import { AuditWorkflow } from './state-machine';

function runSuccessfulAudit() {
    console.log('--- Running Simulation: Successful Audit Flow ---');
    try {
        const audit = new AuditWorkflow('AUD-001');
        console.log('Current state:', audit.getAudit().state);

        audit.start();
        console.log('Current state:', audit.getAudit().state);

        audit.complete('All screenshots verified and updated.');
        console.log('Current state:', audit.getAudit().state);

        console.log('Final Audit Data:', audit.getAudit());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('An unexpected error occurred:', errorMessage);
    }
    console.log('--- End of Simulation ---\n');
}

function runInvalidTransition() {
    console.log('--- Running Simulation: Invalid Transition Flow ---');
    try {
        const audit = new AuditWorkflow('AUD-002');
        console.log('Current state:', audit.getAudit().state);

        console.log('Attempting to complete an audit that has not started...');
        audit.complete('This should fail.');

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('CAUGHT EXPECTED ERROR:', errorMessage);
    }
    console.log('--- End of Simulation ---\n');
}

runSuccessfulAudit();
runInvalidTransition();