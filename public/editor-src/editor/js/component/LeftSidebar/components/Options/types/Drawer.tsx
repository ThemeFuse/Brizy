/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { updateUI, ActionUpdateUI } from "visual/redux/actions2";
import { currentUserRole } from "visual/component/Roles";
import { ReduxState } from "visual/redux/types";
import Icon from "../../Icon";
import DrawerComponent from "../../Drawer";
import DrawerAnimation from "../../Animation";

import { DeviceMode } from "visual/types";

type DrawerContentType = ReduxState["ui"]["leftSidebar"]["drawerContentType"];

type DrawerProps = {
  drawerContentType: DrawerContentType;
  drawerTitle: string;
  drawerComponent?: React.ElementType;
  wrapperHeaderComponent: React.ElementType;
  id: string;
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
  drawerComponent: DrawerContent,
  wrapperHeaderComponent: WrapperHeaderComponent = ({ children }) => children,
  id
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
        <DrawerComponent headerText={drawerTitle}>
          {DrawerContent && <DrawerContent />}
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
  const show =
    currentUserRole() === "admin" &&
    (!props.showInDeviceModes ||
      props.showInDeviceModes.includes(props.deviceMode)) &&
    !props.disabled;

  if (!show) return null;

  const className =
    props.drawerContentType === props.id
      ? "brz-ed-sidebar__control__item--active"
      : "";
  const iconProps =
    typeof props.iconProps === "object"
      ? props.iconProps
      : typeof props.iconProps === "function"
      ? props.iconProps({
          activeClass: "brz-ed-sidebar__control__item--active"
        })
      : {};

  const handleDrawerContentTypeChange = useCallback(() => {
    props.onDrawerContentTypeChange(props.id, true);
  }, [props.id]);

  return (
    <>
      <Icon
        key={props.id}
        tagName="div"
        className={className}
        icon={props.icon}
        title={props.drawerTitle}
        onClick={handleDrawerContentTypeChange}
        {...iconProps}
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
