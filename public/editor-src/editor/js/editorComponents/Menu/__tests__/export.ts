import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// Published Menu (pro): mmenu is a recorder, each test gets a fresh runtime.

const menuHtml = `
  <div class="brz-menu__container" data-mmenu-id="#menu-1" data-mmenu-position="position-left" data-mmenu-title="Menu">
    <nav class="brz-menu">
      <ul class="brz-menu__ul"><li class="brz-menu__item"><a class="brz-a" href="/">Home</a></li></ul>
    </nav>
    <div class="brz-mm-menu__icon"></div>
    <nav class="brz-menu brz-menu__mmenu" id="menu-1">
      <ul class="brz-menu__ul"><li class="brz-menu__item"><a class="brz-a" href="/">Home</a></li></ul>
    </nav>
  </div>
`;

const rootContainer = (content: string): string =>
  `<div class="brz-root__container">${content}</div>`;

const constructed: unknown[][] = [];

class RecordingMMenu {
  constructor(...args: unknown[]) {
    constructed.push(args);
  }
}

beforeAll(() => {
  silenceConsole();
  Object.defineProperty(window, "BrizyProLibs", {
    configurable: true,
    writable: true,
    value: { MMenu: RecordingMMenu }
  });
});

beforeEach(async () => {
  await loadProRuntime({ kind: "real" }, { kind: "real" });
});

afterEach(() => {
  constructed.length = 0;
  document.body.replaceWith(document.createElement("body"));
});

afterAll(() => {
  Reflect.deleteProperty(window, "BrizyProLibs");
  jest.restoreAllMocks();
});

describe("Menu on a published page", () => {
  it.each([
    {
      case: "one root container",
      html: rootContainer(menuHtml),
      config: [
        {
          offCanvas: {
            menu: { insertSelector: ".brz-root__container" },
            page: { wrapIfNeeded: false, selector: ".brz-root__container" }
          }
        }
      ]
    },
    { case: "no root container", html: menuHtml, config: [] },
    {
      case: "two root containers",
      html: `${rootContainer(menuHtml)}${rootContainer("")}`,
      config: []
    }
  ])(
    "builds the mobile menu on a page with $case",
    async ({ html, config }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);

      expect(constructed).toEqual([
        [
          "#menu-1",
          expect.objectContaining({
            extensions: [
              "theme-dark",
              "pagedim-black",
              "border-full",
              "position-front",
              "position-left"
            ]
          }),
          ...config
        ]
      ]);
    }
  );
});
