import { Sidebar } from "@brizy/builder-ui-components";
import classnames from "classnames";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { RenderEmpty } from "visual/component/RightSidebar/Components/RenderEmpty";
import { RenderItems } from "visual/component/RightSidebar/Components/RenderItems";
import { CLEAR_ITEMS_TIMEOUT, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH } from "visual/component/RightSidebar/utils";
import { Scrollbar } from "visual/component/Scrollbar";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { updateUI } from "visual/redux/actions2";
import { deviceModeSelector, uiSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { HelpSidebar } from "./HelpSidebar";

export let instance: RightSidebarInner | undefined;

const mapStateToProps = (state: ReduxState) => {
  const { isOpen, lock, alignment, activeTab, type, expanded } =
    uiSelector(state).rightSidebar;

  return {
    type,
    isOpen,
    lock,
    alignment,
    activeTab,
    expanded,
    deviceMode: deviceModeSelector(state)
  };
};
const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

export class RightSidebarInner extends React.Component<Props> {
  static defaultProps: Props = {
    type: "options",
    isOpen: false,
    lock: undefined,
    alignment: "right",
    deviceMode: "desktop",
    dispatch: (action) => action,
    activeTab: undefined,
    expanded: false
  };

  getItems: undefined | (() => OptionDefinition[]);

  getTitle: undefined | (() => string);

  clearItemsTimeoutId = 0;

  unmounted = false;

  componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.deviceMode !== this.props.deviceMode) {
      this.getItems = undefined;
      this.getTitle = undefined;
    }
  }

  componentWillUnmount(): void {
    this.unmounted = true;
    instance = undefined;
  }

  onLockClick = (): void => {
    const { isOpen, lock, alignment, activeTab, type, expanded } = this.props;
    const items = this.getItems !== undefined ? this.getItems() : undefined;
    const newStore = {
      type,
      activeTab,
      alignment,
      lock: lock === "manual" ? undefined : ("manual" as const),
      isOpen:
        lock !== undefined && (items === undefined || items.length === 0)
          ? false
          : isOpen,
      expanded
    };

    this.props.dispatch(updateUI("rightSidebar", newStore));
  };

  setItems(getItems: () => OptionDefinition[], getTitle?: () => string): void {
    window.clearTimeout(this.clearItemsTimeoutId);

    this.getItems = getItems;
    this.getTitle = getTitle;

    if (this.props.isOpen) {
      this.forceUpdate();
    }
  }

  clearItems(): void {
    const { lock, alignment, dispatch, activeTab, type, expanded } = this.props;

    if (lock) {
      // items are cleared after a timeout to prevent switching unnecessarily to empty state
      // for a brief period when one Toolbar unmounts right before another will mount
      // thus causing an unpleasant blink (items from toolbar1 -> empty state -> items from toolbar2)
      this.clearItemsTimeoutId = window.setTimeout(() => {
        this.getItems = undefined;
        this.getTitle = undefined;

        this.forceUpdate();
      }, CLEAR_ITEMS_TIMEOUT);
    } else {
      this.getItems = undefined;
      this.getTitle = undefined;

      const newStore = {
        type,
        isOpen: false,
        lock,
        alignment,
        activeTab,
        expanded
      };

      dispatch(updateUI("rightSidebar", newStore));
    }
  }

  getRenderItems(type: "options" | "help", items?: OptionDefinition[]) {
    if (type === "options" && items && items.length > 0) {
      return <RenderItems items={items} />;
    }

    if (type === "help") {
      return (
        <div className="brz-ed-sidebar__main brz-ed-sidebar__right__options brz-ed-content">
          <HelpSidebar />
        </div>
      );
    }

    return (
      <RenderEmpty
        message={
          items?.length === 0
            ? t("The element you have selected doesn't have more settings")
            : t("Select an element on the page to display more settings")
        }
      />
    );
  }

  render(): React.ReactNode {
    const { isOpen, alignment, type, expanded } = this.props;
    const sidebarClassName = classnames(
      "brz-ed-sidebar",
      "brz-ed-sidebar__right",
      {
        "brz-ed-sidebar__right--align-right": alignment === "right",
        "brz-ed-sidebar__right--align-left": alignment === "left",
        "brz-ed-sidebar__right-large": expanded
      }
    );
    const _items = this.getItems !== undefined ? this.getItems() : undefined;
    const renderData = this.getRenderItems(type, _items);
    return (
      <div className={sidebarClassName}>
        <Sidebar 
          isOpen={isOpen} 
          alignment={alignment}
          width={expanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH}
        >
          <Scrollbar theme="dark">
            <div className="brz-ed-sidebar__right__content">{renderData}</div>
          </Scrollbar>
        </Sidebar>
      </div>
    );
  }
}

export const RightSidebar = connector(RightSidebarInner);
