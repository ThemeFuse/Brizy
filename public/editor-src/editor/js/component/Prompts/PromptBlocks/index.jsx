import React, { Component } from "react";
import classnames from "classnames";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

import Templates from "./Templates";
import Blocks from "./Blocks";
import Saved from "./Saved";
import Global from "./Global";

const tabs = [
  {
    id: "templates",
    title: t("Pages"),
    icon: "nc-pages",
    component: Templates
  },
  {
    id: "blocks",
    title: t("Blocks"),
    icon: "nc-blocks",
    component: Blocks
  },
  {
    id: "saved",
    title: t("Saved"),
    icon: "nc-save-section",
    component: Saved
  },
  {
    id: "global",
    title: t("Global"),
    icon: "nc-global",
    component: Global
  }
];

class PromptBlocks extends Component {
  state = {
    currentTab: "blocks"
  };

  handleTabChange(tabId) {
    this.setState({ currentTab: tabId });
  }

  renderHeader() {
    const { currentTab } = this.state;
    const { onClose } = this.props;

    const headerTabs = tabs
      .filter(tab => {
        const { shouldRender } = tab.component;

        return (
          typeof shouldRender === "undefined" ||
          (typeof shouldRender === "function" && shouldRender(this.props))
        );
      })
      .map(tab => {
        const className = classnames("brz-ed-popup-tab-item", {
          active: tab.id === currentTab
        });

        return (
          <div
            key={tab.id}
            className={className}
            onClick={() => this.handleTabChange(tab.id)}
          >
            <div className="brz-ed-popup-tab-icon">
              <EditorIcon icon={tab.icon} />
            </div>
            <div className="brz-ed-popup-tab-name">{tab.title}</div>
          </div>
        );
      });

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{headerTabs}</div>
        <div className="brz-ed-popup-btn-close" onClick={onClose} />
      </div>
    );
  }

  render() {
    const { currentTab } = this.state;
    const Content = tabs.find(tab => tab.id === currentTab).component;

    return (
      <Fixed onClose={this.props.onClose}>
        <div className="brz-ed-popup-wrapper brz-ed-popup-blocks">
          {this.renderHeader()}
          <div className="brz-ed-popup-content brz-ed-popup-pane">
            <div className="brz-ed-popup-body">
              <Content {...this.props} />
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}

export default PromptBlocks;
