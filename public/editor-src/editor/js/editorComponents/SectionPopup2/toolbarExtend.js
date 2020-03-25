import {
  toolbarDisabledShowOnMobile,
  toolbarDisabledShowOnTablet
} from "visual/utils/toolbar";

export function getItems() {
  return [toolbarDisabledShowOnMobile({}), toolbarDisabledShowOnTablet({})];
}
