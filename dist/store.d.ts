import { KernelConfig, KernelEvent, Snapshot } from './types';
import { OutboxQueue } from './outbox';
export declare class LocalKernel<S> {
    private state;
    private version;
    private reducer;
    private eventLog;
    private migrationRunner;
    outbox: OutboxQueue;
    private undoStack;
    private redoStack;
    private enableUndo;
    private maxUndoHistory;
    private listeners;
    constructor(config: KernelConfig<S>);
    getState(): S;
    getSchemaVersion(): number;
    dispatch(type: string, payload: any): KernelEvent;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(): boolean;
    redo(): boolean;
    exportSnapshot(): Snapshot<S>;
    importSnapshot(rawSnapshot: {
        version: number;
        state: any;
    }): void;
    subscribe(listener: (state: S) => void): () => void;
    getJournal(): KernelEvent[];
    private notify;
    private clone;
}
//# sourceMappingURL=store.d.ts.map