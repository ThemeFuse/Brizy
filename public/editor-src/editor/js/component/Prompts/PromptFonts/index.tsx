import React, { Component, ReactElement } from "react";
import { noop } from "underscore";
import { t } from "visual/utils/i18n";
import Tabs from "../common/GlobalApps/Tabs";
import FontLists from "./FontLists";
import Integration from "./Integration";

const TABS = [
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
    component: FontLists
  }
];

type Props = {
  opened: boolean;
  onClose: () => void;
}

class PromptFonts extends Component<Props> {
  static defaultProps = {
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { opened, onClose } = this.props;
    return (
      <Tabs
        opened={opened}
        tabs={TABS}
        currentTab="upload"
        blockTabsWhenLoading={false}
        onClose={onClose}
      />
    );
  }
}

export default PromptFonts;
