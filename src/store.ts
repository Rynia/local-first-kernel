import { KernelConfig, KernelEvent, Snapshot, Reducer } from './types';
import { EventLog } from './eventLog';
import { MigrationRunner } from './migration';
import { OutboxQueue } from './outbox';

export class LocalKernel<S> {
  private state: S;
  private version: number;
  private reducer: Reducer<S>;
  private eventLog: EventLog;
  private migrationRunner: MigrationRunner<S>;
  public outbox: OutboxQueue;

  private undoStack: S[] = [];
  private redoStack: S[] = [];
  private enableUndo: boolean;
  private maxUndoHistory: number;

  private listeners: Set<(state: S) => void> = new Set();

  constructor(config: KernelConfig<S>) {
    this.state = config.initialState;
    this.version = config.schemaVersion;
    this.reducer = config.reducer;
    this.eventLog = new EventLog();
    this.migrationRunner = new MigrationRunner(config.migrations || []);
    this.outbox = new OutboxQueue();

    this.enableUndo = config.enableUndo ?? true;
    this.maxUndoHistory = config.maxUndoHistory ?? 50;
  }

  getState(): S {
    return this.state;
  }

  getSchemaVersion(): number {
    return this.version;
  }

  dispatch(type: string, payload: any): KernelEvent {
    if (this.enableUndo) {
      this.undoStack.push(this.clone(this.state));
      if (this.undoStack.length > this.maxUndoHistory) {
        this.undoStack.shift();
      }
      this.redoStack = [];
    }

    const event = this.eventLog.append(type, payload, this.version);
    this.state = this.reducer(this.state, event);
    this.outbox.enqueue(event);

    this.notify();
    return event;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  undo(): boolean {
    if (!this.canUndo()) return false;
    const previous = this.undoStack.pop()!;
    this.redoStack.push(this.clone(this.state));
    this.state = previous;
    this.notify();
    return true;
  }

  redo(): boolean {
    if (!this.canRedo()) return false;
    const next = this.redoStack.pop()!;
    this.undoStack.push(this.clone(this.state));
    this.state = next;
    this.notify();
    return true;
  }

  exportSnapshot(): Snapshot<S> {
    return {
      version: this.version,
      state: this.clone(this.state),
      timestamp: Date.now(),
      eventSequence: this.eventLog.count
    };
  }

  importSnapshot(rawSnapshot: { version: number; state: any }): void {
    const migratedState = this.migrationRunner.migrate(
      rawSnapshot.state,
      rawSnapshot.version,
      this.version
    );

    this.state = migratedState;
    this.undoStack = [];
    this.redoStack = [];
    this.notify();
  }

  subscribe(listener: (state: S) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getJournal(): KernelEvent[] {
    return this.eventLog.getAll();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {}
    }
  }

  private clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
