interface ProjectCommon {
  heartBeatInterval: number;
  status: { locked: boolean; lockedBy: boolean | string };
}

interface ProjectCloud extends ProjectCommon {
  id: number;
  apiVersion: 1 | 2 | null;
  protectedPagePassword: string;
}

interface ProjectWP extends ProjectCommon {
  id: string;
}

type Cnf = {
  cloud: ProjectCloud;
  wp: ProjectWP;
};

export type Project<T extends "wp" | "cloud"> = Cnf[T];
