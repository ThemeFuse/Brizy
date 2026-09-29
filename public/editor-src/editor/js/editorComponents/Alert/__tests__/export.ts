import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The published Alert, initialised the way a page does it: the free bootstrap
// with the real manifest receives `init.dom` and loads this export.

function alertHtml(delay: number): string {
  const closeClassName =
    delay > 0 ? "brz-alert-close brz-hidden" : "brz-alert-close";

  return `
    <div class="brz-wrapper">
      <div class="brz-alert" ${makeAttr("delay")}="${delay}">
        <span><p class="brz-alert-title">Title</p></span>
        <span><p class="brz-alert-description">Description</p></span>
        <span class="${closeClassName}"><svg class="brz-alert-close-icon"></svg></span>
      </div>
    </div>
  `;
}

const elementSchema = z.instanceof(HTMLElement);

function query(root: HTMLElement, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

beforeAll(async () => {
  silenceConsole();
  await loadFreeRuntime({ kind: "real" });
});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
  document.body.innerHTML = "";
});

describe("Alert on a published page", () => {
  it.each([
    { case: "no delay", delay: 0 },
    { case: "a delay", delay: 2 }
  ])(
    "hides the alert when its close button is clicked, with $case",
    async ({ delay }) => {
      const root = mountRoot(alertHtml(delay));

      await initFree([root]);
      query(root, ".brz-alert-close").click();

      expect(query(root, ".brz-wrapper").classList.contains("brz-hidden")).toBe(
        true
      );
    }
  );

  it.each([
    { case: "no time has passed", delay: 2, elapsed: 0, hidden: true },
    { case: "just before the delay", delay: 2, elapsed: 1999, hidden: true },
    { case: "the delay has passed", delay: 2, elapsed: 2000, hidden: false },
    { case: "there is no delay", delay: 0, elapsed: 0, hidden: false }
  ])(
    "sets the close button hidden to $hidden when $case",
    async ({ delay, elapsed, hidden }) => {
      jest.useFakeTimers();
      const root = mountRoot(alertHtml(delay));

      await initFree([root]);
      jest.advanceTimersByTime(elapsed);

      expect(
        query(root, ".brz-alert-close").classList.contains("brz-hidden")
      ).toBe(hidden);
    }
  );
});
