import React, { Component, ReactElement } from "react";
import { t } from "visual/utils/i18n";
import Smtp from "./common/Smtp";
import { Context, ContextIntegration } from "../../common/GlobalApps/Context";

const apiKeys = [
  {
    name: "emailTo",
    title: t("Email To"),
    required: true,
    helper: `<p class="brz-p">If you need to have multiple emails you can separate them by commas:</p>
             <p class="brz-p"><span class="brz-span">me@email.com,</span> <span class="brz-span">hi@email.com</span></p>`
  },
  { name: "subject", title: t("Subject") },
  { name: "fromName", title: t("From Name") },
  { name: "replyTo", title: t("Reply-To") }
];

type Props = {
  onClose: () => void;
};

class EmailFields extends Component<Props, {}, ContextIntegration> {
  static contextType = Context;

  render(): ReactElement {
    return (
      <Smtp {...this.context} apiKeys={apiKeys} onClose={this.props.onClose} />
    );
  }
}

export default EmailFields;
