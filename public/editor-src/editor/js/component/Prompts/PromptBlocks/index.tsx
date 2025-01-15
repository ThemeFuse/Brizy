import { foundUrl } from "@brizy/builder-ui-components";
import classnames from "classnames";
import React, {
  Component,
  ComponentType,
  PropsWithChildren,
  ReactElement
} from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import HelpIcon from "visual/component/HelpIcon";
import Fixed from "visual/component/Prompts/Fixed";
import {
  ConfigCommon,
  HelpVideos
} from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode, isPopup, isStory } from "visual/global/EditorModeContext";
import { BlockMetaType } from "visual/types";
import { t } from "visual/utils/i18n";
import { get } from "visual/utils/object/get";
import { capitalize } from "visual/utils/string";
import Blocks from "./Blocks";
import Global from "./Global";
import { PromptGlobalBlock } from "./Global/types";
import Layouts from "./Layouts";
import Library from "./Library";
import {
  PromptBlock,
  PromptBlockTemplate,
  PromptBlocksProps,
  PromptBlocksState,
  PromptTabsId
} from "./types";

interface OnChanges<T extends BlockMetaType> {
  blocks: PromptBlock;
  template: PromptBlockTemplate;
  saved: PromptBlockTemplate;
  global: PromptGlobalBlock<T>;
}

interface TabComponentProps<T extends BlockMetaType, A extends PromptTabsId> {
  type: T;
  showSearch: boolean;
  showSidebar: boolean;
  HeaderSlotLeft: ComponentType;
  onClose: VoidFunction;
  onAddBlocks: (block: OnChanges<T>[A]) => void;
  getParentNode?: () => HTMLElement | null;
  config: ConfigCommon;
  editorMode: EditorMode;
}

interface Tab<ID extends PromptTabsId, T extends BlockMetaType> {
  id: ID;
  title: string;
  icon: string;
  renderTab(props: TabComponentProps<T, ID>): ReactElement;
}

const getTabs = <T extends BlockMetaType>(
  config: ConfigCommon["api"],
  type: BlockMetaType,
  editorMode: EditorMode
): Array<Tab<PromptTabsId, T>> => {
  const { defaultLayouts, defaultStories, defaultKits, defaultPopups } =
    config ?? {};

  const hasDefaultLayouts =
    !!defaultLayouts?.getMeta && !!defaultLayouts?.getData;

  const hasDefaultStories =
    !!defaultStories?.getMeta && !!defaultStories?.getData;

  const hasDefaultKits = !!defaultKits?.getMeta && !!defaultKits?.getData;
  const hasDefaultPopups = !!defaultPopups?.getMeta && !!defaultPopups?.getData;

  const _isStory = isStory(editorMode);
  const _isPopup = isPopup(editorMode);
  const _isPopupBlock = type === "popup";
  const tabs: Array<Tab<"template" | "blocks", T>> = [];

  if (hasDefaultStories && _isStory) {
    tabs.push({
      id: "template",
      title: defaultStories?.label ?? t("Stories"),
      icon: "nc-pages",
      renderTab(props): ReactElement {
        return <Layouts {...props} type="stories" />;
      }
    });
  }

  if (hasDefaultLayouts && !_isStory) {
    tabs.push({
      id: "template",
      title: defaultLayouts?.label ?? t("Layouts"),
      icon: "nc-pages",
      renderTab(props): ReactElement {
        return <Layouts {...props} type="layouts" />;
      }
    });
  }

  if (hasDefaultKits && !_isPopupBlock) {
    tabs.push({
      id: "blocks",
      title: defaultKits?.label ?? t("Blocks"),
      icon: "nc-blocks",
      renderTab(props): ReactElement {
        return <Blocks {...props} />;
      }
    });
  }

  if (hasDefaultPopups && _isPopupBlock) {
    tabs.push({
      id: "blocks",
      title: defaultPopups?.label ?? t("Popups"),
      icon: "nc-blocks",
      renderTab(props): ReactElement {
        return <Blocks {...props} />;
      }
    });
  }

  const globalBlockTab: Tab<"global", T> = {
    id: "global",
    title: _isPopup ? t("Global Popups") : t("Global Blocks"),
    icon: "nc-global",
    renderTab(props): ReactElement {
      return <Global {...props} />;
    }
  };
  const { savedLayouts, savedBlocks, savedPopups } = config ?? {};
  const hasLayout = savedLayouts?.get && savedLayouts?.getByUid;
  const hasBlock = savedBlocks?.get && savedBlocks?.getByUid;
  const hasPopup = savedPopups?.get && savedPopups?.getByUid;

  if (!hasBlock && !hasLayout && !hasPopup) {
    return [...tabs, globalBlockTab];
  }

  if (_isPopup && hasPopup) {
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

type Props<T extends BlockMetaType> = {
  editorMode: EditorMode;
} & PromptBlocksProps<T>;

class PromptBlocks<T extends BlockMetaType> extends Component<
  Props<T>,
  PromptBlocksState
> {
  static defaultProps: PromptBlocksProps<BlockMetaType> = {
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
    onClose: _.noop,
    config: {} as ConfigCommon
  };

  wrapper = React.createRef<HTMLDivElement>();

  mounted = false;

  tabs = getTabs<T>(
    this.props.config?.api,
    this.props.type,
    this.props.editorMode
  );

  state: PromptBlocksState = {
    currentTab: this.props.activeTab || "blocks",
    isHelpVideoOpened: false
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
    return !!get(
      `${currentTab}Search` as keyof PromptBlocksProps<T>,
      this.props
    );
  }

  hasSidebar(currentTab: PromptTabsId): boolean {
    return !!get(
      `${currentTab}Sidebar` as keyof PromptBlocksProps<T>,
      this.props
    );
  }

  handleTabChange(tabId: PromptTabsId): void {
    this.setState({ currentTab: tabId });
  }

  handleHelpIconClick = (): void => {
    this.setState((prevState) => ({
      isHelpVideoOpened: !prevState.isHelpVideoOpened
    }));
  };

  handleChange = (block: OnChanges<T>[PromptTabsId]): void => {
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
        onChangeGlobal?.(block as PromptGlobalBlock<T>);
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

    const filterTabs = ({ id }: Tab<PromptTabsId, T>): boolean => {
      const key = `show${capitalize(id)}`;
      return !!get(key as keyof PromptBlocksProps<T>, this.props);
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

    const { video, idHelpVideosIcons } = this.props.config.ui?.help ?? {};

    const idVideoBlocksLayout =
      idHelpVideosIcons?.[HelpVideos.blocksLayoutsHelpVideo];
    const url = foundUrl(video ?? [], idVideoBlocksLayout);

    return (
      <div className="brz-ed-popup-two-header">
        <div id="brz-ed-popup-header-left-slot" />
        <div className="brz-ed-popup-two-header__tabs">{headerTabs}</div>
        <div id="brz-ed-popup-header-right-slot" />
        <div
          className="brz-ed-popup-two-btn-close"
          onClick={this.props.onClose}
        />
        {video && idVideoBlocksLayout && (
          <HelpIcon
            handleHelpIconClick={this.handleHelpIconClick}
            url={url}
            containerClassName="brz-ed-popup-two-btn-help"
            isHelpVideoOpened={this.state.isHelpVideoOpened}
          />
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
      getParentNode: this.getWrapper,
      config: this.props.config,
      editorMode: this.props.editorMode
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

type HeaderSlotProps = PropsWithChildren<{
  slot: "left" | "right";
}>;

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

  render(): JSX.Element {
    return (
      <>
        {this.state.isMounted &&
          this.headerSlotNode &&
          ReactDOM.createPortal(this.props.children, this.headerSlotNode)}
      </>
    );
  }
}

export default PromptBlocks;
