# 🏛️ local-first-kernel
### *A tiny, deterministic application kernel for local-first apps — event-log, schema migrations, undo/redo & offline outbox with zero dependencies.*

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/Size-%3C10KB-8A2BE2?style=for-the-badge" alt="Bundle Size" />
  <img src="https://img.shields.io/badge/Runtimes-Node%20·%20React%20Native%20·%20Web-F59E0B?style=for-the-badge" alt="Runtimes" />
</p>

---

## ⚡ Why `local-first-kernel`?

Building **Local-First** applications (where user data lives on the client device rather than a remote cloud server) is the future of software sovereignty. But managing local state brings severe engineering headaches:

* 💥 **Schema Drift:** A user has 8 months of data stored locally in SQLite or AsyncStorage. When you push an app update, how do you migrate their schema safely without wiping their data?
* ↩️ **Accidental Wipes:** Users tap "Delete" or "Cooked" by mistake. Without an event journal, recovery is impossible.
* 📶 **Offline Mutations:** When the device is offline, mutations must queue in an optimistic outbox and sync gracefully when reconnected.

`local-first-kernel` solves this as a lightweight, zero-dependency mathematical state kernel:

```
[ User Intent ]
       ↓
[ dispatch(type, payload) ]
       ↓
┌──────────────────────────────────────────────┐
│             LOCAL-FIRST KERNEL               │
│                                              │
│  ├── EventLog    (Append-only journal)       │
│  ├── Reducer     (Deterministic state math)  │
│  ├── UndoStack   (Time-travel history)       │
│  ├── OutboxQueue (Offline sync queue)        │
│  └── Migrations  (Zero-data-loss versioning) │
└──────────────────────────────────────────────┘
       ↓
[ Verified Local State (SQLite / AsyncStorage) ]
```

---

## 🚀 Quick Start

```bash
npm install @rynia/local-first-kernel
```

### 1. Initialize Kernel with State & Reducer

```typescript
import { LocalKernel } from '@rynia/local-first-kernel';

interface PantryState {
  items: Array<{ id: string; name: string; qty: number }>;
}

const kernel = new LocalKernel<PantryState>({
  schemaVersion: 1,
  initialState: { items: [] },
  enableUndo: true,
  reducer: (state, event) => {
    switch (event.type) {
      case 'item.added':
        return { items: [...state.items, event.payload] };
      case 'item.removed':
        return { items: state.items.filter(i => i.id !== event.payload.id) };
      default:
        return state;
    }
  }
});

// Dispatch deterministic events
kernel.dispatch('item.added', { id: '01', name: 'Organic Honey', qty: 1 });
kernel.dispatch('item.added', { id: '02', name: 'Sourdough Bread', qty: 2 });

console.log(kernel.getState());
// => { items: [ { id: '01', name: 'Organic Honey', qty: 1 }, ... ] }
```

### 2. Native Time-Travel (Undo & Redo)

```typescript
// Undo the last action
kernel.undo();
console.log(kernel.getState().items.length); // => 1

// Redo it back
kernel.redo();
console.log(kernel.getState().items.length); // => 2
```

### 3. Safe Zero-Data-Loss Schema Migrations

When your app evolves from `v1` to `v2` (e.g. adding a mandatory `category` field to items):

```typescript
const v2Kernel = new LocalKernel({
  schemaVersion: 2,
  initialState: { items: [] },
  reducer: (state, event) => state,
  migrations: [
    {
      fromVersion: 1,
      toVersion: 2,
      migrate: (oldState) => ({
        items: oldState.items.map(item => ({
          ...item,
          category: item.category || 'Pantry Default'
        }))
      })
    }
  ]
});

// Import old v1 snapshot from device storage:
// Kernel automatically runs migration pipeline from v1 to v2 safely!
v2Kernel.importSnapshot(oldV1Snapshot);
```

### 4. Offline Outbox Queue

```typescript
// Every mutation automatically enqueues into kernel.outbox
console.log(kernel.outbox.size); // => 2 pending actions

// When internet is restored:
const pending = kernel.outbox.getPending();
for (const item of pending) {
  // Sync to peer / backup server:
  await syncToServer(item.event);
  kernel.outbox.markSynced(item.id);
}
```

---

## 🛠️ Production Proven

`local-first-kernel` powers the state, undo guard, and inventory telemetry of **[KALANLA](https://github.com/Rynia/KALANLA)** (Kiler Kitchen OS).

---

## 🌐 The Rynia Software Ecosystem

Part of the deterministic, local-first engineering suite crafted by [@Rynia](https://github.com/Rynia):

| Package / Project | Role | Version |
| :--- | :--- | :--- |
| [**local-first-kernel**](https://github.com/Rynia/local-first-kernel) | Append-only reactive event micro-kernel & offline sync | `v1.0.0` |
| [**expo-release-guard**](https://github.com/Rynia/expo-release-guard) | Pre-flight zero-rejection store compliance & privacy manifest CLI | `v1.0.0` |
| [**receipt-renderer**](https://github.com/Rynia/receipt-renderer) | Zero-dependency 9:16 thermal receipt AST & dual SVG/ASCII renderer | `v1.0.0` |
| [**KALANLA**](https://github.com/Rynia/KALANLA) | Smart kitchen pantry OS powered by this ecosystem | `Live Beta` |

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and architectural notes.

---

## 📄 License & Studio

* **License:** MIT © 2026 [Muharrem Özmen (@Rynia)](https://github.com/Rynia)
* **Architected by:** [Rynia Studios](https://ryniastudios.netlify.app)
* *Part of the Rynia Local-First & Ambient Systems initiative.*
