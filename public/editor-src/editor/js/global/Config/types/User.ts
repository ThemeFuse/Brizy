interface UserCommon {
  isAuthorized: boolean;
  // ours dashboard role manager
  role: "admin" | "limited";
}

interface UserCloud extends UserCommon {
  isApproved: boolean;
}

interface UserWP extends UserCommon {
  isGuest: boolean;
  isWpAdmin: boolean;
}

type Cnf = {
  cloud: UserCloud;
  wp: UserWP;
};

export type User<T extends "wp" | "cloud"> = Cnf[T];
