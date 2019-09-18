import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import Smtp from "./common/Smtp";
import { Context } from "../../common/GlobalApps/Context";

const apiKeys = [
  { name: "emailTo", title: t("Email To") },
  { name: "subject", title: t("Subject") },
  { name: "username", title: t("Username") },
  { name: "password", title: t("Password") }
];

class GmailFields extends Component {
  static contextType = Context;

  render() {
    return <Smtp {...this.props} {...this.context} apiKeys={apiKeys} />;
  }
}

export default GmailFields;
