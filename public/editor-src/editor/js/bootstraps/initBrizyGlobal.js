import Config from "visual/global/Config";
import { addFilter, applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";

global.Brizy = {
  config: Config,
  addFilter,
  applyFilter,
  t
};
