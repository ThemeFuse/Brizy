import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";

import Service from "./Service";
import Email from "./Email";
// import Recaptcha from "./Recaptcha";

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
  }
  // {
  //   id: "recaptcha",
  //   title: t("ReCAPTCHA"),
  //   icon: "nc-captcha",
  //   component: Recaptcha
  // }
];

class PromptForm extends Component {
  static defaultProps = {
    onClose: _.noop
  };

  render() {
    return <Tabs {...this.props} tabs={TABS} currentTab="email" />;
  }
}

export default PromptForm;
