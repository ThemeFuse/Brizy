import { makeAttr } from "visual/utils/i18n/attribute";
import { readConsentCookie, writeConsentCookie } from "./consent/cookie";
import {
  type ConsentCategories,
  diffConsent,
  grantedCategories,
  parseConsent,
  serializeConsent
} from "./consent/model";
import {
  activateScripts,
  categoriesWithAllSetTo,
  dispatchConsentModeUpdate,
  readCategoriesFromDialog,
  seedDialog
} from "./utils";

const ccSelector = (value: string): string => `[${makeAttr("cc")}="${value}"]`;

function initCookieBanner(root: HTMLElement): void {
  const bar = root.querySelector<HTMLElement>(ccSelector("banner"));
  const badge = root.querySelector<HTMLElement>(ccSelector("badge"));
  const backdrop = root.querySelector<HTMLElement>(ccSelector("backdrop"));
  const dialog = root.querySelector<HTMLElement>(ccSelector("dialog"));
  const acceptButtons = root.querySelectorAll<HTMLElement>(
    ccSelector("accept")
  );
  const rejectButton = root.querySelector<HTMLElement>(ccSelector("reject"));
  const customizeButton = root.querySelector<HTMLElement>(
    ccSelector("customize")
  );
  const saveButton = root.querySelector<HTMLElement>(ccSelector("save"));

  let consent = parseConsent(readConsentCookie());

  const hideBar = (): void => bar?.classList.add("brz-hidden");
  const showBar = (): void => bar?.classList.remove("brz-hidden");
  const showBadge = (): void => badge?.classList.remove("brz-hidden");
  const openDialog = (): void => {
    if (dialog) {
      seedDialog(dialog, consent);
    }

    backdrop?.classList.remove("brz-hidden");
  };
  const closeDialog = (): void => backdrop?.classList.add("brz-hidden");

  if (consent) {
    hideBar();
    showBadge();
    // Google Consent Mode forgets an update between page loads — every load
    // starts from the site's `consent default`, so a stored choice must be
    // re-sent here, before any gated tag (possibly gtag.js itself) boots.
    dispatchConsentModeUpdate(consent.c);
    activateScripts(grantedCategories(consent));
  } else {
    showBar();
  }

  function applyChoice(categories: ConsentCategories): void {
    const { revoked, newlyGranted } = diffConsent(consent, categories);

    writeConsentCookie(serializeConsent(categories, Date.now()));
    consent = { v: 1, ts: Date.now(), c: categories };

    dispatchConsentModeUpdate(categories);

    if (revoked) {
      // Already-executed scripts cannot be un-executed — a reload is the
      // only way to honor a withdrawal.
      window.location.reload();
      return;
    }

    activateScripts(newlyGranted);
    hideBar();
    closeDialog();
    showBadge();
  }

  acceptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyChoice(categoriesWithAllSetTo(true));
    });
  });

  rejectButton?.addEventListener("click", () => {
    applyChoice(categoriesWithAllSetTo(false));
  });

  customizeButton?.addEventListener("click", openDialog);
  badge?.addEventListener("click", openDialog);

  saveButton?.addEventListener("click", () => {
    if (!dialog) {
      return;
    }

    applyChoice(readCategoriesFromDialog(dialog));
  });

  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeDialog();
    }
  });
}

export default function (node: HTMLElement): void {
  node
    .querySelectorAll<HTMLElement>(".brz-cookie-banner")
    .forEach(initCookieBanner);
}
