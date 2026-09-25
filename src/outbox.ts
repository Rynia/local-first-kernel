import { KernelEvent, OutboxItem } from './types';

export class OutboxQueue {
  private queue: OutboxItem[] = [];

  enqueue(event: KernelEvent): OutboxItem {
    const item: OutboxItem = {
      id: 'out_' + event.id,
      event,
      status: 'pending',
      attempts: 0
    };
    this.queue.push(item);
    return item;
  }

  getPending(): OutboxItem[] {
    return this.queue.filter(i => i.status === 'pending');
  }

  markSyncing(id: string): void {
    const item = this.queue.find(i => i.id === id);
    if (item) {
      item.status = 'syncing';
      item.attempts += 1;
      item.lastAttempt = Date.now();
    }
  }

  markSynced(id: string): void {
    this.queue = this.queue.filter(i => i.id !== id);
  }

  markFailed(id: string, error: string): void {
    const item = this.queue.find(i => i.id === id);
    if (item) {
      item.status = 'failed';
      item.error = error;
    }
  }

  get size(): number {
    return this.queue.length;
  }

  getAll(): OutboxItem[] {
    return [...this.queue];
  }
}
