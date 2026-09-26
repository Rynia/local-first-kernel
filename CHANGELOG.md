# Changelog

All notable changes to `local-first-kernel` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-25

### Added
- **Production Stable Release**: Zero-dependency deterministic event micro-kernel.
- Append-only `EventLog` with cryptographic timestamp ordering and sequence tracking.
- Reactive `StateEngine` with synchronous subscriber listeners.
- Bidirectional deterministic `undo()` and `redo()` command stacks.
- Zero-data-loss schema migration engine with forward version transforms.
- Offline `OutboxQueue` with optimistic UI updates and network replay reconciliation.
- Comprehensive demo suite and verification benchmarks.

### Battle-Tested
- Production backbone for **[KALANLA](https://github.com/Rynia/KALANLA)** (Kiler Kitchen OS) offline inventory state.

---

## [0.9.1] - 2026-09-14

### Changed
- Refactored outbox queue reconciliation to handle intermittent network dropouts.
- Optimized state slice cloning for zero prototype pollution.

---

## [0.8.0] - 2026-08-20

### Added
- Initial core architecture prototype for append-only state reducer.
- Migration runner interface.
