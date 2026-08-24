import {
  ConfigCommon,
  LeftSidebarMoreOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { isEmbedCodeConsentGateActive, shouldRunEmbedCodeInEditor } from "../";
import { writeConsent } from "../consentStorage";

const PAGE_ID = "page-1";

// Consent is read from browser storage keyed by the page id, so granting it in
// a test means writing it there — not touching the in-memory store, which only
// exists to notify subscribers.
const allowOnThisPage = (): void => writeConsent(PAGE_ID, true);

interface Options {
  gateActive?: boolean;
  disableCodeInEditor?: boolean;
}

const makeConfig = ({
  gateActive = false,
  disableCodeInEditor = false
}: Options = {}): ConfigCommon =>
  ({
    pageData: { id: PAGE_ID },
    ui: {
      leftSidebar: {
        more: {
          options: [
            {
              type: LeftSidebarMoreOptionsIds.link,
              label: "Help",
              link: "https://example.com"
            },
            ...(gateActive
              ? [
                  {
                    type: LeftSidebarMoreOptionsIds.allowEmbedCode,
                    label: "Allow Embed Code"
                  }
                ]
              : [])
          ]
        }
      }
    },
    elements: {
      embedCode: { disableCodeInEditor }
    }
  }) as unknown as ConfigCommon;

describe("embed code consent gate", () => {
  // Opt-in per host
  it("is active when the host declares the option", () => {
    expect(isEmbedCodeConsentGateActive(makeConfig({ gateActive: true }))).toBe(
      true
    );
  });

  it("is inactive when the host does not declare the option", () => {
    expect(isEmbedCodeConsentGateActive(makeConfig())).toBe(false);
  });

  it("is inactive when the More menu has no options at all", () => {
    expect(isEmbedCodeConsentGateActive({} as ConfigCommon)).toBe(false);
  });
});

// The full precedence table
describe("shouldRunEmbedCodeInEditor precedence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("gate active — consent decides, flag is ignored", () => {
    it("runs with the flag set and consent allowed", () => {
      allowOnThisPage();

      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: true, disableCodeInEditor: true })
        )
      ).toBe(true);
    });

    it("does not run with the flag set and consent withheld", () => {
      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: true, disableCodeInEditor: true })
        )
      ).toBe(false);
    });

    it("does not run with the flag unset and consent withheld", () => {
      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: true, disableCodeInEditor: false })
        )
      ).toBe(false);
    });

    it("runs with the flag unset and consent allowed", () => {
      allowOnThisPage();

      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: true, disableCodeInEditor: false })
        )
      ).toBe(true);
    });
  });

  describe("gate inactive — pre-feature behavior is preserved", () => {
    it("does not run when the flag is set", () => {
      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: false, disableCodeInEditor: true })
        )
      ).toBe(false);
    });

    it("runs when the flag is unset", () => {
      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: false, disableCodeInEditor: false })
        )
      ).toBe(true);
    });

    it("runs when the elements config is absent entirely", () => {
      expect(shouldRunEmbedCodeInEditor({} as ConfigCommon)).toBe(true);
    });

    it("ignores consent entirely", () => {
      allowOnThisPage();

      expect(
        shouldRunEmbedCodeInEditor(
          makeConfig({ gateActive: false, disableCodeInEditor: true })
        )
      ).toBe(false);
    });
  });

  // Page-level, not per-element: the predicate depends only on config
  // and the single shared consent value, so every element resolves alike.
  it("resolves identically for every element on the page", () => {
    const config = makeConfig({ gateActive: true });

    allowOnThisPage();

    const results = [1, 2, 3].map(() => shouldRunEmbedCodeInEditor(config));

    expect(results).toEqual([true, true, true]);
  });
});
