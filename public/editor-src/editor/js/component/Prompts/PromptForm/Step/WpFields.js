import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import Smtp from "./common/Smtp";
import { Context } from "../../common/GlobalApps/Context";

const apiKeys = [
  {
    name: "emailTo",
    title: t("Email To"),
    helper: `<p class="brz-p">If you need to have multiple emails you can separate them by commas:</p>
             <p class="brz-p"><span class="brz-span">me@email.com,</span> <span class="brz-span">hi@email.com</span></p>`
  },
  {
    name: "subject",
    title: t("Subject")
  }
];

class WPFields extends Component {
  static contextType = Context;

  render() {
    return <Smtp {...this.props} {...this.context} apiKeys={apiKeys} />;
  }
}

export default WPFields;
