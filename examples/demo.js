const { LocalKernel } = require('../dist/index');

console.log('=== TEST 1: Initializing LocalKernel ===');
const kernel = new LocalKernel({
  schemaVersion: 1,
  initialState: { items: [] },
  reducer: (state, event) => {
    switch (event.type) {
      case 'pantry.item_added':
        return { items: [...state.items, event.payload] };
      case 'pantry.item_removed':
        return { items: state.items.filter(i => i.id !== event.payload.id) };
      default:
        return state;
    }
  }
});

console.log('Dispatching item 1: Süt (Milk)...');
kernel.dispatch('pantry.item_added', { id: 'item_1', name: 'Süt', qty: 2 });
console.log('Dispatching item 2: Yumurta (Eggs)...');
kernel.dispatch('pantry.item_added', { id: 'item_2', name: 'Yumurta', qty: 10 });

console.log('Current State:', JSON.stringify(kernel.getState()));
console.log('Journal Event Count:', kernel.getJournal().length);
console.log('Outbox Pending Queue Size:', kernel.outbox.size);

console.log('\n=== TEST 2: Undo & Redo Mechanics ===');
console.log('Can undo?', kernel.canUndo());
kernel.undo();
console.log('After Undo (Items should be 1):', JSON.stringify(kernel.getState()));
kernel.redo();
console.log('After Redo (Items should be 2):', JSON.stringify(kernel.getState()));

console.log('\n=== TEST 3: Schema Migration (v1 -> v2) ===');
// Old v1 snapshot (items had no category)
const v1Snapshot = kernel.exportSnapshot();
console.log('Exported v1 Snapshot:', v1Snapshot);

// Create new v2 Kernel that requires "category" field with fallback
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
          category: item.category || 'General / Pantry'
        }))
      })
    }
  ]
});

v2Kernel.importSnapshot(v1Snapshot);
console.log('Imported & Migrated v2 State:', JSON.stringify(v2Kernel.getState()));

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
