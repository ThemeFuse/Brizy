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
import { updateUI, UpdateUIAction } from "visual/redux/actions2";
import { DESKTOP } from "visual/utils/responsiveMode";
import { t } from "visual/utils/i18n";
import { toggleLock, toggleAlignment, getTitle, getItems } from "./utils";
import { ReduxState } from "visual/redux/types";

type DeviceModes = ReduxState["ui"]["deviceMode"];
export type RightSidebarStore = ReduxState["ui"]["rightSidebar"];

export type RightSidebarProps = RightSidebarStore & {
  deviceMode: DeviceModes;
  dispatch: Dispatch<UpdateUIAction>;
};
export type RightSidebarState = {
  items: undefined | OptionDefinition[];
  staleItems: undefined | OptionDefinition[];
  title: undefined | string;
  staleTitle: undefined | string;
};

export let instance: RightSidebarInner | undefined;

export class RightSidebarInner extends React.Component<
  RightSidebarProps,
  RightSidebarState
> {
  static defaultProps: RightSidebarProps = {
    isOpen: false,
    lock: undefined,
    alignment: "right",
    deviceMode: "desktop",
    dispatch: action => action
  };

  state: RightSidebarState = {
    items: undefined,
    staleItems: undefined,
    title: undefined,
    staleTitle: undefined
  };

  clearItemsTimeoutId = 0;

  unmounted = false;

  componentDidMount(): void {
    instance = this;
  }

  componentDidUpdate(prevProps: RightSidebarProps): void {
    if (prevProps.deviceMode !== this.props.deviceMode) {
      this.setState({
        items: undefined,
        staleItems: undefined,
        title: undefined,
        staleTitle: undefined
      });
    }
  }

  componentWillUnmount(): void {
    this.unmounted = true;
    instance = undefined;
  }

  onAlignmentClick = (): void => {
    this.props.dispatch(updateUI("rightSidebar", toggleAlignment(this.props)));
  };

  onLockClick = (): void => {
    const { store, state } = toggleLock(this.props, this.state);

    if (state !== this.state) {
      this.setState(state, () => {
        this.props.dispatch(updateUI("rightSidebar", store));
      });
    } else {
      this.props.dispatch(updateUI("rightSidebar", store));
    }
  };

  setItems(items: OptionDefinition[], title?: string): void {
    window.clearTimeout(this.clearItemsTimeoutId);

    this.setState({ items: filterOptionsData(items), title });
  }

  clearItems(): void {
    const { lock, alignment, dispatch } = this.props;

    if (lock) {
      // items are cleared after a timeout to prevent switching unnecessarily to empty state
      // for a brief period when one Toolbar unmounts right before another will mount
      // thus causing an unpleasant blink (items from toolbar1 -> empty state -> items from toolbar2)
      this.clearItemsTimeoutId = window.setTimeout(() => {
        if (!this.unmounted) {
          this.setState(state => ({
            items: undefined,
            staleItems: state.items,
            title: undefined,
            staleTitle: state.title
          }));
        }
      }, 150);
    } else {
      this.setState(
        state => ({
          items: undefined,
          staleItems: state.items,
          title: undefined,
          staleTitle: state.title
        }),
        () => {
          const newStore: RightSidebarStore = {
            isOpen: false,
            lock,
            alignment
          };

          dispatch(updateUI("rightSidebar", newStore));
        }
      );
    }
  }

  renderEmpty(): React.ReactNode {
    return (
      <div className="brz-ed-sidebar__right__empty">
        <EditorIcon
          icon="nc-settings"
          className="brz-ed-sidebar__right__empty-icon"
        />
        <div className="brz-ed-sidebar__right__empty-text">
          {t("Select an element on the page to display more settings")}
        </div>
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
    const title = getTitle(this.props, this.state) || t("More Settings");
    const _items = getItems(this.props, this.state);
    const items = _items ? this.renderItems(_items) : this.renderEmpty();

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
              <EditorIcon
                icon={
                  alignment === "left"
                    ? "nc-hrz-align-left"
                    : "nc-hrz-align-right"
                }
                className="brz-ed-sidebar__right__header-icon"
                onClick={this.onAlignmentClick}
              />
              {deviceMode === DESKTOP && (
                <EditorIcon
                  icon={lock !== undefined ? "nc-lock" : "nc-unlock"}
                  className="brz-ed-sidebar__right__header-icon"
                  onClick={this.onLockClick}
                />
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
