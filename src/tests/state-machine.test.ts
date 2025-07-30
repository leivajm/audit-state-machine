import { describe, it, expect, beforeEach } from 'vitest';
import { AuditWorkflow } from '../state-machine';

describe('AuditWorkflow', () => {
    let workflow: AuditWorkflow;

    beforeEach(() => {
        workflow = new AuditWorkflow('test-audit-123');
    });

    it('should initialize in "Pending" state', () => {
        const audit = workflow.getAudit();
        expect(audit.state).toBe('Pending');
    });

    // --- Happy Paths  ---
    it('should transition from Pending to InProgress', () => {
        workflow.start();
        const audit = workflow.getAudit();
        expect(audit.state).toBe('InProgress');
    });

    it('should transition from InProgress to Completed with a summary', () => {
        workflow.start();
        const summary = 'All screenshots are up to date.';
        workflow.complete(summary);
        const audit = workflow.getAudit();
        expect(audit.state).toBe('Completed');
        expect(audit.data.summary).toBe(summary);
    });

    it('should transition from Pending to Cancelled', () => {
        workflow.cancel('No longer needed');
        const audit = workflow.getAudit();
        expect(audit.state).toBe('Cancelled');
        expect(audit.data.cancellationReason).toBe('No longer needed');
    });

    it('should transition from InProgress to Cancelled', () => {
        workflow.start();
        workflow.cancel('User interrupted');
        const audit = workflow.getAudit();
        expect(audit.state).toBe('Cancelled');
    });


    // --- Unhappy Paths ---
    it('should throw an error when trying to start an audit that is not Pending', () => {
        workflow.start();
        expect(() => workflow.start()).toThrow("Cannot start audit in state 'InProgress'. Must be 'Pending'.");
    });

    it('should throw an error when trying to complete an audit that is not InProgress', () => {
        expect(() => workflow.complete('summary')).toThrow("Cannot complete audit in state 'Pending'. Must be 'InProgress'.");
    });

    it('should throw an error when completing an audit without a summary', () => {
        workflow.start();
        expect(() => workflow.complete(' ')).toThrow('A summary is required to complete the audit.');
    });

    it('should throw an error when trying to cancel a Completed audit', () => {
        workflow.start();
        workflow.complete('Done.');
        expect(() => workflow.cancel()).toThrow("Cannot cancel audit in a terminal state ('Completed').");
    });
});