import React, { Component, ReactElement } from "react";
import { noop } from "underscore";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import Integration from "./Integration";

const getTabs = () => [
  {
    id: "app",
    title: t("APPS"),
    icon: "nc-extensions-2",
    component: Integration
  }
];

type Props = {
  service: string;
  group: string;
  opened: boolean;
  onClose: () => void;
  config: ConfigCommon;
};

class PromptApps extends Component<Props> {
  static defaultProps = {
    service: "facebook",
    group: "social",
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { service, group, opened, onClose, config } = this.props;
    const tabs = getTabs();

    return (
      <Tabs
        currentTab="app"
        service={service}
        group={group}
        opened={opened}
        tabs={tabs}
        onClose={onClose}
        config={config}
      />
    );
  }
}

export default PromptApps;
