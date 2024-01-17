import {
  toolbarDisabledMargin,
  toolbarDisabledPadding
} from "visual/utils/toolbar";

export function getItems({ device, state }) {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      disabled: true
    },
    toolbarDisabledPadding({ device, state }),
    toolbarDisabledMargin({ device, state })
  ];
}
