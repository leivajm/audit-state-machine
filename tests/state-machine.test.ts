import { describe, it, expect } from 'vitest';
import { transition, AuditState, AuditEvent } from '../src/state-machine';

describe('Audit State Machine Transition Function', () => {
    // --- Happy Paths ---

    it('should initialize correctly in "Pending" state', () => {
        const initialState: AuditState = {
            status: 'Pending',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        expect(initialState.status).toBe('Pending');
    });

    it('should transition from Pending to InProgress on START event', () => {
        const initialState: AuditState = {
            status: 'Pending',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        const event: AuditEvent = { type: 'START' };

        const newState = transition(initialState, event);

        expect(newState.status).toBe('InProgress');
    });

    it('should transition from InProgress to Completed on COMPLETE event', () => {
        const inProgressState: AuditState = {
            status: 'InProgress',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        const summary = 'All screenshots are up to date.';
        const event: AuditEvent = { type: 'COMPLETE', summary };

        const completedState = transition(inProgressState, event);

        expect(completedState.status).toBe('Completed');

        if (completedState.status === 'Completed') {
            expect(completedState.context.summary).toBe(summary);
        }
    });

    it('should transition from InProgress to Cancelled on CANCEL event', () => {
        const inProgressState: AuditState = {
            status: 'InProgress',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        const reason = 'User interrupted';
        const event: AuditEvent = { type: 'CANCEL', reason };

        const cancelledState = transition(inProgressState, event);

        expect(cancelledState.status).toBe('Cancelled');
        if (cancelledState.status === 'Cancelled') {
            expect(cancelledState.context.cancellationReason).toBe(reason);
        }
    });

    // --- Unhappy Paths & Business Rules ---

    it('should throw an error for an invalid event in a given state', () => {
        const pendingState: AuditState = {
            status: 'Pending',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        const event: AuditEvent = { type: 'COMPLETE', summary: 'This should not work' };

        expect(() => transition(pendingState, event)).toThrow(
            "Invalid transition: Cannot handle event 'COMPLETE' in state 'Pending'."
        );
    });

    it('should throw an error when completing an audit without a summary', () => {
        const inProgressState: AuditState = {
            status: 'InProgress',
            context: { id: 'test-audit-123', createdAt: new Date() },
        };
        const event: AuditEvent = { type: 'COMPLETE', summary: ' ' };

        expect(() => transition(inProgressState, event)).toThrow('A summary is required to complete the audit.');
    });

    it('should not transition from a terminal state like Completed', () => {
        const completedState: AuditState = {
            status: 'Completed',
            context: { id: 'test-audit-123', createdAt: new Date(), summary: 'Done.' },
        };
        const event: AuditEvent = { type: 'CANCEL' };

        const newState = transition(completedState, event);
        expect(newState.status).toBe('Completed');
        expect(newState).toEqual(completedState);
    });
});