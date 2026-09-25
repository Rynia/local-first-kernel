"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLog = void 0;
class EventLog {
    events = [];
    constructor(initialEvents = []) {
        this.events = [...initialEvents];
    }
    append(type, payload, version = 1) {
        const event = {
            id: this.generateId(),
            type,
            payload,
            timestamp: Date.now(),
            version
        };
        this.events.push(event);
        return event;
    }
    getAll() {
        return [...this.events];
    }
    getSince(timestamp) {
        return this.events.filter(e => e.timestamp > timestamp);
    }
    get count() {
        return this.events.length;
    }
    clear() {
        this.events = [];
    }
    generateId() {
        return 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    }
}
exports.EventLog = EventLog;
//# sourceMappingURL=eventLog.js.map