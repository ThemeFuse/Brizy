import { IS_CMS } from "visual/utils/env";
import * as CmsPage from "../cms/page";
import * as CmsPopup from "../cms/popup";
import * as Legacy from "./legacy";

const cmsOrLegacy = <A, B>(cms: A, legacy: B): A | B => (IS_CMS ? cms : legacy);

export const getPages = cmsOrLegacy(CmsPage.getPages, Legacy.getPages);

export const getPage = cmsOrLegacy(CmsPage.getPage, Legacy.getPage);

export const updatePage = cmsOrLegacy(CmsPage.updatePage, Legacy.updatePage);

export const getInternalPopups = cmsOrLegacy(
  CmsPage.getPages,
  Legacy.getInternalPopups
);

export const getInternalPopup = cmsOrLegacy(
  CmsPage.getPage,
  Legacy.getInternalPopup
);

export const updateInternalPopup = cmsOrLegacy(
  CmsPage.updatePage,
  Legacy.updateInternalPopup
);

export const getRulesList = cmsOrLegacy(
  CmsPopup.getRulesList,
  Legacy.getRulesList
);

export const updatePopupRules = cmsOrLegacy(
  CmsPopup.updatePopupRules,
  Legacy.updatePopupRules
);
