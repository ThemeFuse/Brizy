import React, { Component, ReactElement } from "react";
import { isPro } from "visual/utils/env";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import Config from "visual/global/Config";
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

const getApiKeys = (config: ConfigCommon) => {
  const is_pro = isPro(config);

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
      ...(is_pro ? helper : {})
    },
    {
      name: "fromName",
      title: t("From Name"),
      ...(is_pro ? helper : {})
    }
  ];
};

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
      <Smtp
        {...this.context}
        apiKeys={getApiKeys(Config.getAll())}
        onClose={this.props.onClose}
      />
    );
  }
}

export default EmailFields;
