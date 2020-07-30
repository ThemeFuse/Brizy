import React, { Component, ReactElement } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import { FormField } from "../common/GlobalApps/type";

import Email from "./Email";
import Service from "./Service";
import Recaptcha from "./Recaptcha";

const TABS = [
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
  onClose: () => void;
}

class PromptForm extends Component<Props> {
  static defaultProps = {
    formId: "",
    formFields: [],
    opened: false,
    onClose: _.noop
  };

  render(): ReactElement {
    const { formId, formFields, opened, onClose } = this.props;
    return (
      <Tabs
        currentTab="email"
        formId={formId}
        formFields={formFields}
        opened={opened}
        blockTabsWhenLoading={false}
        tabs={TABS}
        onClose={onClose}
      />
    );
  }
}

export default PromptForm;
