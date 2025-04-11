import {
  checkCompatibility,
  logout,
  recoveryEmail,
  signIn,
  signUp,
  sync
} from "@/api";
import { t } from "@/utils/i18n";
import { Authorisation } from "./types";

export const authorisation: Authorisation = {
  async signIn(res, rej, data) {
    try {
      const r = await signIn(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to SignIn"));
    }
  },
  async signUp(res, rej, data) {
    try {
      const r = await signUp(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to SignUp"));
    }
  },
  async recoveryEmail(res, rej, { email }) {
    try {
      const r = await recoveryEmail(email);
      return res(r);
    } catch (e) {
      rej(t("Failed to send recovery email"));
    }
  },
  async logout(res, rej) {
    try {
      const r = await logout();
      return res(r);
    } catch (e) {
      rej(t("Failed to logout"));
    }
  },
  async sync(res, rej) {
    try {
      const r = await sync();
      return res(r);
    } catch (e) {
      rej(t("Failed to sync"));
    }
  },
  async checkCompatibility(res, rej) {
    try {
      const r = await checkCompatibility();
      return res(r);
    } catch (e) {
      rej(t("Failed to check compatibility"));
    }
  }
};
