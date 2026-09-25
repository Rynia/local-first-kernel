"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalKernel = void 0;
const eventLog_1 = require("./eventLog");
const migration_1 = require("./migration");
const outbox_1 = require("./outbox");
class LocalKernel {
    state;
    version;
    reducer;
    eventLog;
    migrationRunner;
    outbox;
    undoStack = [];
    redoStack = [];
    enableUndo;
    maxUndoHistory;
    listeners = new Set();
    constructor(config) {
        this.state = config.initialState;
        this.version = config.schemaVersion;
        this.reducer = config.reducer;
        this.eventLog = new eventLog_1.EventLog();
        this.migrationRunner = new migration_1.MigrationRunner(config.migrations || []);
        this.outbox = new outbox_1.OutboxQueue();
        this.enableUndo = config.enableUndo ?? true;
        this.maxUndoHistory = config.maxUndoHistory ?? 50;
    }
    getState() {
        return this.state;
    }
    getSchemaVersion() {
        return this.version;
    }
    dispatch(type, payload) {
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
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    undo() {
        if (!this.canUndo())
            return false;
        const previous = this.undoStack.pop();
        this.redoStack.push(this.clone(this.state));
        this.state = previous;
        this.notify();
        return true;
    }
    redo() {
        if (!this.canRedo())
            return false;
        const next = this.redoStack.pop();
        this.undoStack.push(this.clone(this.state));
        this.state = next;
        this.notify();
        return true;
    }
    exportSnapshot() {
        return {
            version: this.version,
            state: this.clone(this.state),
            timestamp: Date.now(),
            eventSequence: this.eventLog.count
        };
    }
    importSnapshot(rawSnapshot) {
        const migratedState = this.migrationRunner.migrate(rawSnapshot.state, rawSnapshot.version, this.version);
        this.state = migratedState;
        this.undoStack = [];
        this.redoStack = [];
        this.notify();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    getJournal() {
        return this.eventLog.getAll();
    }
    notify() {
        for (const listener of this.listeners) {
            try {
                listener(this.state);
            }
            catch (e) { }
        }
    }
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
exports.LocalKernel = LocalKernel;
//# sourceMappingURL=store.js.map