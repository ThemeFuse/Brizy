import {
  ConfigCommon,
  LeftSidebarMoreOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { readConsent } from "./consentStorage";

// The consent gate is opt-in per host: it applies only where the editor config
// declares the `allowEmbedCode` entry in the left sidebar's More menu.
//
// Where it is not declared, nothing about embed-code behavior changes — the
// pre-existing `elements.embedCode.disableCodeInEditor` flag stays authoritative.
export const isEmbedCodeConsentGateActive = (config: ConfigCommon): boolean =>
  (config.ui?.leftSidebar?.more?.options ?? []).some(
    (option) => option.type === LeftSidebarMoreOptionsIds.allowEmbedCode
  );

// Single source of truth for "does embed code run in the editor right now".
//
// Precedence:
//   gate active   → the user's consent decides; disableCodeInEditor is ignored
//   gate inactive → disableCodeInEditor decides, exactly as before this feature
//
// Preview and published rendering never call this — they always execute.
export const shouldRunEmbedCodeInEditor = (config: ConfigCommon): boolean => {
  return isEmbedCodeConsentGateActive(config)
    ? readConsent(config.pageData?.id ?? "")
    : !config.elements?.embedCode?.disableCodeInEditor;
};
