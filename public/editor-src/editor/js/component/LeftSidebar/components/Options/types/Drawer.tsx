import React, { useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ConnectedProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { currentUserRole } from "visual/component/Roles";
import { ActionUpdateUI, updateUI } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import DrawerAnimation from "../../Animation";
import DrawerComponent from "../../Drawer";
import Icon from "../../Icon";

type DrawerContentType = ReduxState["ui"]["leftSidebar"]["drawerContentType"];

type DrawerProps = {
  drawerContentType: DrawerContentType;
  drawerTitle: string;
  drawerComponent?: React.ElementType;
  wrapperHeaderComponent: React.ElementType;
  id: string;
  withHelpIcon?: boolean;
};

type DrawerWrapperProps = DrawerProps &
  ConnectedProps<typeof connector> & {
    showInDeviceModes: DeviceMode[];
    disabled: boolean;
    icon: string;
    iconProps: unknown;
  };

const Drawer: React.FC<DrawerProps> = ({
  drawerContentType,
  drawerTitle = "",
  withHelpIcon,
  drawerComponent: DrawerContent,
  wrapperHeaderComponent: WrapperHeaderComponent = ({ children }) => children,
  id,
  ...extraProps
}) => {
  const prevContentTypeRef = useRef(drawerContentType);
  useEffect(() => {
    prevContentTypeRef.current = drawerContentType;
  });
  const prevContentType = prevContentTypeRef.current;

  const isOpened = !prevContentType;
  const isClosed = prevContentType === id && !drawerContentType;
  const showDrawer = drawerContentType === id;

  let content = (
    <DrawerAnimation in={!!drawerContentType} appear={isOpened}>
      <WrapperHeaderComponent>
        <DrawerComponent headerText={drawerTitle} withHelpIcon={withHelpIcon}>
          {DrawerContent && <DrawerContent extraProps={extraProps} />}
        </DrawerComponent>
      </WrapperHeaderComponent>
    </DrawerAnimation>
  );

  const sidebarSelector = window.parent.document.getElementById(
    "brz-ed-sidebar"
  ) as HTMLElement;

  if (isClosed) {
    content = <DrawerAnimation unmountOnExit={true} />;
  } else if (!showDrawer) {
    return null;
  }

  return ReactDOM.createPortal(content, sidebarSelector);
};

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({ ...props }) => {
  const {
    id,
    deviceMode,
    showInDeviceModes,
    disabled,
    drawerContentType,
    iconProps,
    icon,
    drawerTitle,
    onDrawerContentTypeChange
  } = props;

  const show =
    currentUserRole() === "admin" &&
    (!showInDeviceModes || showInDeviceModes.includes(deviceMode)) &&
    !disabled;

  const className =
    drawerContentType === id ? "brz-ed-sidebar__control__item--active" : "";
  const iconPropsClass =
    typeof iconProps === "object"
      ? iconProps
      : typeof iconProps === "function"
      ? iconProps({
          activeClass: "brz-ed-sidebar__control__item--active"
        })
      : {};

  const handleDrawerContentTypeChange = useCallback(() => {
    onDrawerContentTypeChange(id, true);
  }, [onDrawerContentTypeChange, id]);

  if (!show) return null;

  return (
    <>
      <Icon
        key={id}
        tagName="div"
        className={className}
        icon={icon}
        title={drawerTitle}
        onClick={handleDrawerContentTypeChange}
        {...iconPropsClass}
      />
      <Drawer {...props} />
    </>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  deviceMode: state.ui.deviceMode,
  drawerContentType: state.ui.leftSidebar.drawerContentType
});

type IsOpen = ReduxState["ui"]["leftSidebar"]["isOpen"];

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDrawerContentTypeChange: (
    drawerContentType: DrawerContentType,
    isOpen: IsOpen
  ): ActionUpdateUI =>
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType,
        isOpen
      })
    )
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(DrawerWrapper);
