import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useConfig } from "visual/providers/ConfigProvider";
import { pageSelector } from "visual/redux/selectors";
import { isEmbedCodeConsentGateActive } from "visual/utils/elements/embedCode";
import {
  readConsent,
  writeConsent
} from "visual/utils/elements/embedCode/consentStorage";
import { initEmbedCodeConsent } from "visual/utils/elements/embedCode/consentStore";

export const EmbedCodeConsentInit = (): null => {
  const config = useConfig();
  const page = useSelector(pageSelector);
  const pageId = page.id;
  const gateActive = isEmbedCodeConsentGateActive(config);

  const apply = useCallback(() => {
    if (!gateActive) {
      initEmbedCodeConsent({ run: false });
      return;
    }

    initEmbedCodeConsent({
      run: readConsent(pageId),
      persist: (state) => writeConsent(pageId, state)
    });
  }, [gateActive, pageId]);

  const appliedKey = useRef<string>();
  const key = `${gateActive}:${pageId}`;

  if (appliedKey.current === undefined) {
    appliedKey.current = key;
    apply();
  }

  useEffect(() => {
    if (appliedKey.current === key) {
      return;
    }

    appliedKey.current = key;
    apply();
  }, [key, apply]);

  return null;
};
