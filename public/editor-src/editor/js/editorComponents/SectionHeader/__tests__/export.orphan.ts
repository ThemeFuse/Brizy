import { z } from "zod";
import * as group8 from "visual/libs/group-8";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";

// Own file: a bar outside any `.brz-section__header` keeps throwing on every later frame.

const errors: unknown[] = [];
const shown: unknown[] = [];

function onError(event: ErrorEvent): void {
  // A handled error does not reach Jest as an uncaught exception.
  event.preventDefault();
  errors.push(event.error);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

beforeAll(async () => {
  silenceConsole();
  window.addEventListener("error", onError);
  await loadProRuntime({ kind: "real" }, { kind: "real" });
  publishLibGroup("BrizyLibs", group8);
  window.Brz.on("elements.headerSticky.show", (payload: unknown) => {
    shown.push(payload);
  });
  window.Brz.on("elements.headerSticky.hide", (payload: unknown) => {
    shown.push(payload);
  });
});

afterAll(() => {
  window.removeEventListener("error", onError);
  jest.restoreAllMocks();
});

describe("an animated header bar without a header around it", () => {
  it("throws on every check and blocks the headers registered after it", async () => {
    const root = mountRoot(`
      <div class="brz-section__header--animated">Orphan</div>
      <header class="brz-section brz-section__header brz-section__header-type--animated">
        <div class="brz-section__header--animated">Sticky</div>
      </header>
    `);
    await initPro("init.pro.dom", [root]);
    const header = z
      .instanceof(HTMLElement)
      .parse(root.querySelector(".brz-section__header"));
    header.getBoundingClientRect = () => new DOMRect(0, -100, 1024, 100);

    window.dispatchEvent(new Event("scroll"));
    await nextFrame();
    window.dispatchEvent(new Event("scroll"));
    await nextFrame();

    expect({
      errors: errors.map((error) => error instanceof TypeError),
      events: shown.length,
      opened: root.querySelectorAll(".brz-section__header--animated-opened")
        .length
    }).toEqual({ errors: [true, true], events: 0, opened: 0 });
  });
});
