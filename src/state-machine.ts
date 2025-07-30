export interface AuditContext {
    readonly id: string;
    readonly createdAt: Date;
    readonly summary?: string;
    readonly cancellationReason?: string;
}

export type AuditState =
    | { readonly status: 'Pending'; readonly context: Pick<AuditContext, 'id' | 'createdAt'> }
    | { readonly status: 'InProgress'; readonly context: Pick<AuditContext, 'id' | 'createdAt'> }
    | { readonly status: 'Completed'; readonly context: Required<Pick<AuditContext, 'id' | 'createdAt' | 'summary'>> }
    | { readonly status: 'Cancelled'; readonly context: Pick<AuditContext, 'id' | 'createdAt' | 'cancellationReason'> };

export type AuditEvent =
    | { readonly type: 'START' }
    | { readonly type: 'COMPLETE'; readonly summary: string }
    | { readonly type: 'CANCEL'; readonly reason?: string };

export function transition(state: AuditState, event: AuditEvent): AuditState {
    switch (state.status) {
        case 'Pending':
            if (event.type === 'START') {
                // Return a new state object (immutability)
                return { status: 'InProgress', context: state.context };
            }
            break;

        case 'InProgress':
            if (event.type === 'COMPLETE') {
                if (!event.summary || event.summary.trim().length === 0) {
                    throw new Error('A summary is required to complete the audit.');
                }
                return {
                    status: 'Completed',
                    context: { ...state.context, summary: event.summary },
                };
            }
            if (event.type === 'CANCEL') {
                return {
                    status: 'Cancelled',
                    context: { ...state.context, cancellationReason: event.reason },
                };
            }
            break;

        case 'Completed':
        case 'Cancelled':
            if (event.type === 'CANCEL' || event.type === 'START' || event.type === 'COMPLETE') {
                console.warn(`Action '${event.type}' is invalid in terminal state '${state.status}'.`);
                return state;
            }
            break;
    }

    throw new Error(`Invalid transition: Cannot handle event '${event.type}' in state '${state.status}'.`);
}