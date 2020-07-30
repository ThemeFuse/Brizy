import React from "react";
import classnames from "classnames";
import UIEvents from "visual/global/UIEvents";
import HotKeys from "visual/component/HotKeys";
import { getStore } from "visual/redux/store";
import { setDeviceMode } from "visual/redux/actions2";
import { t } from "visual/utils/i18n";

const getCurrentDeviceMode = () => getStore().getState().ui.deviceMode;

const DeviceModeMobile = {
  id: "mobile",
  type: "link",
  label: t("Mobile"),
  icon: "nc-phone",
  extraProps: () => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active":
          getCurrentDeviceMode() === "mobile"
      }),
      onClick: () => {
        if (getCurrentDeviceMode() === "mobile") {
          return;
        }

        getStore().dispatch(setDeviceMode("mobile"));
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "mobile");
        }, 300);
      }
    };
  }
};

const DeviceModeTablet = {
  id: "tablet",
  type: "link",
  label: t("Tablet"),
  icon: "nc-tablet",
  extraProps: () => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active":
          getCurrentDeviceMode() === "tablet"
      }),
      onClick: () => {
        if (getCurrentDeviceMode() === "tablet") {
          return;
        }

        getStore().dispatch(setDeviceMode("tablet"));
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "tablet");
        }, 300);
      }
    };
  }
};

const DeviceModeDesktop = {
  id: "desktop",
  type: "link",
  label: t("Desktop"),
  icon: "nc-desktop",
  extraProps: () => {
    return {
      className: classnames({
        "brz-ed-sidebar__popover__item--active":
          getCurrentDeviceMode() === "desktop"
      }),
      onClick: () => {
        if (getCurrentDeviceMode() === "desktop") {
          return;
        }

        getStore().dispatch(setDeviceMode("desktop"));
        setTimeout(() => {
          UIEvents.emit("deviceMode.change", "desktop");
        }, 300);
      }
    };
  }
};

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

function handleHotKeys(e, { keyName }) {
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

const DevicesRender = element => (
  <>
    {element}
    <HotKeys
      keyNames={[...plusShortcuts, ...minusShortcuts]}
      id="key-helper-device-modes"
      onKeyDown={handleHotKeys}
    />
  </>
);

export const DeviceModes = {
  id: "deviceModes",
  type: "popover",
  title: t("Mobile view"),
  className: "brz-ed-sidebar__popover--deviceMode",
  options: [DeviceModeDesktop, DeviceModeTablet, DeviceModeMobile],
  render: DevicesRender,
  extraProps: () => {
    const icon =
      getCurrentDeviceMode() === "mobile"
        ? "nc-phone"
        : getCurrentDeviceMode() === "tablet"
        ? "nc-tablet"
        : "nc-desktop";
    return {
      icon
    };
  }
};
