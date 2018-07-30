import classnames from "classnames";
import UIEvents from "visual/global/UIEvents";
import { getStore } from "visual/redux/store";
import { setDeviceMode } from "visual/redux/actionCreators";
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

const DeviceModeDesktop = {
  id: "desktop",
  type: "link",
  icon: "nc-desktop",
  label: t("Desktop"),
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

export const DeviceModes = {
  id: "deviceModes",
  type: "popover",
  title: t("Mobile view"),
  className: "brz-ed-sidebar__popover--deviceMode",
  options: [DeviceModeDesktop, DeviceModeMobile],
  extraProps: () => {
    const icon =
      getCurrentDeviceMode() === "mobile" ? "nc-phone" : "nc-desktop";
    return {
      icon
    };
  }
};
