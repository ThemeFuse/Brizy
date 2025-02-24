import { noop } from "es-toolkit";
import React, { Component, ReactElement } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import Integration from "./Integration";
import { List } from "./List";

const getTabs = () => [
  {
    id: "upload",
    title: t("Add New"),
    icon: "nc-add",
    component: Integration
  },
  {
    id: "fonts",
    title: t("Fonts"),
    icon: "nc-font",
    component: List
  }
];

type Props = {
  opened: boolean;
  onClose: () => void;
  config: ConfigCommon;
};

class PromptFonts extends Component<Props> {
  static defaultProps = {
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { opened, onClose, config } = this.props;
    return (
      <Tabs
        opened={opened}
        tabs={getTabs()}
        currentTab="upload"
        blockTabsWhenLoading={false}
        onClose={onClose}
        config={config}
      />
    );
  }
}

export default PromptFonts;
