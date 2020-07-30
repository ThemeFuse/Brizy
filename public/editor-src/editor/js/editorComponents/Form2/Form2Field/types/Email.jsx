import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Email extends TextField {
  static get componentTitle() {
    return t("Email");
  }

  static get componentType() {
    return "Email";
  }

  static pattern =
    // eslint-disable-next-line no-useless-escape, quotes
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
}
