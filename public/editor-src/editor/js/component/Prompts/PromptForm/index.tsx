import { noop } from "es-toolkit";
import React, { Component, ReactElement } from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import Tabs from "../common/GlobalApps/Tabs";
import type { FormField } from "../common/GlobalApps/type";
import type { ConfigTab } from "./types";
import { getTabs } from "./utils";

interface Props {
  formId: string;
  formFields: FormField[];
  tabs?: ConfigTab[];
  opened?: boolean;
  config: ConfigCommon;
  onClose?: () => void;
}

class PromptForm extends Component<Props> {
  static defaultProps = {
    formId: "",
    formFields: [],
    opened: false,
    onClose: noop
  };

  render(): ReactElement {
    const { formId, formFields, tabs, opened, config, onClose } = this.props;

    const _tabs = getTabs(tabs);
    const currentTab = _tabs[0].id;

    return (
      <Tabs
        currentTab={currentTab}
        formId={formId}
        formFields={formFields}
        opened={opened}
        blockTabsWhenLoading={false}
        tabs={_tabs}
        config={config}
        onClose={onClose}
      />
    );
  }
}

export default PromptForm;
