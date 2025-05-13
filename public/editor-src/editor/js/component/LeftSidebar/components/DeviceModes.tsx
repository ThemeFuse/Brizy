import classnames from "classnames";
import React, { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import UIEvents from "visual/global/UIEvents";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { DeviceMode } from "visual/types";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";

const DeviceModeMobile = () => ({
  id: "mobile",
  type: "link",
  label: t("Mobile"),
  icon: "nc-phone",
  extraProps: ({
    deviceMode,
    setDeviceMode
  }: {
    deviceMode: DeviceMode;
    setDeviceMode: (d: DeviceMode) => void;
  }) => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active": deviceMode === "mobile"
      }),
      onClick: () => {
        if (deviceMode === "mobile") {
          return;
        }

        setDeviceMode("mobile");
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "mobile");
        }, 300);
      }
    };
  }
});

const DeviceModeTablet = () => ({
  id: "tablet",
  type: "link",
  label: t("Tablet"),
  icon: "nc-tablet",
  extraProps: ({
    deviceMode,
    setDeviceMode
  }: {
    deviceMode: DeviceMode;
    setDeviceMode: (d: DeviceMode) => void;
  }) => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active": deviceMode === "tablet"
      }),
      onClick: () => {
        if (deviceMode === "tablet") {
          return;
        }

        setDeviceMode("tablet");
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "tablet");
        }, 300);
      }
    };
  }
});

const DeviceModeDesktop = () => ({
  id: "desktop",
  type: "link",
  label: t("Desktop"),
  icon: "nc-desktop",
  extraProps: ({
    deviceMode,
    setDeviceMode
  }: {
    deviceMode: DeviceMode;
    setDeviceMode: (d: DeviceMode) => void;
  }) => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active": deviceMode === "desktop"
      }),
      onClick: () => {
        if (deviceMode === "desktop") {
          return;
        }

        setDeviceMode("desktop");
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "desktop");
        }, 300);
      }
    };
  }
});
const DeviceModeOptions = () => [
  DeviceModeDesktop(),
  DeviceModeTablet(),
  DeviceModeMobile()
];

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

const WithHotKeys: FCC = ({ children }) => {
  const store = useStore();
  const dispatch = useDispatch();

  const handleHotKeys = useCallback(
    (e: React.KeyboardEvent, { keyName }: { keyName: string }) => {
      e.preventDefault();
      const deviceMode = deviceModeSelector(store.getState());
      const deviceModeOptions = DeviceModeOptions();
      let index = deviceModeOptions.findIndex(({ id }) => id === deviceMode);

      if (plusShortcuts.includes(keyName)) {
        index--;
      } else {
        index++;
      }

      if (index === deviceModeOptions.length) {
        index = 0;
      } else if (index < 0) {
        index = deviceModeOptions.length - 1;
      }

      dispatch(setDeviceMode(deviceModeOptions[index].id as DeviceMode));
      setTimeout(() => {
        UIEvents.emit("deviceMode.change", deviceModeOptions[index].id);
      }, 300);
    },
    [store, dispatch]
  );

  return (
    <>
      {children}
      <HotKeys
        keyNames={[...plusShortcuts, ...minusShortcuts]}
        id="key-helper-device-modes"
        onKeyDown={handleHotKeys}
      />
    </>
  );
};

const DevicesRender = (element: React.ReactElement) => (
  <WithHotKeys>{element}</WithHotKeys>
);

export function getDevicesModes({ disabled = false }: { disabled: boolean }) {
  return {
    id: LeftSidebarOptionsIds.deviceMode,
    type: "popover",
    className: "brz-ed-sidebar__popover--deviceMode",
    options: DeviceModeOptions(),
    render: DevicesRender,
    disabled,

    extraProps: ({ deviceMode }: { deviceMode: DeviceMode }) => {
      let icon = "";
      let title = "";

      if (deviceMode === "mobile") {
        icon = "nc-phone";
        title = t("Mobile view");
      } else if (deviceMode === "tablet") {
        icon = "nc-tablet";
        title = t("Tablet view");
      } else {
        icon = "nc-desktop";
        title = t("Desktop view");
      }

      return {
        icon,
        title
      };
    }
  };
}
