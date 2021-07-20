export type Migration = {
  version: number;
  cb: (value: unknown) => unknown;
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

export function findMigrations(
  migrations: Migration[],
  version: number
): Migration[] {
  // try to find a migration whose version is larger than our current version
  const needToMigrate = migrations.find(
    m => compareVersions(version, m.version) === -1
  );

  if (!needToMigrate) {
    return [];
  }

  const sorted = [...migrations].sort((m1, m2) =>
    compareVersions(m1.version, m2.version)
  );
  const index = sorted.findIndex(
    m => compareVersions(version, m.version) === -1
  );

  return sorted.slice(index);
}

export function migrate(migrations: Migration[], value: unknown): unknown {
  return migrations.reduce((acc, m) => m.cb(acc), value);
}
