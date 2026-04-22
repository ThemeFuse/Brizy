import { PINTEREST_SCRIPT_ID, PINTEREST_SCRIPT_SRC } from "./constants";

function appendPinterestScript(doc: Document, script: HTMLScriptElement): void {
  if (!doc.body) {
    const onReady = (): void => {
      doc.removeEventListener("DOMContentLoaded", onReady);
      try {
        doc.body?.appendChild(script);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }
    };
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", onReady);
    } else {
      doc.defaultView?.setTimeout(onReady, 0);
    }
    return;
  }
  try {
    doc.body.appendChild(script);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
  }
}

export function loadPinterestScript(doc: Document): void {
  if (doc.getElementById(PINTEREST_SCRIPT_ID)) {
    return;
  }

  const script = doc.createElement("script");
  script.setAttribute("id", PINTEREST_SCRIPT_ID);
  script.setAttribute("type", "text/javascript");
  script.setAttribute("async", "true");
  script.setAttribute("src", PINTEREST_SCRIPT_SRC);
  script.setAttribute("data-pin-build", "true");

  appendPinterestScript(doc, script);
}

export function rebuildPinterest(doc: Document): void {
  const win = doc.defaultView as
    | (Window & { PinUtils?: { build?: () => void } })
    | null;
  const build = win?.PinUtils?.build;

  if (typeof build === "function") {
    win?.setTimeout(() => {
      try {
        build();
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }
    }, 0);
    return;
  }

  loadPinterestScript(doc);

  win?.setTimeout(() => {
    if (typeof win.PinUtils?.build === "function") {
      try {
        win.PinUtils.build();
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }
    } else {
      reinitPinterestScript(doc);
    }
  }, 0);
}

function clearPinterestGlobals(doc: Document): void {
  const win = doc.defaultView as
    | (Window & { PinUtils?: unknown; [key: string]: unknown })
    | null;

  if (!win) return;

  delete win.PinUtils;
  Object.keys(win).forEach((key) => {
    if (/^PIN_\d+$/.test(key)) {
      delete win[key];
    }
  });
}

export function reinitPinterestScript(doc: Document): void {
  const existing = doc.getElementById(PINTEREST_SCRIPT_ID);
  if (existing) {
    existing.remove();
  }

  clearPinterestGlobals(doc);

  const script = doc.createElement("script");
  script.setAttribute("id", PINTEREST_SCRIPT_ID);
  script.setAttribute("type", "text/javascript");
  script.setAttribute("async", "true");
  script.setAttribute("src", `${PINTEREST_SCRIPT_SRC}?t=${Date.now()}`);
  script.setAttribute("data-pin-build", "true");

  appendPinterestScript(doc, script);
}
