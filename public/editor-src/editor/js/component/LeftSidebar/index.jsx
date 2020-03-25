import React from "react";
import { connect } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import Icons from "./components/Icons";
import Icon from "./components/Icon";
import Drawer from "./components/Drawer";
import DrawerAnimation from "./components/Animation";
import PointerEvents from "visual/component/PointerEvents";
import { currentUserRole } from "visual/component/Roles";
import { updateUI } from "visual/redux/actions2";
import items from "./items";
import DrawerOptions from "./components/Options";

const itemsById = [...items.top].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

class LeftSidebar extends React.Component {
  deviceModeChanged = false;

  componentWillReceiveProps(nextProps) {
    const { deviceMode } = nextProps;
    const { deviceMode: oldDeviceMode } = this.props;

    this.deviceModeChanged = deviceMode !== oldDeviceMode;
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
      el =>
        currentUserRole() === "admin" &&
        (!el.showInDeviceModes || el.showInDeviceModes.includes(deviceMode)) &&
        !el.disabled
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
    let DrawerContent = null;
    let WrapperHeaderComponent = ({ children }) => children;

    if (showDrawer) {
      const drawerItem = itemsById[drawerContentType];

      drawerTitle = drawerItem.drawerTitle;
      DrawerContent = drawerItem.drawerComponent;
      if (drawerItem.wrapperHeaderComponent) {
        WrapperHeaderComponent = drawerItem.wrapperHeaderComponent;
      }
    }

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
            <DrawerAnimation in={showDrawer}>
              <WrapperHeaderComponent>
                <Drawer headerText={drawerTitle}>
                  {DrawerContent && <DrawerContent />}
                </Drawer>
              </WrapperHeaderComponent>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
