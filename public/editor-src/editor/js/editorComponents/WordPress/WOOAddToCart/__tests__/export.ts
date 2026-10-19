import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../../jest-utils/exportRuntime";

// Published WooCommerce add-to-cart: the pro manifest stands in for the WP one.

const gallery = `<div class="woocommerce-product-gallery"></div>`;
const variationsForm = `<form class="variations_form cart"></form>`;
const simpleForm = `<form class="cart"></form>`;

function pageHtml(galleryHtml: string, formHtml: string): string {
  return `
    <section data-name="section">
      <div data-name="row">
        <div data-name="gallery-column">${galleryHtml}</div>
        <div data-name="cart-column">
          <div class="brz-woo-add-to-cart" data-name="add-to-cart">${formHtml}</div>
        </div>
      </div>
    </section>
  `;
}

beforeAll(async () => {
  silenceConsole();
  await loadProRuntime(
    { kind: "mocked", componentManifest: {} },
    {
      kind: "mocked",
      componentManifest: {
        wooAddToCart: {
          selector: ".brz-woo-add-to-cart",
          path: () => import("../export.js")
        }
      }
    }
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("WOOAddToCart on a published page", () => {
  it.each([
    {
      case: "a variations form next to a product gallery",
      html: pageHtml(gallery, variationsForm),
      products: ["row"]
    },
    {
      case: "a variations form with the gallery inside the element",
      html: pageHtml("", `${variationsForm}${gallery}`),
      products: ["add-to-cart"]
    },
    {
      case: "a variations form without a product gallery",
      html: pageHtml("", variationsForm),
      products: []
    },
    {
      case: "a simple form next to a product gallery",
      html: pageHtml(gallery, simpleForm),
      products: []
    }
  ])("marks the product container for $case", async ({ html, products }) => {
    const root = mountRoot(html);
    await initPro("init.pro.dom", [root]);

    expect(
      Array.from(document.querySelectorAll(".product")).map((node) =>
        node.getAttribute("data-name")
      )
    ).toEqual(products);
  });
});
