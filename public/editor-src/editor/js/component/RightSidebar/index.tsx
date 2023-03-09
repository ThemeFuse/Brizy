import classnames from "classnames";
import React from "react";
import { MapStateToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import EditorIcon from "visual/component/EditorIcon";
import Options from "visual/component/Options";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ActionUpdateUI, updateUI } from "visual/redux/actions2";
import { deviceModeSelector, uiSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { Scrollbar } from "../Scrollbar";
import { Animation } from "./Animation";

type DeviceModes = ReduxState["ui"]["deviceMode"];
type RightSidebarStore = ReduxState["ui"]["rightSidebar"];
type RightSidebarProps = RightSidebarStore & {
  deviceMode: DeviceModes;
  dispatch: Dispatch<ActionUpdateUI>;
};

export let instance: RightSidebarInner | undefined;

export class RightSidebarInner extends React.Component<RightSidebarProps> {
  static defaultProps: RightSidebarProps = {
    isOpen: false,
    lock: undefined,
    alignment: "right",
    deviceMode: "desktop",
    dispatch: (action) => action,
    activeTab: undefined
  };

  getItems: undefined | (() => OptionDefinition[]);

  getTitle: undefined | (() => string);

  clearItemsTimeoutId = 0;

  unmounted = false;

  componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  componentDidUpdate(prevProps: RightSidebarProps): void {
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
    const { isOpen, lock, alignment, activeTab } = this.props;
    const items = this.getItems !== undefined ? this.getItems() : undefined;
    const newStore: RightSidebarStore = {
      activeTab,
      alignment,
      lock: lock === "manual" ? undefined : "manual",
      isOpen:
        lock !== undefined && (items === undefined || items.length === 0)
          ? false
          : isOpen
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
    const { lock, alignment, dispatch, activeTab } = this.props;

    if (lock) {
      // items are cleared after a timeout to prevent switching unnecessarily to empty state
      // for a brief period when one Toolbar unmounts right before another will mount
      // thus causing an unpleasant blink (items from toolbar1 -> empty state -> items from toolbar2)
      this.clearItemsTimeoutId = window.setTimeout(() => {
        this.getItems = undefined;
        this.getTitle = undefined;

        this.forceUpdate();
      }, 150);
    } else {
      this.getItems = undefined;
      this.getTitle = undefined;

      const newStore: RightSidebarStore = {
        isOpen: false,
        lock,
        alignment,
        activeTab
      };

      dispatch(updateUI("rightSidebar", newStore));
    }
  }

  renderEmpty(message: string): React.ReactNode {
    return (
      <div className="brz-ed-sidebar__right__empty">
        <EditorIcon
          icon="nc-settings"
          className="brz-ed-sidebar__right__empty-icon"
        />
        <div className="brz-ed-sidebar__right__empty-text">{message}</div>
      </div>
    );
  }

  renderItems(items: OptionDefinition[]): React.ReactNode {
    return (
      <div className="brz-ed-sidebar__main brz-ed-sidebar__right__options">
        <Scrollbar theme="dark">
          <Options
            className="brz-ed-sidebar__right__tabs"
            optionClassName="brz-ed-sidebar__right__option"
            data={items}
            location="rightSidebar"
          />
        </Scrollbar>
      </div>
    );
  }

  render(): React.ReactNode {
    const { isOpen, alignment } = this.props;
    const sidebarClassName = classnames(
      "brz-ed-sidebar",
      "brz-ed-sidebar__right",
      {
        "brz-ed-sidebar__right--align-right": alignment === "right",
        "brz-ed-sidebar__right--align-left": alignment === "left"
      }
    );

    const _items = this.getItems !== undefined ? this.getItems() : undefined;
    const items =
      _items && _items.length > 0
        ? this.renderItems(_items)
        : this.renderEmpty(
            _items?.length === 0
              ? t("The element you have selected doesn't have more settings")
              : t("Select an element on the page to display more settings")
          );

    return (
      <div className={sidebarClassName}>
        <Animation
          className="brz-ed-sidebar__content"
          alignment={alignment}
          play={isOpen}
        >
          {items}
        </Animation>
      </div>
    );
  }
}

type MapStateProps = RightSidebarStore & { deviceMode: DeviceModes };
const mapStateToProps: MapStateToProps<
  MapStateProps,
  RightSidebarProps,
  ReduxState
> = (state) => {
  const { isOpen, lock, alignment, activeTab } = uiSelector(state).rightSidebar;

  return {
    isOpen,
    lock,
    alignment,
    activeTab,
    deviceMode: deviceModeSelector(state)
  };
};
export const RightSidebar = connect(mapStateToProps)(RightSidebarInner);
