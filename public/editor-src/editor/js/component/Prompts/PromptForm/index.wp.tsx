import React, { Component, ReactElement } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import { FormField } from "../common/GlobalApps/type";

import Service from "./Service";
import Email from "./Email";
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

class PromptWPForm extends Component<Props> {
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
        tabs={TABS}
        onClose={onClose}
      />
    );
  }
}

export default PromptWPForm;
