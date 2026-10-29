import type { ConsentCategories } from "./model";

type ConsentCategory = keyof ConsentCategories | "necessary";

export const VENDOR_MAP: Array<[RegExp, ConsentCategory]> = [
  // analytics vendors
  [
    /(^|\.)(google-analytics\.com|googletagmanager\.com|analytics\.google\.com)$/,
    "statistics"
  ],
  [/(^|\.)(clarity\.ms|hotjar\.com)$/, "statistics"],
  // ad/social vendors
  [/(^|\.)facebook\.net$/, "marketing"],
  [
    /(^|\.)(doubleclick\.net|googlesyndication\.com|googleadservices\.com)$/,
    "marketing"
  ],
  [
    /(^|\.)(ads-twitter\.com|ads\.tiktok\.com|analytics\.tiktok\.com)$/,
    "marketing"
  ],
  [/(^|\.)snap\.licdn\.com$/, "marketing"],
  [/(^|\.)pinimg\.com$/, "marketing"],
  // Brizy element integrations — same category as their data-brz-consent
  // stamp, so unstamped vendor sub-loads resolve identically instead of
  // falling into "other"
  [/(^|\.)(youtube\.com|ytimg\.com)$/, "marketing"], // Video + background-video
  [/(^|\.)(twitter\.com|twimg\.com|x\.com)$/, "marketing"], // Twitter widgets + syndication
  [/(^|\.)(instagram\.com|cdninstagram\.com)$/, "marketing"], // InstagramFeed
  [/(^|\.)pinterest\.com$/, "marketing"], // pinit.js + pinit_main.js
  [/(^|\.)(disqus\.com|disquscdn\.com)$/, "marketing"], // Comments
  [/(^|\.)calendly\.com$/, "preferences"],
  [/(^|\.)cse\.google\.com$/, "preferences"], // BEFORE google.com
  // functional / infrastructure (never gated)
  [/(^|\.)(google\.com|gstatic\.com|googleapis\.com)$/, "necessary"], // reCAPTCHA + gstatic + ajax/maps googleapis
  // Ecwid, plus three of the CloudFront distros its storefront is served
  // from. Those distro hosts are belt-and-braces only — the storefront is
  // matched by URL signature (ECWID_CDN), since it rotates across many
  // distros; the host entries just also cover any other path they serve
  // (e.g. /states.js, the checkout country/region JSONP). business.shop is
  // the Ecwid/Lightspeed Instant Site domain, which serves the store config
  // (app.business.shop/data.js).
  [
    /(^|\.)(ecwid\.com|business\.shop|d34ikvsdm2rlij\.cloudfront\.net|d3fi9i0jj23cau\.cloudfront\.net|d3dq8sxcny4hg\.cloudfront\.net)$/,
    "necessary"
  ],
  [
    /(^|\.)(code\.jquery\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)$/,
    "necessary"
  ] // lib CDNs, cookie-less static infra
];

const VENDOR_MAP_PLACEHOLDER = "/*__VENDOR_MAP__*/";

// Runs as the very first script of the published page (lowest score). Plain
// ES5, self-executing, wrapped in try/catch so it can never break the page.
// Cookie-parsing here is a minimal, sync-kept duplicate of
// consent/cookie.ts (COOKIE_NAME) + consent/model.ts (parseConsent
// semantics: JSON, v === 1, c.{preferences,statistics,marketing,other}
// booleans) — keep in sync with those two files.
//
// The returned source must never contain the literal sequence `</script>`
// (it gets inlined verbatim into a <script> tag).
const BLOCKER_SOURCE = `(function () {
  try {
    var COOKIE_NAME = "brz-consent";
    var VENDOR_MAP = ${VENDOR_MAP_PLACEHOLDER};

    function readConsentCookie() {
      try {
        var value = "; " + document.cookie;
        var parts = value.split("; " + COOKIE_NAME + "=");

        if (parts.length === 2) {
          return parts.pop().split(";").shift();
        }

        return null;
      } catch (e) {
        return null;
      }
    }

    function parseConsent(raw) {
      if (!raw) {
        return null;
      }

      var parsed;

      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        return null;
      }

      if (typeof parsed !== "object" || parsed === null) {
        return null;
      }

      if (parsed.v !== 1 || typeof parsed.ts !== "number") {
        return null;
      }

      var c = parsed.c;

      if (typeof c !== "object" || c === null) {
        return null;
      }

      if (
        typeof c.preferences !== "boolean" ||
        typeof c.statistics !== "boolean" ||
        typeof c.marketing !== "boolean" ||
        typeof c.other !== "boolean"
      ) {
        return null;
      }

      return c;
    }

    function baseHost(h) {
      h = h.toLowerCase().replace(/:\\d+$/, "");

      return h.indexOf("www.") === 0 ? h.slice(4) : h;
    }

    // Ours when the script host is the page host, a subdomain of it, or a
    // parent domain of it (both sides www-stripped). Deliberately without a
    // public-suffix list: sibling subdomains (page shop.site.com, script
    // cdn.site.com) are NOT recognized and end up gated as "other" — the
    // safe direction.
    function isFirstParty(host) {
      var page = baseHost(location.hostname);
      var h = baseHost(host);

      return (
        h === page ||
        h.slice(-(page.length + 1)) === "." + page ||
        page.slice(-(h.length + 1)) === "." + h
      );
    }

    // Brizy's own runtime (preview, libs, this blocker) is stamped with the
    // "brz-script" class by the compiler; it is necessary by definition, so
    // it is recognised by that class and never gated — same treatment as
    // data-brz-consent="necessary".
    function isBrizyScript(node) {
      var className = node.getAttribute("class");

      return (
        typeof className === "string" &&
        (" " + className + " ").indexOf(" brz-script ") !== -1
      );
    }

    // Ecwid serves its storefront from many concurrent, rotating CloudFront
    // distros, so the host cannot be pinned down in VENDOR_MAP — the path
    // prefix is the stable part of the URL. Four are covered: "/storefront/"
    // (the core V3 chain), "/apps/ecwid-" (Ecwid's own app widgets, e.g.
    // ecwid-shop-at-app), "/startersite/" (the instant-site bundle) and
    // "states.js" at the path root (the checkout country/region JSONP).
    // Deliberately NOT covered: any other CloudFront path — trackers live on
    // CloudFront too, so neither the CDN nor a path alone may become a free
    // pass. Ecwid's own analytics bundle (/v2/i.min.js) falls outside the
    // signature on purpose and stays gated as "other" (pinned by test).
    var ECWID_CDN =
      /^(?:https?:)?\\/\\/[^\\/?#]+\\.cloudfront\\.net(?::\\d+)?\\/(?:storefront\\/|apps\\/ecwid-|startersite\\/|states\\.js(?:[?#]|$))/i;

    // Vendor patterns are matched against the src's host only: matching the
    // whole src would gate first-party URLs that merely mention a vendor
    // host in their path or query string. A hostless (relative) src is
    // first-party and is never gated; an unmatched third-party host is
    // gated as "other". The one full-URL rule (ECWID_CDN) is
    // host-scoped in its own pattern, so it keeps that property.
    function resolveCategory(src) {
      var match = /^(?:https?:)?\\/\\/([^\\/?#]+)/i.exec(src || "");

      if (!match) {
        return null;
      }

      var host = match[1].toLowerCase().replace(/:\\d+$/, "");

      if (isFirstParty(host)) {
        return null;
      }

      if (ECWID_CDN.test(src)) {
        return "necessary";
      }

      for (var i = 0; i < VENDOR_MAP.length; i++) {
        if (VENDOR_MAP[i][0].test(host)) {
          return VENDOR_MAP[i][1];
        }
      }

      return "other";
    }

    // \`src\` is passed only by the createElement gate, which gates the node
    // *before* the src lands on it — there getAttribute("src") is still null
    // and the breadcrumb below would otherwise read "inline".
    function neutralize(node, category, src) {
      // Idempotent: an already-gated node (by us or a previous batch) is
      // left as-is.
      if (
        node.getAttribute("type") === "text/plain" &&
        node.getAttribute("data-brz-consent") !== null
      ) {
        return;
      }

      // The activator restores module semantics on the fresh, re-injected
      // node once consent is granted.
      if (node.getAttribute("type") === "module") {
        node.setAttribute("data-brz-orig-type", "module");
      }

      node.setAttribute("type", "text/plain");

      if (node.getAttribute("data-brz-consent") === null) {
        node.setAttribute("data-brz-consent", category);
      }

      // Firefox <109 does not re-check the type before executing an
      // already-parsed script (Mozilla bug 1632975); beforescriptexecute
      // is the non-standard fallback (support matrix floor is Firefox 88).
      // A harmless no-op everywhere else.
      node.addEventListener("beforescriptexecute", function (event) {
        if (node.getAttribute("type") === "text/plain") {
          event.preventDefault();
        }
      });

      // Permanent breadcrumb, fired once per actual gating (the idempotent
      // return above skips it): it lets a site owner or QA read off the
      // console WHAT the banner blocked and under which category, so a
      // rotated vendor host — which silently lands in "other" and breaks its
      // widget — gets noticed. Guarded like everything else here: a missing
      // or throwing console must never break the page.
      try {
        console.info(
          "[Brz Consent] blocked pre-consent:",
          node.getAttribute("src") || src || "inline",
          "->",
          category
        );
      } catch (e) {}
    }

    function processScript(node, consent) {
      var attr = node.getAttribute("data-brz-consent");

      if (attr === "necessary") {
        return;
      }

      if (isBrizyScript(node)) {
        return;
      }

      if (
        attr === "preferences" ||
        attr === "statistics" ||
        attr === "marketing" ||
        attr === "other"
      ) {
        if (consent && consent[attr]) {
          return;
        }

        neutralize(node, attr);
        return;
      }

      // Any other label value is left alone — unknown label values are
      // ignored rather than guessed at (conservative).
      if (attr !== null) {
        return;
      }

      var type = node.getAttribute("type");

      if (
        type &&
        type !== "text/javascript" &&
        type !== "application/javascript" &&
        type !== "module"
      ) {
        return;
      }

      var src = node.getAttribute("src");

      // Inline, unmarked scripts are never touched — same platform limit as
      // Cookiebot; manual data-brz-consent marking is the escape hatch.
      if (!src) {
        return;
      }

      var category = resolveCategory(src);

      // Only first-party srcs (relative or our own host) resolve to null —
      // an unmatched third-party host resolves to "other". A host
      // mapped to "necessary" is allowed outright, exactly like the
      // data-brz-consent="necessary" label above (the cookie never carries
      // "necessary": it is implied granted, so it must not reach the
      // consent lookup below).
      if (!category || category === "necessary") {
        return;
      }

      if (consent && consent[category]) {
        return;
      }

      neutralize(node, category);
    }

    // --- createElement gate ---
    // The observer sees a dynamically-created script only once it is
    // inserted into the document — but a script created via
    // document.createElement + src assignment is "prepared" synchronously
    // at insertion time, before the observer's microtask runs, so it can
    // execute before neutralize() ever gets a chance to run. This gate
    // catches the src assignment itself (property OR setAttribute) on any
    // element created through OUR document.createElement, closing that gap,
    // and keeps the gate in place against every way a gated script could
    // make itself executable again (type via setAttribute, via the IDL
    // property, or by removing the attribute altogether).
    // Fails open at every step: missing platform APIs skip the whole patch,
    // and any runtime error degrades silently back to observer-only
    // behavior.
    try {
      var nativeCreateElement = document.createElement;
      var srcDescriptor =
        typeof HTMLScriptElement !== "undefined"
          ? Object.getOwnPropertyDescriptor(
              HTMLScriptElement.prototype,
              "src"
            )
          : null;
      var typeDescriptor =
        typeof HTMLScriptElement !== "undefined"
          ? Object.getOwnPropertyDescriptor(
              HTMLScriptElement.prototype,
              "type"
            )
          : null;

      if (srcDescriptor) {
        var gateSrc = function (el, value) {
          var attr = el.getAttribute("data-brz-consent");

          if (attr === "necessary") {
            return;
          }

          if (isBrizyScript(el)) {
            return;
          }

          var category;

          if (
            attr === "preferences" ||
            attr === "statistics" ||
            attr === "marketing" ||
            attr === "other"
          ) {
            category = attr;
          } else if (attr !== null) {
            // Unknown label values are left alone, same rule as
            // processScript.
            return;
          } else {
            category = resolveCategory(value);
          }

          // Same rule as processScript: first-party (null) and
          // map-as-"necessary" hosts are allowed outright.
          if (!category || category === "necessary") {
            return;
          }

          // Set-time, not load-time: the activator's re-injected clones
          // carry a granted-category label and must pass through.
          var freshConsent = parseConsent(readConsentCookie());

          if (freshConsent && freshConsent[category]) {
            return;
          }

          neutralize(el, category, value);
        };

        var coerceType = function (el, value) {
          var attr = el.getAttribute("data-brz-consent");
          var isKnownCategory =
            attr === "preferences" ||
            attr === "statistics" ||
            attr === "marketing" ||
            attr === "other";

          // Defeats self-unblocking trackers that flip their own type
          // back to executable after we gated them. Guards all three
          // re-enable paths: setAttribute("type", ...), the type IDL
          // property, and removeAttribute("type") (which is routed here
          // as an empty-string type, since a missing type is executable).
          if (
            el.getAttribute("type") === "text/plain" &&
            isKnownCategory &&
            (value === "" ||
              value === "text/javascript" ||
              value === "application/javascript" ||
              value === "module")
          ) {
            var freshConsent = parseConsent(readConsentCookie());

            if (!(freshConsent && freshConsent[attr])) {
              return "text/plain";
            }
          }

          return value;
        };

        var instrumentScript = function (el) {
          try {
            var nativeSetAttribute = el.setAttribute;

            Object.defineProperty(el, "src", {
              configurable: true,
              get: function () {
                return srcDescriptor.get.call(el);
              },
              set: function (value) {
                try {
                  gateSrc(el, value);
                } catch (e) {}
                srcDescriptor.set.call(el, value);
              }
            });

            // The IDL property bypasses setAttribute entirely, so it needs
            // its own accessor. A missing descriptor only skips this leg —
            // the src gate above stays in place.
            if (typeDescriptor) {
              Object.defineProperty(el, "type", {
                configurable: true,
                get: function () {
                  return typeDescriptor.get.call(el);
                },
                set: function (value) {
                  try {
                    value = coerceType(el, value);
                  } catch (e) {}
                  typeDescriptor.set.call(el, value);
                }
              });
            }

            el.setAttribute = function (name, value) {
              try {
                var n = String(name).toLowerCase();

                if (n === "src") {
                  gateSrc(el, value);
                } else if (n === "type") {
                  value = coerceType(el, value);
                }
              } catch (e) {}

              return nativeSetAttribute.call(el, name, value);
            };

            var nativeRemoveAttribute = el.removeAttribute;

            el.removeAttribute = function (name) {
              try {
                if (String(name).toLowerCase() === "type") {
                  if (coerceType(el, "") === "text/plain") {
                    // Removal would re-enable execution on a gated,
                    // non-consented script - keep the gate in place.
                    return;
                  }
                }
              } catch (e) {}

              return nativeRemoveAttribute.call(el, name);
            };
          } catch (e) {}
        };

        // Wrap, never clobber: compose with whatever createElement already
        // is at our run time (we're the first script, but stay defensive).
        document.createElement = function () {
          var el = nativeCreateElement.apply(document, arguments);

          try {
            if (
              arguments[0] &&
              String(arguments[0]).toLowerCase() === "script"
            ) {
              instrumentScript(el);
            }
          } catch (e) {}

          return el;
        };
      }
    } catch (e) {}
    // --- end createElement gate ---

    var consent = parseConsent(readConsentCookie());
    var initialScripts = document.querySelectorAll("script");

    for (var i = 0; i < initialScripts.length; i++) {
      processScript(initialScripts[i], consent);
    }

    if (typeof MutationObserver !== "undefined") {
      var observer = new MutationObserver(function (mutations) {
        // Fresh read per batch: after the activator re-injects a
        // consent-granted script it carries a granted-category label and
        // must be let through.
        var batchConsent = parseConsent(readConsentCookie());

        for (var m = 0; m < mutations.length; m++) {
          var addedNodes = mutations[m].addedNodes;

          for (var n = 0; n < addedNodes.length; n++) {
            var addedNode = addedNodes[n];

            if (addedNode.tagName === "SCRIPT") {
              processScript(addedNode, batchConsent);
            }
          }
        }
      });

      // Never disconnected: SPA-safe, and lets consent-granted re-injected
      // scripts keep flowing through for the lifetime of the page.
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  } catch (e) {}
})();`;

export function getConsentBlockerScript(): string {
  const vendorMapSource =
    "[" +
    VENDOR_MAP.map(
      ([regexp, category]) => `[${regexp.toString()},"${category}"]`
    ).join(",") +
    "]";

  return BLOCKER_SOURCE.replace(VENDOR_MAP_PLACEHOLDER, vendorMapSource);
}
