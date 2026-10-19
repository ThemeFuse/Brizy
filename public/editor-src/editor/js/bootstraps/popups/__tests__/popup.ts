import { z } from "zod";
import {
  flushRuntime,
  loadFreeRuntime,
  nextInitComplete,
  type RuntimeManifest,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The external popup loader, driven through `window.brzExternalPopup(url)`: it
// fetches a published popup page, moves the popup into the host page and asks
// the runtime to initialise it. The runtime is the real free dispatcher with a
// fake component that records the roots it is given.

const POPUP_URL = "https://popup.example.com/popup";

interface Request {
  method: string;
  url: string;
}

const requests: Request[] = [];
const roots: unknown[] = [];
let guestPage = "";

class FakeXMLHttpRequest {
  readyState = 0;
  status = 0;
  responseText = "";
  onreadystatechange: VoidFunction = () => undefined;

  open(method: string, url: string): void {
    requests.push({ method, url });
  }

  send(): void {
    this.readyState = 4;
    this.status = 200;
    this.responseText = guestPage;
    this.onreadystatechange();
  }
}

const manifest: RuntimeManifest = {
  a: {
    selector: ".brz-a",
    path: async () => ({
      default: (root: unknown) => {
        roots.push(root);
      }
    })
  }
};

const popupMarkup = `<div class="brz-conditions-popup"><div class="brz-a"></div></div>`;

const guest = (head: string, body: string): string =>
  `<html><head>${head}</head><body>${body}</body></html>`;

function openExternalPopup(url: string): void {
  z.function().args(z.string()).parse(Reflect.get(window, "brzExternalPopup"))(
    url
  );
}

const injectedPopup = (): Element | null =>
  document.body.querySelector(".brz-external-popup-elem");

beforeAll(async () => {
  silenceConsole();
  Object.defineProperty(window, "XMLHttpRequest", {
    configurable: true,
    writable: true,
    value: FakeXMLHttpRequest
  });
  await loadFreeRuntime({ kind: "mocked", componentManifest: manifest });
  await import("../popup");
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  requests.length = 0;
  roots.length = 0;
  document.body.innerHTML = "";
});

describe("an external popup", () => {
  it("is moved into the host page and initialised once", async () => {
    guestPage = guest("", popupMarkup);
    const complete = nextInitComplete();

    openExternalPopup(POPUP_URL);
    await complete;
    await flushRuntime();

    const injected = injectedPopup();

    expect(requests).toEqual([
      { method: "GET", url: `${POPUP_URL}?source_url=localhost%2F` }
    ]);
    expect(injected?.className).toBe("brz brz-external-popup-elem");
    expect(injected?.parentElement).toBe(document.body);
    expect(injected?.innerHTML).toBe(popupMarkup);
    expect(roots).toEqual([injected]);
  });

  it("is initialised only after the preview script it brought has loaded", async () => {
    guestPage = guest(
      `<script class="brz-script brz-script-preview" src="https://cdn.example.com/preview.min.js"></script>`,
      popupMarkup
    );

    openExternalPopup(POPUP_URL);
    await flushRuntime();
    const beforeLoad = [...roots];
    const complete = nextInitComplete();
    document.body
      .querySelector("script.brz-script-preview")
      ?.dispatchEvent(new Event("load"));
    await complete;
    await flushRuntime();

    expect({ beforeLoad, afterLoad: roots }).toEqual({
      beforeLoad: [],
      afterLoad: [injectedPopup()]
    });
    expect(injectedPopup()).not.toBeNull();
  });

  it("is not initialised when the fetched page holds no popup", async () => {
    guestPage = guest("", `<div class="brz-a"></div>`);

    openExternalPopup(POPUP_URL);
    await flushRuntime();

    expect(injectedPopup()).toBeNull();
    expect(roots).toEqual([]);
  });
});
