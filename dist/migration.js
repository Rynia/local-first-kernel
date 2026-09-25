"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunner = void 0;
class MigrationRunner {
    migrations = [];
    constructor(migrations = []) {
        this.migrations = [...migrations].sort((a, b) => a.fromVersion - b.fromVersion);
    }
    register(fromVersion, toVersion, migrate) {
        this.migrations.push({ fromVersion, toVersion, migrate });
        this.migrations.sort((a, b) => a.fromVersion - b.fromVersion);
    }
    migrate(rawState, currentVersion, targetVersion) {
        if (currentVersion === targetVersion) {
            return rawState;
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
        return state;
    }
}
exports.MigrationRunner = MigrationRunner;
//# sourceMappingURL=migration.js.map