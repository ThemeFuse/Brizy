import React, { ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ElementModel } from "visual/component/Elements/Types";
import {
  Editor,
  Model,
  OnChangeMeta,
  Props
} from "visual/editorComponents/EditorComponent";
import {
  Deps,
  findMigrations,
  migrate,
  Migration
} from "visual/utils/migration";
import { read as readNumber } from "visual/utils/reader/number";

type DBMigration<M> = M & {
  _version: number;
};

interface DepsGetValue<T> {
  getValue: () => Promise<T>;
}

export function withMigrations<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  D extends DepsGetValue<any>,
  P = Record<string, unknown>
>(
  EditorComponent: Editor,
  migrations: Migration<Deps<unknown>>[],
  deps?: D
): Editor {
  class EditorComponentWithMigrations extends EditorComponent<M> {
    dbValueMigrated: Model<DBMigration<M>> | undefined = undefined;

    state = {
      loading: false
    };

    constructor(props: Props<M, P>) {
      super(props);

      const currentVersion = readNumber(this.props.dbValue?._version) ?? 1;
      const foundMigrations = findMigrations(migrations, currentVersion);

      if (foundMigrations.length > 0) {
        if (deps?.getValue) {
          this.state = {
            loading: true
          };

          deps
            .getValue()
            .then((r) => {
              // @ts-expect-error: { _version: number; }' is assignable to the constraint of type 'M'
              this.dbValueMigrated = {
                ...migrate(foundMigrations, this.props.dbValue, r),
                _version: foundMigrations[foundMigrations.length - 1].version
              };

              this.setState(() => ({ loading: false }));
            })
            .catch((e) => {
              if (process.env.NODE_ENV === "development") {
                console.log(e);
              }
              throw e;
            });
        } else {
          // @ts-expect-error: { _version: number; }' is assignable to the constraint of type 'M'
          this.dbValueMigrated = {
            ...migrate(foundMigrations, this.props.dbValue),
            _version: foundMigrations[foundMigrations.length - 1].version
          };
        }
      }
    }

    getDBValue() {
      return this.dbValueMigrated ?? super.getDBValue();
    }

    handleValueChange(newValue: M, meta: OnChangeMeta<M>) {
      if (this.dbValueMigrated) {
        this.dbValueMigrated = undefined;
      }
      super.handleValueChange(newValue, meta);
    }

    renderForEdit(v: M, vs: M, vd: M): ReactNode {
      return this.state.loading ? (
        <div
          className="brz-ed-portal__loading"
          style={{ position: "relative", height: "80px" }}
        >
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      ) : (
        super.renderForEdit(v, vs, vd)
      );
    }
  }

  return EditorComponentWithMigrations;
}
