import React from "react";
import { Dispatch } from "redux";
import { connect, MapStateToProps } from "react-redux";
import classnames from "classnames";
import Options, { filterOptionsData } from "visual/component/Options";
import EditorIcon from "visual/component/EditorIcon";
import { OptionDefinition } from "visual/component/Options/Type";
import { Animation } from "./Animation";
import { Scrollbars } from "./Scrollbars";
import { uiSelector, deviceModeSelector } from "visual/redux/selectors";
import { updateUI, ActionUpdateUI } from "visual/redux/actions2";
import { DESKTOP } from "visual/utils/responsiveMode";
import { t } from "visual/utils/i18n";
import { ReduxState } from "visual/redux/types";

type DeviceModes = ReduxState["ui"]["deviceMode"];
export type RightSidebarStore = ReduxState["ui"]["rightSidebar"];

export type RightSidebarProps = RightSidebarStore & {
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
    dispatch: action => action
  };

  getItems: undefined | (() => OptionDefinition[]);

  getTitle: undefined | (() => string);

  clearItemsTimeoutId = 0;

  unmounted = false;

  componentDidMount(): void {
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

  onAlignmentClick = (): void => {
    const { isOpen, lock, alignment } = this.props;
    const newStore: RightSidebarStore = {
      alignment: alignment === "left" ? "right" : "left",
      lock,
      isOpen
    };

    this.props.dispatch(updateUI("rightSidebar", newStore));
  };

  onLockClick = (): void => {
    const { isOpen, lock, alignment } = this.props;
    const items =
      this.getItems !== undefined
        ? filterOptionsData(this.getItems())
        : undefined;
    const newStore: RightSidebarStore = {
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
    const { lock, alignment, dispatch } = this.props;

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
      const newStore: RightSidebarStore = {
        isOpen: false,
        lock,
        alignment
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

  renderScrollbarsThumb = ({
    style
  }: {
    style: React.CSSProperties;
  }): React.ReactElement => {
    return (
      <div
        style={{
          ...style,
          borderRadius: "inherit",
          backgroundColor: "#3f4652"
        }}
      />
    );
  };

  renderItems(items: OptionDefinition[]): React.ReactNode {
    return (
      <div className="brz-ed-sidebar__main brz-ed-sidebar__right__options">
        <Scrollbars>
          <Options
            className="brz-ed-sidebar__right__tabs"
            optionClassName="brz-ed-sidebar__right__option"
            data={items}
            location="rightSidebar"
          />
        </Scrollbars>
      </div>
    );
  }

  render(): React.ReactNode {
    const { isOpen, lock, alignment, deviceMode } = this.props;
    const sidebarClassName = classnames(
      "brz-ed-sidebar",
      "brz-ed-sidebar__right",
      {
        "brz-ed-sidebar__right--align-right": alignment === "right",
        "brz-ed-sidebar__right--align-left": alignment === "left"
      }
    );

    const title = this.getTitle?.() || t("More Settings");
    const _items =
      this.getItems !== undefined
        ? filterOptionsData(this.getItems())
        : undefined;
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
          <div className="brz-ed-sidebar__header">
            <h1 className="brz-h1 brz-ed-sidebar__header__title">{title}</h1>
            <div className="brz-ed-sidebar__right__header-icons">
              <div className="brz-ed-sidebar__right__header-icon">
                <EditorIcon
                  icon={
                    alignment === "left"
                      ? "nc-hrz-align-left"
                      : "nc-hrz-align-right"
                  }
                  onClick={this.onAlignmentClick}
                />
                <div className="brz-ed-sidebar__add-elements__tooltip brz-ed-sidebar__right__icon-tooltip">
                  {alignment === "left"
                    ? t("Aligned Left")
                    : t("Aligned Right")}
                </div>
              </div>
              {deviceMode === DESKTOP && (
                <div className="brz-ed-sidebar__right__header-icon">
                  <EditorIcon
                    icon={lock !== undefined ? "nc-lock" : "nc-unlock"}
                    onClick={this.onLockClick}
                  />
                  <div className="brz-ed-sidebar__add-elements__tooltip brz-ed-sidebar__right__icon-tooltip">
                    {lock !== undefined ? t("Locked") : t("Unlocked")}
                  </div>
                </div>
              )}
            </div>
          </div>
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
> = state => {
  const { isOpen, lock, alignment }: RightSidebarStore = uiSelector(
    state
  ).rightSidebar;

  return {
    isOpen,
    lock,
    alignment,
    deviceMode: deviceModeSelector(state)
  };
};
export const RightSidebar = connect(mapStateToProps)(RightSidebarInner);
