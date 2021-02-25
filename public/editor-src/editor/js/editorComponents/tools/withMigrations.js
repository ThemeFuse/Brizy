import { read as readNumber } from "visual/utils/reader/number";
import { findMigrations, migrate } from "visual/utils/migration";

export function withMigrations(EditorComponent, migrations) {
  class EditorComponentWithMigrations extends EditorComponent {
    dbValueMigrated = undefined;

    constructor(props) {
      super(props);

      const currentVersion = readNumber(this.props.dbValue?._version) ?? 1;
      const foundMigrations = findMigrations(migrations, currentVersion);
      if (foundMigrations.length > 0) {
        this.dbValueMigrated = {
          ...migrate(foundMigrations, this.props.dbValue),
          _version: foundMigrations[foundMigrations.length - 1].version
        };
      }
    }

    getDBValue() {
      return this.dbValueMigrated ?? super.getDBValue();
    }

    handleValueChange(newValue, meta) {
      if (this.dbValueMigrated) {
        this.dbValueMigrated = undefined;
      }
      super.handleValueChange(newValue, meta);
    }
  }

  return EditorComponentWithMigrations;
}
