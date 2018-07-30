import de from "./de.js";
import en from "./en.js";
import es from "./es.js";
import fr from "./fr.js";
import it from "./it.js";
import nl from "./nl.js";
import ru from "./ru.js";
import { t } from "visual/utils/i18n";

// https://github.com/kbwood/countdown/tree/master/src/js - translated files
// used var because this file is required at export but not transpiled
var LANGUAGES = {
  de: {
    title: t("German"),
    component: de
  },
  en: {
    title: t("English"),
    component: en
  },
  es: {
    title: t("Spanish"),
    component: es
  },
  fr: {
    title: t("French"),
    component: fr
  },
  it: {
    title: t("Italian"),
    component: it
  },
  nl: {
    title: t("Dutch"),
    component: nl
  },
  ru: {
    title: t("Russian"),
    component: ru
  }
};

export default function(lang) {
  // used var because was problems for export
  var currentLang = LANGUAGES[lang] || LANGUAGES["en"];

  return currentLang.component;
}

export function getArrayLanguages() {
  return Object.keys(LANGUAGES).map(function(key, index) {
    return {
      title: LANGUAGES[key].title,
      value: key
    };
  });
}
