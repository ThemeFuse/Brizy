import React, {
  Component,
  ComponentType,
  ReactElement,
  ReactNode
} from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classnames from "classnames";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { get } from "visual/utils/object/get";
import { capitalize } from "visual/utils/string";

import Layouts from "./Layouts";
import Blocks from "./Blocks";
import Global from "./Global";
import Library from "./Library";
import {
  PromptBlocksState,
  PromptBlocksProps,
  PromptTabsId,
  PromptBlock,
  PromptBlockTemplate
} from "./types";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";

type Tab = {
  id: PromptTabsId;
  title: string;
  icon: string;
  renderTab(props: TabComponentProps): ReactElement;
};

type TabComponentProps = {
  type: "normal" | "popup";
  showSearch: boolean;
  showSidebar: boolean;
  HeaderSlotLeft: ComponentType;
  onClose: VoidFunction;
  onAddBlocks: (block: PromptBlockTemplate | PromptBlock) => void;
  getParentNode?: () => HTMLElement | null;
};

const TABS: Tab[] = [
  {
    id: "template",
    title: IS_STORY ? t("Stories") : t("Layouts"),
    icon: "nc-pages",
    renderTab(props): ReactElement {
      return <Layouts {...props} type={IS_STORY ? "stories" : "templates"} />;
    }
  },
  {
    id: "blocks",
    title: IS_GLOBAL_POPUP ? t("Popups") : t("Blocks"),
    icon: "nc-blocks",
    renderTab(props): ReactElement {
      return <Blocks {...props} />;
    }
  },
  {
    id: "saved",
    title: IS_GLOBAL_POPUP ? t("Saved Popups") : t("Saved"),
    icon: "nc-save-section",
    renderTab(props): ReactElement {
      return <Library {...props} />;
    }
  },
  {
    id: "global",
    title: IS_GLOBAL_POPUP ? t("Global Popups") : t("Global Blocks"),
    icon: "nc-global",
    renderTab(props): ReactElement {
      return <Global {...props} />;
    }
  }
];

class PromptBlocks extends Component<PromptBlocksProps, PromptBlocksState> {
  static defaultProps: PromptBlocksProps = {
    activeTab: "blocks",
    type: "normal",
    opened: false,

    showTemplate: true,
    showBlocks: true,
    showSaved: true,
    showGlobal: true,

    templateSidebar: true,
    blocksSidebar: true,
    savedSidebar: true,
    globalSidebar: true,

    templateSearch: true,
    blocksSearch: true,
    savedSearch: true,
    globalSearch: true,

    onChangeBlocks: _.noop,
    onChangeTemplate: _.noop,
    onChangeSaved: _.noop,
    onChangeGlobal: _.noop,
    onClose: _.noop
  };

  state: PromptBlocksState = {
    currentTab: this.props.activeTab || "blocks"
  };

  wrapper = React.createRef<HTMLDivElement>();

  mounted = false;

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  getWrapper = (): HTMLElement | null => {
    return this.wrapper.current;
  };

  hasSearch(currentTab: PromptTabsId): boolean {
    return !!get(`${currentTab}Search` as keyof PromptBlocksProps, this.props);
  }

  hasSidebar(currentTab: PromptTabsId): boolean {
    return !!get(`${currentTab}Sidebar` as keyof PromptBlocksProps, this.props);
  }

  handleTabChange(tabId: PromptTabsId): void {
    this.setState({ currentTab: tabId });
  }

  handleChange = (block: PromptBlock | PromptBlockTemplate): void => {
    const { currentTab } = this.state;
    const {
      onChangeBlocks,
      onChangeGlobal,
      onChangeSaved,
      onChangeTemplate
    } = this.props;

    switch (currentTab) {
      case "blocks": {
        onChangeBlocks?.(block as PromptBlock);
        break;
      }
      case "template": {
        onChangeTemplate?.(block as PromptBlockTemplate);
        break;
      }
      case "saved": {
        onChangeSaved?.(block as PromptBlockTemplate);
        break;
      }
      case "global": {
        onChangeGlobal?.(block as PromptBlock);
        break;
      }
    }
  };

  handleClose = (): void => {
    if (this.mounted) {
      this.props.onClose?.();
      // this.setState({ currentTab: defaultActiveTab }, () => {
      //   this.props.onClose && this.props.onClose();
      // });
    }
  };

  renderTabs(): ReactElement {
    const { currentTab } = this.state;
    const filterTabs = ({ id }: Tab): boolean => {
      const key = `show${capitalize(id)}`;
      return !!get(key as keyof PromptBlocksProps, this.props);
    };
    const headerTabs = TABS.filter(filterTabs).map(tab => {
      const className = classnames("brz-ed-popup-two-tab-item", {
        "brz-ed-popup-two-tab-item-active": tab.id === currentTab
      });

      return (
        <div
          key={tab.id}
          className={className}
          onClick={(): void => {
            this.handleTabChange(tab.id);
          }}
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
        <div
          className="brz-ed-popup-two-btn-close"
          onClick={this.props.onClose}
        />
      </div>
    );
  }

  renderContent(): ReactElement {
    const { currentTab } = this.state;
    const { renderTab } = TABS.find(({ id }) => id === currentTab) || TABS[0];
    const HeaderSlotLeft = (props: object): ReactElement => (
      <HeaderSlot {...props} slot="left" />
    );

    return renderTab({
      HeaderSlotLeft,
      type: this.props.type,
      onClose: this.handleClose,
      showSearch: this.hasSearch(currentTab),
      showSidebar: this.hasSidebar(currentTab),
      onAddBlocks: this.handleChange,
      getParentNode: this.getWrapper
    });
  }

  render(): ReactElement {
    return (
      <Fixed opened={this.props.opened} onClose={this.handleClose}>
        <div
          ref={this.wrapper}
          className="brz-ed-popup-two-wrapper brz-ed-popup-two-blocks"
        >
          {this.renderTabs()}
          <div className="brz-ed-popup-two-body">{this.renderContent()}</div>
        </div>
      </Fixed>
    );
  }
}

type HeaderSlotProps = {
  slot: "left" | "right";
};

type HeaderSlotState = {
  isMounted: boolean;
};

export class HeaderSlot extends Component<HeaderSlotProps, HeaderSlotState> {
  static defaultProps: HeaderSlotProps = {
    slot: "left"
  };

  state: HeaderSlotState = {
    isMounted: false
  };

  headerSlotNode: HTMLElement | null = null;

  componentDidMount(): void {
    // the fact that HeaderSlotLeft is aware of which
    // the id of the slot div that is rendered by PromptBlocks
    // and the fact that all modals are rendered in the parent window
    // is too hardcoded, but it will have to do until we figure a better way
    this.headerSlotNode = window.parent.document.querySelector(
      `#brz-ed-popup-header-${this.props.slot}-slot`
    );
    this.setState({ isMounted: true });
  }

  render(): ReactNode {
    return (
      this.state.isMounted &&
      this.headerSlotNode &&
      ReactDOM.createPortal(this.props.children, this.headerSlotNode)
    );
  }
}

export default PromptBlocks;
