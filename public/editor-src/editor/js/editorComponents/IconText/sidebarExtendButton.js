import {
  toolbarDisabledPadding,
  toolbarDisabledMargin
} from "visual/utils/toolbar";

export function getItems({ device, state }) {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      disabled: true
    },
    toolbarDisabledPadding({ device, state }),
    toolbarDisabledMargin({ device, state })
  ];
}
