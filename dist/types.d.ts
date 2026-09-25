export interface KernelEvent<T = any> {
    id: string;
    type: string;
    payload: T;
    timestamp: number;
    version: number;
}
export type Reducer<S, E extends KernelEvent = KernelEvent> = (state: S, event: E) => S;
export interface Snapshot<S> {
    version: number;
    state: S;
    timestamp: number;
    eventSequence: number;
}
export interface Migration<S = any> {
    fromVersion: number;
    toVersion: number;
    migrate: (state: any) => S;
}
export interface OutboxItem<T = any> {
    id: string;
    event: KernelEvent<T>;
    status: 'pending' | 'syncing' | 'synced' | 'failed';
    attempts: number;
    lastAttempt?: number;
    error?: string;
}
export interface KernelConfig<S> {
    initialState: S;
    schemaVersion: number;
    reducer: Reducer<S>;
    migrations?: Migration<S>[];
    enableUndo?: boolean;
    maxUndoHistory?: number;
}
//# sourceMappingURL=types.d.ts.map