import Config from "visual/global/Config";
import { Authorized } from "visual/types";

const storageAuthorizedKey = "brz-authorized";

const setStorageAuthorized = (authorized: Authorized): void => {
  localStorage.setItem(storageAuthorizedKey, authorized);
};

const getStorageAuthorized = (): Authorized => {
  const authorized = localStorage.getItem(storageAuthorizedKey);

  switch (authorized) {
    case "pending": {
      return "pending";
    }
    case "connected": {
      return "connected";
    }
    default: {
      return "disconnect";
    }
  }
};

export const getAuthorized = (): Authorized => {
  const user = Config.get("user");

  if (user.isAuthorized) {
    return "connected";
  }

  return getStorageAuthorized();
};

export const setAuthorized = (authorized: Authorized): void => {
  setStorageAuthorized(authorized);
};
