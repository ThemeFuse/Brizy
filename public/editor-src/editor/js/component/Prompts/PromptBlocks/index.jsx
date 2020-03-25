import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP } from "visual/utils/models";

import Layouts from "./Layouts";
import Blocks from "./Blocks";
import Saved from "./Saved";
import Global from "./Global";

const TABS = [
  {
    id: "templates",
    title: t("Layouts"),
    icon: "nc-pages",
    component: Layouts
  },
  {
    id: "blocks",
    title: IS_GLOBAL_POPUP ? t("Popups") : t("Blocks"),
    icon: "nc-blocks",
    component: Blocks
  },
  {
    id: "saved",
    title: IS_GLOBAL_POPUP ? t("Saved Popups") : t("Saved Blocks"),
    icon: "nc-save-section",
    component: Saved
  },
  {
    id: "global",
    title: IS_GLOBAL_POPUP ? t("Global Popups") : t("Global Blocks"),
    icon: "nc-global",
    component: Global
  }
];

class PromptBlocks extends Component {
  static defaultProps = {
    tabs: {},
    tabProps: {},
    onClose: _.noop
  };

  state = {
    currentTab: "blocks"
  };

  handleTabChange(tabId) {
    this.setState({ currentTab: tabId });
  }

  renderTabs() {
    const { currentTab } = this.state;
    const { tabs, onClose } = this.props;
    const headerTabs = TABS.filter(tab => tabs[tab.id] !== false).map(tab => {
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
        <div className="brz-ed-popup-two-header__tabs">{headerTabs}</div>
        <div id="brz-ed-popup-header-right-slot" />
        <div className="brz-ed-popup-two-btn-close" onClick={onClose} />
      </div>
    );
  }

  renderContent() {
    const { tabProps, onClose } = this.props;
    const { currentTab } = this.state;
    const Content = TABS.find(tab => tab.id === currentTab).component;
    const contentProps = tabProps[currentTab];
    const HeaderSlotLeft = props => <HeaderSlot {...props} slot="left" />;
    const HeaderSlotRight = props => <HeaderSlot {...props} slot="right" />;

    return (
      <Content
        onClose={onClose}
        HeaderSlotLeft={HeaderSlotLeft}
        HeaderSlotRight={HeaderSlotRight}
        {...contentProps}
      />
    );
  }

  render() {
    const { onClose } = this.props;

    return (
      <Fixed onClose={onClose}>
        <div className="brz-ed-popup-two-wrapper brz-ed-popup-two-blocks">
          {this.renderTabs()}
          <div className="brz-ed-popup-two-body">{this.renderContent()}</div>
        </div>
      </Fixed>
    );
  }
}

export class HeaderSlot extends Component {
  static propTypes = {
    slot: PropTypes.oneOf(["left", "right"]).isRequired
  };

  static defaultProps = {
    slot: "left"
  };

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
      `#brz-ed-popup-header-${this.props.slot}-slot`
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
