import { Migration } from './types';

export class MigrationRunner<S> {
  private migrations: Migration<S>[] = [];

  constructor(migrations: Migration<S>[] = []) {
    this.migrations = [...migrations].sort((a, b) => a.fromVersion - b.fromVersion);
  }

  register(fromVersion: number, toVersion: number, migrate: (state: any) => S): void {
    this.migrations.push({ fromVersion, toVersion, migrate });
    this.migrations.sort((a, b) => a.fromVersion - b.fromVersion);
  }

  migrate(rawState: any, currentVersion: number, targetVersion: number): S {
    if (currentVersion === targetVersion) {
      return rawState as S;
    }

    if (currentVersion > targetVersion) {
      throw new Error(`Cannot downgrade schema from v${currentVersion} to v${targetVersion}`);
    }

    let state = rawState;
    let version = currentVersion;

    while (version < targetVersion) {
      const step = this.migrations.find(m => m.fromVersion === version);
      if (!step) {
        throw new Error(`Missing migration step from schema v${version} to target v${targetVersion}`);
      }
      state = step.migrate(state);
      version = step.toVersion;
    }

    return state as S;
  }
}
