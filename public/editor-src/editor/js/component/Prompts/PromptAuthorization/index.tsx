import React from "react";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { PromptAuthorizationTabs } from "./types";

const TABS: PromptAuthorizationTabs[] = [
  {
    id: "signIn",
    title: t("Cloud"),
    icon: "nc-upload",
    component: SignIn
  },
  {
    id: "signUp",
    title: t("SignUp"),
    icon: "nc-add",
    component: SignUp
  }
];

export type PromptAuthorizationProps = {
  opened: boolean;
  onClose: () => void;
};

const PromptAuthorization: React.FC<PromptAuthorizationProps> = ({
  opened,
  onClose
}) => {
  return (
    <Tabs opened={opened} tabs={TABS} currentTab="signIn" onClose={onClose} />
  );
};

export default PromptAuthorization;
