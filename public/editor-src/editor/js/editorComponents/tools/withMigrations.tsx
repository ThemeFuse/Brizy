import React, { ReactNode } from "react";
import { Num } from "@brizy/readers";
import EditorIcon from "visual/component/EditorIcon";
import { ElementModel } from "visual/component/Elements/Types";
import { EditorInstance, Props } from "visual/editorComponents/EditorComponent";
import { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";
import {
  Deps,
  Migration,
  findMigrations,
  migrate
} from "visual/utils/migration";
import { MValue } from "visual/utils/value";

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
  P extends Record<string, unknown> = Record<string, unknown>
>(
  EditorComponent: EditorInstance,
  migrations: Migration<Deps<unknown>>[],
  deps?: D
): EditorInstance {
  class EditorComponentWithMigrations extends EditorComponent<M, P> {
    dbValueMigrated: DBMigration<Props<M, P>>["dbValue"] | undefined =
      undefined;
    currentVersion: MValue<number> = undefined;

    constructor(props: Props<M, P>) {
      super(props);

      const currentVersion = Num.read(this.props.dbValue?._version) ?? 1;
      const foundMigrations = findMigrations(migrations, currentVersion);

      this.currentVersion = currentVersion;

      if (foundMigrations.length > 0) {
        if (deps?.getValue) {
          this.state = {
            ...this.state,
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

              this.setState((state) => ({ ...state, loading: false }));
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
      const newVersion = Num.read(this.props.dbValue._version);

      if (
        this.currentVersion &&
        newVersion &&
        this.currentVersion < newVersion
      ) {
        this.dbValueMigrated = undefined;
      }

      if (this.dbValueMigrated) {
        const dbValue = super.getDBValue();
        return {
          ...this.props.dbValue,
          ...dbValue,
          ...this.dbValueMigrated
        };
      }

      return super.getDBValue();
    }

    handleValueChange(newValue: M, meta: OnChangeMeta<M>) {
      if (this.dbValueMigrated) {
        this.dbValueMigrated = undefined;
      }
      super.handleValueChange(newValue, meta);
    }

    renderForEdit(v: M, vs: M, vd: M): ReactNode {
      return this.state?.loading ? (
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
