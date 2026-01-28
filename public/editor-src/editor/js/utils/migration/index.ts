import { ElementModel } from "visual/component/Elements/Types";
import { RenderType } from "visual/providers/RenderProvider";

export interface Deps<T> {
  [k: string]: T;
}

export interface MigrationValues {
  v: ElementModel;
  vs: ElementModel;
  vd: ElementModel;
  renderContext: RenderType;
}

export type Migration<D extends Deps<unknown>> = {
  version: number;
  cb: (values: MigrationValues, deps?: D) => ElementModel;
};

function compareVersions(m1: number, m2: number): -1 | 0 | 1 {
  if (m1 < m2) {
    return -1;
  } else if (m1 > m2) {
    return 1;
  } else {
    return 0;
  }
}

export function findMigrations<D extends Deps<unknown>>(
  migrations: Migration<D>[],
  version: number
): Migration<D>[] {
  // try to find a migration whose version is larger than our current version
  const needToMigrate = migrations.find(
    (m) => compareVersions(version, m.version) === -1
  );

  if (!needToMigrate) {
    return [];
  }

  const sorted = [...migrations].sort((m1, m2) =>
    compareVersions(m1.version, m2.version)
  );
  const index = sorted.findIndex(
    (m) => compareVersions(version, m.version) === -1
  );

  return sorted.slice(index);
}

export function migrate<D extends Deps<unknown>>(
  migrations: Migration<D>[],
  values: {
    v: ElementModel;
    vs: ElementModel;
    vd: ElementModel;
    renderContext: RenderType;
  },
  deps?: D
): ElementModel {
  return migrations.reduce(
    (acc, m) => m.cb({ ...values, v: acc }, deps),
    values.v
  );
}
