import React, { Component, ReactElement } from "react";
import { t } from "visual/utils/i18n";
import { IS_PRO } from "visual/utils/env";
import Smtp from "./common/Smtp";
import { HelperCopy } from "./common/HelperToolip";
import { Context } from "../../common/GlobalApps/Context";
import {
  FormField,
  BaseIntegrationContext
} from "../../common/GlobalApps/type";

const helper = {
  helper(fields: FormField[]): ReactElement {
    return (
      <HelperCopy
        descriptions={t("You can use these shortcodes in your email: ")}
        fields={fields}
      />
    );
  }
};

const apiKeys = [
  {
    name: "emailTo",
    title: t("Email To"),
    required: true,
    helper: `<p class="brz-p">${t(
      "If you need to have multiple emails you can separate them by commas"
    )}:</p><p class="brz-p"><span class="brz-span">me@email.com,</span> <span class="brz-span">hi@email.com</span></p>`
  },
  {
    name: "subject",
    title: t("Subject"),
    ...(IS_PRO ? helper : {})
  },
  {
    name: "fromEmail",
    title: t("From Email")
  },
  {
    name: "fromName",
    title: t("From Name")
  },
  {
    name: "replayTo",
    title: t("Reply-To"),
    ...(IS_PRO ? helper : {})
  },
  {
    name: "cc",
    title: t("Cc")
  },
  {
    name: "bcc",
    title: t("Bcc")
  },
  {
    name: "metaData",
    title: t("Meta Data"),
    type: "search",
    multiple: true,
    choices: [
      { label: "Time", value: "time" },
      { label: "Page URL", value: "pageUrl" },
      { label: "User Agent", value: "userAgent" },
      { label: "Remote IP", value: "remoteIp" },
      { label: "Credit", value: "credit" }
    ]
  }
];

type Props = {
  onClose: () => void;
};

class WPEmailFields extends Component<
  Props,
  Record<string, never>,
  BaseIntegrationContext
> {
  static contextType = Context;

  render(): ReactElement {
    return (
      <Smtp {...this.context} apiKeys={apiKeys} onClose={this.props.onClose} />
    );
  }
}

export default WPEmailFields;
