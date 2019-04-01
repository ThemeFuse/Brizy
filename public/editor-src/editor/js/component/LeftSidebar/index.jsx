import React from "react";
import { connect } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import { DeviceModes } from "visual/component/LeftSidebar/components/DeviceModes";
import HotKeys from "visual/component/HotKeys";
import Icons from "./components/Icons";
import Icon from "./components/Icon";
import Drawer from "./components/Drawer";
import DrawerAnimation from "./components/Animation";
import PointerEvents from "visual/component/PointerEvents";
import { currentUserRole } from "visual/component/Roles";
import UIEvents from "visual/global/UIEvents";
import { updateUI, setDeviceMode } from "visual/redux/actionCreators";
import { getStore } from "visual/redux/store";
import items from "./items";
import DrawerOptions from "./components/Options";

const itemsById = [...items.top].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

const plusShortcuts = [
  "ctrl+plus",
  "cmd+plus",
  "right_cmd+plus",
  "ctrl+right_plus",
  "cmd+right_plus",
  "right_cmd+right_plus"
];

const minusShortcuts = [
  "ctrl+minus",
  "cmd+minus",
  "right_cmd+minus",
  "ctrl+right_minus",
  "cmd+right_minus",
  "right_cmd+right_minus"
];

class LeftSidebar extends React.Component {
  deviceModeChanged = false;

  componentWillReceiveProps(nextProps) {
    const { deviceMode } = nextProps;
    const { deviceMode: oldDeviceMode } = this.props;

    this.deviceModeChanged = deviceMode !== oldDeviceMode;
  }

  handleKeyDown(e, { keyName }) {
    e.preventDefault();
    const getCurrentDeviceMode = () => getStore().getState().ui.deviceMode;
    const { options } = DeviceModes;
    let index = options.findIndex(({ id }) => id === getCurrentDeviceMode());

    if (plusShortcuts.includes(keyName)) {
      index--;
    } else {
      index++;
    }

    if (index === options.length) {
      index = 0;
    } else if (index < 0) {
      index = options.length - 1;
    }

    getStore().dispatch(setDeviceMode(options[index].id));
    setTimeout(() => {
      UIEvents.emit("deviceMode.change", options[index].id);
    }, 300);
  }

  handleClickOutside = () => {
    const { drawerContentType, onDrawerContentTypeChange } = this.props;

    if (drawerContentType) {
      onDrawerContentTypeChange(null, false);
    }
  };

  renderIcons(items) {
    const {
      deviceMode,
      drawerContentType,
      onDrawerContentTypeChange
    } = this.props;
    const filteredItems = items.filter(
      ({ showInDeviceModes }) =>
        currentUserRole() === "admin" &&
        (!showInDeviceModes || showInDeviceModes.includes(deviceMode))
    );

    return filteredItems.map(item => {
      const className =
        drawerContentType === item.id
          ? "brz-ed-sidebar__control__item--active"
          : "";
      const iconProps =
        typeof item.iconProps === "object"
          ? item.iconProps
          : typeof item.iconProps === "function"
          ? item.iconProps({
              activeClass: "brz-ed-sidebar__control__item--active"
            })
          : {};

      return (
        <Icon
          key={item.id}
          className={className}
          icon={item.icon}
          title={item.drawerTitle}
          onClick={() => onDrawerContentTypeChange(item.id, true)}
          {...iconProps}
        />
      );
    });
  }

  render() {
    const { drawerContentType } = this.props;

    const topIcons = this.renderIcons(items.top);

    const showDrawer = Boolean(drawerContentType && !this.deviceModeChanged);
    let drawerTitle = "";
    let drawerContent = null;

    if (showDrawer) {
      const drawerItem = itemsById[drawerContentType];

      drawerTitle = drawerItem.drawerTitle;
      drawerContent = React.createElement(drawerItem.drawerComponent);
    }

    const hotKeysNames = [...plusShortcuts, ...minusShortcuts];

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={[
          ".brz-ed-sortable--empty",
          ".brz-ed-toolbar",
          ".brz-ed-fixed-bottom-panel"
        ]}
      >
        <PointerEvents>
          <div id="brz-ed-sidebar" className="brz-ed-sidebar">
            <Icons className="brz-ed-sidebar__control">{topIcons}</Icons>
            <DrawerOptions
              className="brz-ed-sidebar__control--bottom"
              data={items.bottom}
            />
            <HotKeys
              keyNames={hotKeysNames}
              id="key-helper-device-modes"
              onKeyDown={this.handleKeyDown}
            />
            <DrawerAnimation in={showDrawer}>
              <Drawer headerText={drawerTitle}>{drawerContent}</Drawer>
            </DrawerAnimation>
          </div>
        </PointerEvents>
      </ClickOutside>
    );
  }
}

const mapStateToProps = state => ({
  deviceMode: state.ui.deviceMode,
  drawerContentType: state.ui.leftSidebar.drawerContentType
});
const mapDispatchToProps = dispatch => ({
  onDrawerContentTypeChange: (drawerContentType, isOpen) =>
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType,
        isOpen
      })
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSidebar);
