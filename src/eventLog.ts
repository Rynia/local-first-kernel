import { KernelEvent } from './types';

export class EventLog {
  private events: KernelEvent[] = [];

  constructor(initialEvents: KernelEvent[] = []) {
    this.events = [...initialEvents];
  }

  append(type: string, payload: any, version: number = 1): KernelEvent {
    const event: KernelEvent = {
      id: this.generateId(),
      type,
      payload,
      timestamp: Date.now(),
      version
    };
    this.events.push(event);
    return event;
  }

  getAll(): KernelEvent[] {
    return [...this.events];
  }

  getSince(timestamp: number): KernelEvent[] {
    return this.events.filter(e => e.timestamp > timestamp);
  }

  get count(): number {
    return this.events.length;
  }

  clear(): void {
    this.events = [];
  }

  private generateId(): string {
    return 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  }
}
