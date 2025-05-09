import {
  addAccount,
  addRecaptcha,
  createIntegrationAccount,
  createIntegrationList,
  deleteAccount,
  deleteSmtpIntegration,
  getAccounts,
  getForm,
  getIntegration,
  getIntegrationAccountApiKey,
  updateForm,
  updateIntegration
} from "@/api";
import { t } from "@/utils/i18n";
import { Form } from "./types";

export const form: Form = {
  getForm: async (res, rej, { formId }) => {
    try {
      const r = await getForm(formId);
      return res(r);
    } catch (e) {
      rej(t("Failed to get form"));
    }
  },
  updateForm: async (res, rej, data) => {
    try {
      const r = await updateForm(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to update form"));
    }
  },
  addRecaptcha: async (res, rej, data) => {
    try {
      const r = await addRecaptcha(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to add recaptcha"));
    }
  },
  getIntegration: async (res, rej, data) => {
    try {
      const r = await getIntegration(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to get integration"));
    }
  },
  updateIntegration: async (res, rej, data) => {
    try {
      const r = await updateIntegration(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to update integration"));
    }
  },
  createIntegrationAccount: async (res, rej, data) => {
    try {
      const r = await createIntegrationAccount(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to create integration account"));
    }
  },
  createIntegrationList: async (res, rej, data) => {
    try {
      const r = await createIntegrationList(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to create integration list"));
    }
  },
  getIntegrationAccountApiKey: async (res, rej, data) => {
    try {
      const r = await getIntegrationAccountApiKey(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to get integration account api key"));
    }
  },
  getSmtpIntegration: async (res, rej, data) => {
    return form.getIntegration(res, rej, data);
  },
  updateSmtpIntegration: async (res, rej, data) => {
    return form.updateIntegration(res, rej, data);
  },
  deleteSmtpIntegration: async (res, rej, data) => {
    try {
      const r = await deleteSmtpIntegration(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to delete integration"));
    }
  },
  getAccounts: async (res, rej, data) => {
    try {
      const r = await getAccounts(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to get accounts"));
    }
  },
  addAccount: async (res, rej, data) => {
    try {
      const r = await addAccount(data);
      return res(r);
    } catch (e) {
      rej(t("Failed to add Account"));
    }
  },
  deleteAccount: async (res, rej, data) => {
    try {
      const r = await deleteAccount(data.id);
      return res(r);
    } catch (e) {
      rej(t("Failed to delete Account"));
    }
  }
};
