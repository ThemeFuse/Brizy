import { z } from "zod";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole,
  stopClicksAt,
  trackClickListeners
} from "../../../../../../jest-utils/exportRuntime";

// Published WooCommerce cart: the pro manifest stands in for the WordPress one.

const cartHtml = `
  <div class="brz-woocart__wrapper brz-woocart__parent brz-woocart--sidebar">
    <div class="brz-woocart__background"></div>
    <div class="brz-woocart__dc">
      <div class="brz-cart">
        <a class="brz-a brz-woocart">
          <span class="brz-woocart__parent"><span class="brz-woocart__price">$10</span></span>
          <span class="brz-woocart__icon" data-counter="1"></span>
        </a>
        <form class="brz-woocart__sidebar">
          <div class="brz-woocart__sidebar-close"></div>
        </form>
      </div>
    </div>
  </div>
`;

const elementSchema = z.instanceof(HTMLElement);

function queryAll(root: ParentNode, selector: string): HTMLElement[] {
  return z
    .array(elementSchema)
    .parse(Array.from(root.querySelectorAll(selector)));
}

function nth(nodes: HTMLElement[], index: number): HTMLElement {
  return elementSchema.parse(nodes[index]);
}

interface State {
  wrappers: boolean[];
  body: string[];
}

function stateOf(root: HTMLElement): State {
  return {
    wrappers: queryAll(root, ".brz-woocart__wrapper").map((wrapper) =>
      wrapper.classList.contains("brz-woocart__wrapper--opened")
    ),
    body: Array.from(document.body.classList)
  };
}

const openedBody = ["brz", "brz-ow-hidden", "brz-woocart--opened"];
const closedBody = ["brz"];

beforeAll(async () => {
  silenceConsole();
  await loadProRuntime(
    { kind: "mocked", componentManifest: {} },
    {
      kind: "mocked",
      componentManifest: {
        wooCart: {
          selector: ".brz-woocart__wrapper",
          path: () => import("../export.js")
        }
      }
    }
  );
});

beforeEach(() => {
  document.body.className = "brz";
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.className = "";
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("WOOCart on a published page", () => {
  it.each([
    {
      case: "a click on the cart",
      clicks: [".brz-woocart__price"],
      opened: true
    },
    {
      case: "the cart and then the close icon",
      clicks: [".brz-woocart", ".brz-woocart__sidebar-close"],
      opened: false
    },
    {
      case: "the cart and then the backdrop",
      clicks: [".brz-woocart", ".brz-woocart__background"],
      opened: false
    },
    {
      case: "the cart twice",
      clicks: [".brz-woocart", ".brz-woocart"],
      opened: true
    },
    {
      case: "the close icon alone",
      clicks: [".brz-woocart__sidebar-close"],
      opened: false
    }
  ])("has the right sidebar state after $case", async ({ clicks, opened }) => {
    const root = mountRoot(cartHtml);
    await initPro("init.pro.dom", [root]);

    for (const selector of clicks) {
      elementSchema.parse(root.querySelector(selector)).click();
    }

    expect(stateOf(root)).toEqual({
      wrappers: [opened],
      body: opened ? openedBody : closedBody
    });
  });

  it.each([
    {
      case: "opening the second",
      clicks: [{ cart: 1, selector: ".brz-woocart" }],
      wrappers: [false, true],
      body: openedBody
    },
    {
      case: "opening both and closing the first",
      clicks: [
        { cart: 0, selector: ".brz-woocart" },
        { cart: 1, selector: ".brz-woocart" },
        { cart: 0, selector: ".brz-woocart__sidebar-close" }
      ],
      wrappers: [false, true],
      body: closedBody
    }
  ])(
    "keeps two carts on one page apart when $case",
    async ({ clicks, wrappers, body }) => {
      const root = mountRoot(`${cartHtml}${cartHtml}`);
      await initPro("init.pro.dom", [root]);
      const carts = queryAll(root, ".brz-woocart__wrapper");

      for (const { cart, selector } of clicks) {
        elementSchema.parse(nth(carts, cart).querySelector(selector)).click();
      }

      expect(stateOf(root)).toEqual({ wrappers, body });
    }
  );

  it.each([
    {
      case: "the cart",
      clicks: [".brz-woocart"],
      opened: true
    },
    {
      case: "the close icon",
      clicks: [".brz-woocart", ".brz-woocart__sidebar-close"],
      opened: false
    },
    {
      case: "the backdrop",
      clicks: [".brz-woocart", ".brz-woocart__background"],
      opened: false
    }
  ])(
    "has done its work when a click on $case reaches the page around it",
    async ({ clicks, opened }) => {
      const root = mountRoot(cartHtml);
      await initPro("init.pro.dom", [root]);
      const seen = stopClicksAt(root, () => stateOf(root).wrappers);

      for (const selector of clicks) {
        elementSchema.parse(root.querySelector(selector)).click();
      }

      expect(seen.at(-1)).toEqual([opened]);
      expect(stateOf(root).wrappers).toEqual([opened]);
    }
  );

  it("leaves a cart mounted after it was initialised alone", async () => {
    const root = mountRoot(cartHtml);
    await initPro("init.pro.dom", [root]);
    const late = mountRoot(cartHtml);

    elementSchema.parse(late.querySelector(".brz-woocart")).click();

    expect(stateOf(late).wrappers).toEqual([false]);
  });

  it("listens for the clicks of every cart with one listener on body", async () => {
    const root = mountRoot(`${cartHtml}${cartHtml}`);
    const listeners = trackClickListeners();
    await initPro("init.pro.dom", [root]);
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });
});
