import { Migration } from './types';
export declare class MigrationRunner<S> {
    private migrations;
    constructor(migrations?: Migration<S>[]);
    register(fromVersion: number, toVersion: number, migrate: (state: any) => S): void;
    migrate(rawState: any, currentVersion: number, targetVersion: number): S;
}
//# sourceMappingURL=migration.d.ts.map