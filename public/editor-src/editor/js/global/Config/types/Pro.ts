interface ProCommon {
  urls: {
    assets: string;
  };
}

interface ProWP extends ProCommon {
  version: string; // add more narrow type like "dev" | "hz",
  whiteLabel: boolean;
}

type Cnf = {
  cloud: ProCommon;
  wp: ProWP;
};

export type Pro<T extends "wp" | "cloud"> = Cnf[T];
