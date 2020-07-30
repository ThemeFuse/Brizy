import React, { Component, ReactElement } from "react";
import { noop } from "underscore";
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

type Props = {
  service: string;
  group: string;
  opened: boolean;
  onClose: () => void;
}

class PromptApps extends Component<Props> {
  static defaultProps = {
    service: "facebook",
    group: "social",
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { service, group, opened, onClose } = this.props;

    return (
      <Tabs
        currentTab="app"
        service={service}
        group={group}
        opened={opened}
        tabs={TABS}
        onClose={onClose}
      />
    );
  }
}

export default PromptApps;
