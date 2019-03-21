import React, { Component } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

import Layouts from "./Layouts";
import Blocks from "./Blocks";
import Saved from "./Saved";
import Global from "./Global";

const tabs = [
  {
    id: "templates",
    title: t("Layouts"),
    icon: "nc-pages",
    component: Layouts
  },
  {
    id: "blocks",
    title: t("Blocks"),
    icon: "nc-blocks",
    component: Blocks
  },
  {
    id: "saved",
    title: t("Saved Blocks"),
    icon: "nc-save-section",
    component: Saved
  },
  {
    id: "global",
    title: t("Global Blocks"),
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
    const { filterUI, onClose } = this.props;
    const className = classnames("brz-ed-popup-two-header__tabs", {
      "brz-ed-popup-two-header__tabs-fullWidth": filterUI && !filterUI.search
    });
    const headerTabs = tabs
      .filter(tab => {
        const { shouldRender } = tab.component;

        return (
          typeof shouldRender === "undefined" ||
          (typeof shouldRender === "function" && shouldRender(this.props))
        );
      })
      .map(tab => {
        const className = classnames("brz-ed-popup-two-tab-item", {
          "brz-ed-popup-two-tab-item-active": tab.id === currentTab
        });

        return (
          <div
            key={tab.id}
            className={className}
            onClick={() => this.handleTabChange(tab.id)}
          >
            <div className="brz-ed-popup-two-tab-icon">
              <EditorIcon icon={tab.icon} />
            </div>
            <div className="brz-ed-popup-two-tab-name">{tab.title}</div>
          </div>
        );
      });

    return (
      <div className="brz-ed-popup-two-header">
        <div id="brz-ed-popup-header-left-slot" />
        <div className={className}>{headerTabs}</div>
        <div className="brz-ed-popup-two-btn-close" onClick={onClose} />
      </div>
    );
  }

  render() {
    const { currentTab } = this.state;
    const Content = tabs.find(tab => tab.id === currentTab).component;

    return (
      <Fixed onClose={this.props.onClose}>
        <div className="brz-ed-popup-two-wrapper brz-ed-popup-two-blocks">
          {this.renderHeader()}
          <div className="brz-ed-popup-two-body">
            <Content {...this.props} HeaderSlotLeft={HeaderSlotLeft} />
          </div>
        </div>
      </Fixed>
    );
  }
}

export class HeaderSlotLeft extends Component {
  state = {
    isMounted: false
  };

  headerSlotNode;

  componentDidMount() {
    // the fact that HeaderSlotLeft is aware of which
    // the id of the slot div that is rendered by PromptBlocks
    // and the fact that all modals are rendered in the parent window
    // is too hardcoded, but it will have to do until we figure a better way
    this.headerSlotNode = window.parent.document.querySelector(
      "#brz-ed-popup-header-left-slot"
    );
    this.setState({ isMounted: true });
  }

  render() {
    return (
      this.state.isMounted &&
      ReactDOM.createPortal(this.props.children, this.headerSlotNode)
    );
  }
}

export default PromptBlocks;
