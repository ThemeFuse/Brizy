import { noop } from "es-toolkit";
import React, { Component, ReactElement } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import { FormField } from "../common/GlobalApps/type";
import Email from "./Email";
import Recaptcha from "./Recaptcha";
import Service from "./Service";

const getTabs = () => [
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

type Props = {
  formId: string;
  formFields: FormField[];
  opened: boolean;
  config: ConfigCommon;
  onClose: () => void;
};

class PromptWPForm extends Component<Props> {
  static defaultProps = {
    formId: "",
    formFields: [],
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { formId, formFields, opened, config, onClose } = this.props;
    const tabs = getTabs();

    return (
      <Tabs
        currentTab="email"
        formId={formId}
        formFields={formFields}
        opened={opened}
        tabs={tabs}
        config={config}
        onClose={onClose}
      />
    );
  }
}

export default PromptWPForm;
