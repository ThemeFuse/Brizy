import { isFunction, isPlainObject } from "es-toolkit";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUserRole } from "visual/component/Roles";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import {
  deviceModeSelector,
  leftSidebarSelector
} from "visual/redux/selectors";
import { DrawerContentTypes, ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import Icon from "../../Icon";

interface DrawerIconProps {
  id: DrawerContentTypes;
  drawerTitle: string;
  showInDeviceModes: DeviceMode[];
  disabled: boolean;
  icon: string;
  iconProps: unknown;
}

function DrawerIcon({
  id,
  showInDeviceModes,
  disabled,
  iconProps,
  icon,
  drawerTitle
}: DrawerIconProps) {
  const config = useConfig();
  const dispatch = useDispatch();
  const { deviceMode, leftSidebar } = useSelector((state: ReduxState) => ({
    deviceMode: deviceModeSelector(state),
    leftSidebar: leftSidebarSelector(state)
  }));

  const { drawerContentType } = leftSidebar;

  const handleDrawerContentTypeChange = useCallback(() => {
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType: id
      })
    );
  }, [dispatch, id]);

  const iconPropsClass = useMemo((): Record<string, unknown> => {
    if (isFunction(iconProps)) {
      const props = iconProps({
        activeClass: "brz-ed-sidebar__control__item--active"
      });
      return isPlainObject(props) ? props : {};
    }

    return isPlainObject(iconProps) ? iconProps : {};
  }, [iconProps]);

  const show =
    currentUserRole(config) === "admin" &&
    (!showInDeviceModes || showInDeviceModes.includes(deviceMode)) &&
    !disabled;

  if (!show) return null;

  const className =
    drawerContentType === id ? "brz-ed-sidebar__control__item--active" : "";

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
    </>
  );
}

export default DrawerIcon;
