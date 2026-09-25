import { KernelEvent, OutboxItem } from './types';
export declare class OutboxQueue {
    private queue;
    enqueue(event: KernelEvent): OutboxItem;
    getPending(): OutboxItem[];
    markSyncing(id: string): void;
    markSynced(id: string): void;
    markFailed(id: string, error: string): void;
    get size(): number;
    getAll(): OutboxItem[];
}
//# sourceMappingURL=outbox.d.ts.map