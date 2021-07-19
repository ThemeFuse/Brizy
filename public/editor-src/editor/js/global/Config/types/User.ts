interface UserCommon {
  isAuthorized: boolean;
  role: string; // add more narrow type like "admin" | "hz",;
}

interface UserWP extends UserCommon {
  isApproved: boolean;
  isGuest: boolean;
}

type Cnf = {
  cloud: UserCommon;
  wp: UserWP;
};

export type User<T extends "wp" | "cloud"> = Cnf[T];
