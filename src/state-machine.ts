export type AuditState = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';

export interface Audit {
    readonly id: string;
    state: AuditState;
    data: {
        createdAt: Date;
        updatedAt: Date;
        summary?: string;
        cancellationReason?: string;
    };
}

export class AuditWorkflow {
    private audit: Audit;

    constructor(auditId: string) {
        this.audit = {
            id: auditId,
            state: 'Pending',
            data: {
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
        console.log(`[Audit #${this.audit.id}] Created. Initial state: ${this.audit.state}`);
    }

    public start() {
        if (this.audit.state !== 'Pending') {
            throw new Error(`Cannot start audit in state '${this.audit.state}'. Must be 'Pending'.`);
        }
        this.transitionTo('InProgress');
    }

    public complete(summary: string) {
        if (this.audit.state !== 'InProgress') {
            throw new Error(`Cannot complete audit in state '${this.audit.state}'. Must be 'InProgress'.`);
        }
        if (!summary || summary.trim().length === 0) {
            throw new Error('A summary is required to complete the audit.');
        }
        this.audit.data.summary = summary;
        this.transitionTo('Completed');
    }

    public cancel(reason?: string) {
        if (this.audit.state === 'Completed' || this.audit.state === 'Cancelled') {
            throw new Error(`Cannot cancel audit in a terminal state ('${this.audit.state}').`);
        }
        this.audit.data.cancellationReason = reason;
        this.transitionTo('Cancelled');
    }

    private transitionTo(newState: AuditState) {
        const oldState = this.audit.state;
        this.audit.state = newState;
        this.audit.data.updatedAt = new Date();
        console.log(`[Audit #${this.audit.id}] Transitioned: ${oldState} -> ${newState}`);
    }

    public getAudit(): Readonly<Audit> {
        return JSON.parse(JSON.stringify(this.audit));
    }
}