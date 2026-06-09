import { Num } from "@brizy/readers";
import React, { ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ElementModel } from "visual/component/Elements/Types";
import { EditorInstance, Props } from "visual/editorComponents/EditorComponent";
import { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType } from "visual/providers/RenderProvider";
import {
  Deps,
  Migration,
  findMigrations,
  migrate
} from "visual/utils/migration";
import { MValue } from "visual/utils/value";

export type DBMigration<M> = M & {
  _version: number;
};

interface DepsGetValue<T> {
  getValue: (renderContext: RenderType, config: ConfigCommon) => Promise<T>;
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
    _pendingMigrations: Migration<Deps<unknown>>[] | undefined = undefined;
    _resolvedDeps: Deps<unknown> | undefined = undefined;
    _isMigrating = false;
    currentVersion: MValue<number> = undefined;

    // Keep dbValueMigrated as public API for subclasses (e.g. Image)
    // that clear it directly. Setting to undefined clears pending migrations.
    get dbValueMigrated(): unknown {
      return this._pendingMigrations;
    }

    set dbValueMigrated(_val: unknown) {
      this._pendingMigrations = undefined;
      this._resolvedDeps = undefined;
    }

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

          const config = this.getGlobalConfig();

          deps
            .getValue(this.props.renderContext, config)
            .then((r) => {
              this._pendingMigrations = foundMigrations;
              this._resolvedDeps = r;
              this.setState((state) => ({ ...state, loading: false }));
            })
            .catch((e) => {
              if (process.env.NODE_ENV === "development") {
                /* eslint-disable-next-line no-console */
                console.log(e);
              }
              throw e;
            });
        } else {
          this._pendingMigrations = foundMigrations;
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
        this._pendingMigrations = undefined;
        this._resolvedDeps = undefined;
      }

      if (this._pendingMigrations && !this._isMigrating) {
        // Added for circular dependecies getDefaultValue -> getDBValue -> getDBValue -> ...
        this._isMigrating = true;

        try {
          const dbValue = super.getDBValue();
          const vd = super.getDefaultValue();
          const stylesValue = super.getStylesValue();
          const vs = { ...vd, ...stylesValue };
          const lastVersion =
            this._pendingMigrations[this._pendingMigrations.length - 1].version;

          const migrated = {
            ...migrate(
              this._pendingMigrations,
              { vd, vs, v: dbValue, renderContext: this.props.renderContext },
              this._resolvedDeps
            ),
            _version: lastVersion
          };

          return {
            ...this.props.dbValue,
            ...dbValue,
            ...migrated
          };
        } finally {
          this._isMigrating = false;
        }
      }

      return super.getDBValue();
    }

    handleValueChange(newValue: M, meta: OnChangeMeta<M>) {
      if (this._pendingMigrations) {
        this._pendingMigrations = undefined;
        this._resolvedDeps = undefined;
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
