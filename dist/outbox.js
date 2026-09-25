"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxQueue = void 0;
class OutboxQueue {
    queue = [];
    enqueue(event) {
        const item = {
            id: 'out_' + event.id,
            event,
            status: 'pending',
            attempts: 0
        };
        this.queue.push(item);
        return item;
    }
    getPending() {
        return this.queue.filter(i => i.status === 'pending');
    }
    markSyncing(id) {
        const item = this.queue.find(i => i.id === id);
        if (item) {
            item.status = 'syncing';
            item.attempts += 1;
            item.lastAttempt = Date.now();
        }
    }
    markSynced(id) {
        this.queue = this.queue.filter(i => i.id !== id);
    }
    markFailed(id, error) {
        const item = this.queue.find(i => i.id === id);
        if (item) {
            item.status = 'failed';
            item.error = error;
        }
    }
    get size() {
        return this.queue.length;
    }
    getAll() {
        return [...this.queue];
    }
}
exports.OutboxQueue = OutboxQueue;
//# sourceMappingURL=outbox.js.map