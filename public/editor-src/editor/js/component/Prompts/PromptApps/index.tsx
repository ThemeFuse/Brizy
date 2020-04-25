import React, { Component, ReactElement } from "react";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import Integration from "./Integration";

const TABS = [
  {
    id: "app",
    title: t("APPS"),
    icon: "nc-extensions-2",
    component: Integration
  }
];

class PromptApps extends Component {
  static defaultProps = {
    value: {
      service: "facebook",
      group: "social"
    }
  };

  render(): ReactElement {
    return <Tabs {...this.props} tabs={TABS} currentTab="app" />;
  }
}

export default PromptApps;
