import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import {
  settleTransport,
  stubTransport,
  type Transport
} from "../../../../../jest-utils/formTransport";

// A published Form2 inside a SectionPopup2, initialised the way a page does it.
// The request is answered by the transport stub; only what happens to the
// popup after a successful submit is covered here.

const elementSchema = z.instanceof(HTMLElement);

function pageHtml(closePopup: string, popupId: string): string {
  return `<a class="brz-a" ${makeAttr("link-type")}="popup" href="#fp">Open</a>
  <div class="brz brz-popup2" id="fp" ${makeAttr("popup")}="fp">
    <div class="brz-popup2__inner"><div class="brz-container__wrap">
      <div class="brz-container">
        <div class="brz-forms2" ${makeAttr("form-version")}="2">
          <form class="brz-form" action="/submit" ${makeAttr("close-popup")}="${closePopup}" ${makeAttr("popup-id")}="${popupId}">
            <div class="brz-forms2__item brz-forms2__item-button"><button class="brz-btn" type="submit">Send</button></div>
          </form>
        </div>
      </div>
    </div></div>
  </div>
  <div id="not-a-popup"></div>`;
}

function query(root: ParentNode, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

const closed: unknown[] = [];
let transport: Transport;

beforeAll(() => {
  silenceConsole();
});

beforeEach(async () => {
  transport = stubTransport({
    kind: "response",
    status: 200,
    contentType: "application/json",
    body: `{"success":true}`
  });
  await loadFreeRuntime({ kind: "real" });
  window.Brz.on("elements.popup.close", (node: unknown) => closed.push(node));
});

afterEach(() => {
  // A new body drops the listeners earlier exports attached to the old one.
  document.body.replaceWith(document.createElement("body"));
  document.documentElement.className = "";
  localStorage.clear();
  closed.length = 0;
  transport.restore();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Form2 in a popup on a published page", () => {
  it.each([
    { case: "closes its popup", closePopup: "on", popupId: "fp", closes: true },
    {
      case: "keeps its popup open when closing is off",
      closePopup: "off",
      popupId: "fp",
      closes: false
    },
    {
      case: "ignores a target that is not a popup",
      closePopup: "on",
      popupId: "not-a-popup",
      closes: false
    },
    {
      case: "ignores a missing target",
      closePopup: "on",
      popupId: "missing",
      closes: false
    }
  ])(
    "$case after a successful submit",
    async ({ closePopup, popupId, closes }) => {
      const root = mountRoot(pageHtml(closePopup, popupId));
      await initFree([document.body]);
      query(root, "a").click();
      const popup = query(document.body, ".brz-popup2");

      query(popup, "form").dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await settleTransport();

      expect(transport.requests).toHaveLength(1);
      expect(popup.classList.contains("brz-popup2--opened")).toBe(!closes);
      expect(document.documentElement.classList.contains("brz-ow-hidden")).toBe(
        !closes
      );
      expect(closed).toEqual(closes ? [popup] : []);
    }
  );
});
