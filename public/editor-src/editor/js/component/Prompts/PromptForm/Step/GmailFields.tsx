import React, { Component, ReactElement } from "react";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import {
  BaseIntegrationContext,
  FormField
} from "../../common/GlobalApps/type";
import { HelperCopy } from "./common/HelperToolip";
import Smtp from "./common/Smtp";

const helper = {
  helper(fields: FormField[]): ReactElement {
    return (
      <HelperCopy
        descriptions={t("You can use these shortcodes in your email:")}
        fields={fields}
      />
    );
  }
};

const getApiKeys = (isPro: boolean) => {
  return [
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
      ...(isPro ? helper : {})
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
      ...(isPro ? helper : {})
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
        { title: t("TIME"), value: "time" },
        { title: t("Page URL"), value: "pageUrl" },
        { title: t("User Agent"), value: "userAgent" },
        { title: t("Remote IP"), value: "remoteIp" },
        { title: t("Credit"), value: "credit" }
      ]
    },
    { name: "username", title: t("Username"), required: true },
    { name: "password", title: t("Password"), required: true }
  ];
};

type Props = {
  isPro: boolean;
  onClose: () => void;
};

class GmailFields extends Component<
  Props,
  Record<string, never>,
  BaseIntegrationContext
> {
  static contextType = Context;

  render(): ReactElement {
    return (
      <Smtp
        {...this.props}
        {...this.context}
        apiKeys={getApiKeys(this.props.isPro)}
      />
    );
  }
}

export default GmailFields;
