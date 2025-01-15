import React, { ComponentType, ReactElement } from "react";
import { isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { PromptAuthorizationTabs } from "./types";

const getTabs = (): PromptAuthorizationTabs<
  Omit<ComponentType, "children">
>[] => [
  {
    id: "signIn",
    title: t("Cloud"),
    icon: "nc-upload",
    component: SignIn
  },
  {
    id: "signUp",
    title: t("Sign Up"),
    icon: "nc-add",
    component: SignUp
  }
];

export type PromptAuthorizationProps = {
  opened: boolean;
  config: ConfigCommon;
  onClose: () => void;
};

const PromptAuthorization = ({
  opened,
  config,
  onClose
}: PromptAuthorizationProps): ReactElement => {
  const tabs = getTabs();

  const checkCompatibilityAfter = isWp(config);

  return (
    <Tabs
      opened={opened}
      tabs={tabs}
      currentTab="signIn"
      checkCompatibilityAfter={checkCompatibilityAfter}
      config={config}
      onClose={onClose}
    />
  );
};

export default PromptAuthorization;
