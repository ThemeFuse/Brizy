import { t } from "visual/utils/i18n";
import type { MValue } from "visual/utils/value";
import Email from "./Email";
import Recaptcha from "./Recaptcha";
import Service from "./Service";
import type { ConfigTab, Tab } from "./types";

export const getAvailableTabs = (): Tab[] => [
  {
    id: "email",
    title: t("Email"),
    icon: "nc-email",
    component: Email
  },
  {
    id: "service",
    title: t("APPS"),
    icon: "nc-extensions-2",
    component: Service
  },
  {
    id: "recaptcha",
    title: t("ReCAPTCHA"),
    icon: "nc-captcha",
    component: Recaptcha
  }
];

export const getTabs = (tabs: MValue<ConfigTab[]>): Tab[] => {
  const availableTabs = getAvailableTabs();

  if (!tabs || (Array.isArray(tabs) && tabs.length === 0)) {
    return availableTabs;
  }

  return availableTabs.filter(({ id }) => !!tabs.find((tab) => tab.id === id));
};
