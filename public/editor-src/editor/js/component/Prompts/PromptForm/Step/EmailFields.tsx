import React, { Component, ReactElement } from "react";
import { IS_PRO } from "visual/utils/env";
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
    name: "fromName",
    title: t("From Name"),
    ...(IS_PRO ? helper : {})
  }
];

type Props = {
  onClose: () => void;
};

class EmailFields extends Component<
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

export default EmailFields;
