import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import Smtp from "./common/Smtp";
import { Context } from "../../common/GlobalApps/Context";

const apiKeys = [
  { name: "emailTo", title: t("Email To") },
  { name: "subject", title: t("Subject") },
  { name: "host", title: t("Host") },
  { name: "port", title: t("Port") },
  { name: "authentication", title: t("Authentication"), type: "switch" },
  { name: "username", title: t("Username") },
  { name: "password", title: t("Password") },
  {
    name: "encryption",
    title: t("Encryption"),
    type: "select",
    choices: [{ title: "SSL", name: "ssl" }, { title: "TLS", name: "tls" }]
  }
];

class SmtpFields extends Component {
  static contextType = Context;

  render() {
    return <Smtp {...this.props} {...this.context} apiKeys={apiKeys} />;
  }
}

export default SmtpFields;
