import classnames from "classnames";
import React, {
  Component,
  ComponentType,
  ReactElement,
  ReactNode
} from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import Fixed from "visual/component/Prompts/Fixed";
import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { BlockMetaType } from "visual/types";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { get } from "visual/utils/object/get";
import { capitalize } from "visual/utils/string";
import Blocks from "./Blocks";
import Global from "./Global";
import Layouts from "./Layouts";
import Library from "./Library";
import {
  PromptBlock,
  PromptBlockTemplate,
  PromptBlocksProps,
  PromptBlocksState,
  PromptTabsId
} from "./types";

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

const getTabs = (config: ConfigCommon, type: BlockMetaType): Array<Tab> => {
  const { defaultLayouts, defaultStories, defaultKits, defaultPopups } =
    config.api ?? {};

  const hasDefaultLayouts =
    !!defaultLayouts?.getMeta && !!defaultLayouts?.getData;

  const hasDefaultStories =
    !!defaultStories?.getMeta && !!defaultStories?.getData;

  const hasDefaultKits = !!defaultKits?.getMeta && !!defaultKits?.getData;
  const hasDefaultPopups = !!defaultPopups?.getMeta && !!defaultPopups?.getData;

  const _isStory = isStory(Config.getAll());
  const _isPopup = type === "popup";
  const tabs: Array<Tab> = [];

  if (hasDefaultStories && _isStory) {
    tabs.push({
      id: "template",
      title: defaultStories?.label ?? t("Stories"),
      icon: "nc-pages",
      renderTab(props: TabComponentProps): ReactElement {
        return <Layouts {...props} type="stories" />;
      }
    });
  }

  if (hasDefaultLayouts && !_isStory) {
    tabs.push({
      id: "template",
      title: defaultLayouts?.label ?? t("Layouts"),
      icon: "nc-pages",
      renderTab(props: TabComponentProps): ReactElement {
        return <Layouts {...props} type="layouts" />;
      }
    });
  }

  if (hasDefaultKits && !_isPopup) {
    tabs.push({
      id: "blocks",
      title: defaultKits?.label ?? t("Blocks"),
      icon: "nc-blocks",
      renderTab(props: TabComponentProps): ReactElement {
        return <Blocks {...props} />;
      }
    });
  }

  if (hasDefaultPopups && _isPopup) {
    tabs.push({
      id: "blocks",
      title: defaultPopups?.label ?? t("Popups"),
      icon: "nc-blocks",
      renderTab(props: TabComponentProps): ReactElement {
        return <Blocks {...props} />;
      }
    });
  }

  const globalBlockTab: Tab = {
    id: "global",
    title: isPopup(config) ? t("Global Popups") : t("Global Blocks"),
    icon: "nc-global",
    renderTab(props): ReactElement {
      // @ts-expect-error -- Need to rewrite to TSX
      return <Global {...props} />;
    }
  };
  const { savedLayouts, savedBlocks, savedPopups } = config.api ?? {};
  const hasLayout = savedLayouts?.get && savedLayouts?.getByUid;
  const hasBlock = savedBlocks?.get && savedBlocks?.getByUid;
  const hasPopup = savedPopups?.get && savedPopups?.getByUid;

  if (!hasBlock && !hasLayout && !hasPopup) {
    return [...tabs, globalBlockTab];
  }

  if (isPopup(config) && hasPopup) {
    return [
      ...tabs,
      {
        id: "saved",
        title: t("Saved Popups"),
        icon: "nc-save-section",
        renderTab(props): ReactElement {
          return <Library {...props} />;
        }
      },
      globalBlockTab
    ];
  }

  if (hasLayout || hasBlock) {
    return [
      ...tabs,
      {
        id: "saved",
        title: t("Saved"),
        icon: "nc-save-section",
        renderTab(props): ReactElement {
          return <Library {...props} />;
        }
      },
      globalBlockTab
    ];
  }

  return tabs;
};

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

  wrapper = React.createRef<HTMLDivElement>();

  mounted = false;

  tabs = getTabs(Config.getAll(), this.props.type);

  state: PromptBlocksState = {
    currentTab: this.props.activeTab || "blocks"
  };

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
    const { onChangeBlocks, onChangeGlobal, onChangeSaved, onChangeTemplate } =
      this.props;

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

    const headerTabs = this.tabs.filter(filterTabs).map((tab) => {
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

    const _config = Config.getAll();
    const helpIcon = _config?.ui?.help?.showIcon;

    return (
      <div className="brz-ed-popup-two-header">
        <div id="brz-ed-popup-header-left-slot" />
        <div className="brz-ed-popup-two-header__tabs">{headerTabs}</div>
        <div id="brz-ed-popup-header-right-slot" />
        <div
          className="brz-ed-popup-two-btn-close"
          onClick={this.props.onClose}
        />
        {helpIcon && (
          <div className="brz-ed-popup-two-btn-help">
            <span title={t("Help")}>
              <EditorIcon icon={"nc-help"} />
            </span>
          </div>
        )}
      </div>
    );
  }

  renderContent(): ReactElement {
    const { currentTab } = this.state;
    const { renderTab } =
      this.tabs.find(({ id }) => id === currentTab) || this.tabs[0];
    const HeaderSlotLeft = (props: Record<string, unknown>): ReactElement => (
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
