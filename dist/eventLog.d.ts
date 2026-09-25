import { KernelEvent } from './types';
export declare class EventLog {
    private events;
    constructor(initialEvents?: KernelEvent[]);
    append(type: string, payload: any, version?: number): KernelEvent;
    getAll(): KernelEvent[];
    getSince(timestamp: number): KernelEvent[];
    get count(): number;
    clear(): void;
    private generateId;
}
//# sourceMappingURL=eventLog.d.ts.map