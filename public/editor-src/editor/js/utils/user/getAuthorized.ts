import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Authorized } from "visual/types";

const storageAuthorizedKey = "brz-authorized";

const setStorageAuthorized = (authorized: Authorized): void => {
  localStorage.setItem(storageAuthorizedKey, authorized);
};

const getStorageAuthorized = (): Authorized => {
  try {
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
  } catch (_) {
    return "disconnect";
  }
};

export const getAuthorized = (config: ConfigCommon): Authorized => {
  const user = config.user;

  if (!user) {
    return "disconnect";
  }

  if (user.isAuthorized) {
    return "connected";
  }

  return getStorageAuthorized();
};

export const setAuthorized = (authorized: Authorized): void => {
  setStorageAuthorized(authorized);
};
