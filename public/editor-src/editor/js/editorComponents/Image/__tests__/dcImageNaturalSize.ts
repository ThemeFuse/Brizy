import {
  cssStyleElementImagePictureSizePreview,
  cssStyleElementImagePosition
} from "visual/utils/cssStyle/cssStyleElementImage";
import { getSizeType } from "../utils";

// A dynamic-content image with size="original" is served UNCROPPED (natural aspect).
// On some projects the image ends up stored as `sizeType: "custom"` with a baked
// pixel height (patchOnDCChange when the DC config has no size, or a manual resize).
// A "custom" box then:
//   - squeezes the uncropped image (object-fit: fill on a fixed-aspect box), and
//   - sizes it differently in the editor (absolute px height) vs preview (relative
//     padding-top that drifts with the carousel's estimated slide width).
//
// Fix: a DC image can never be a fixed "custom" box — getSizeType treats it as
// "original", so it follows its natural aspect ratio consistently in editor AND
// preview (padding-top: 0 + in-flow img), repairing existing pages at render time.
// The size is read from the placeholder by reusing migration m2's parser
// (placeholderObjFromStr), which already covers the quote-style variants.

const population =
  '{{brizy_dc_collection_item_field size="original" slug="image"}}';

const sizeTypeOf = (imagePopulation: string, sizeType: string): string =>
  getSizeType({ imagePopulation, sizeType } as never, "desktop");

describe("DC image is never locked into a fixed custom box", () => {
  test("getSizeType: a DC image stored as custom is treated as original", () => {
    expect(sizeTypeOf(population, "custom")).toBe("original");
  });

  test("getSizeType: a regular (non-DC) custom image is left untouched", () => {
    expect(sizeTypeOf("", "custom")).toBe("custom");
  });

  test("getSizeType: a DC image that is already original / predefined is untouched", () => {
    expect(sizeTypeOf(population, "original")).toBe("original");
    expect(sizeTypeOf(population, "thumbnail")).toBe("thumbnail");
  });

  test("getSizeType: a DC image with no declared size stays custom (aligned with migration m2)", () => {
    expect(sizeTypeOf("{{some_dc_field}}", "custom")).toBe("custom");
  });

  test("getSizeType: size=original is honored across every quote style", () => {
    expect(sizeTypeOf('{{test size="original"}}', "custom")).toBe("original");
    expect(sizeTypeOf("{{test size='original'}}", "custom")).toBe("original");
    expect(sizeTypeOf("{{test size=&quot;original&quot;}}", "custom")).toBe(
      "original"
    );
    expect(sizeTypeOf("{{test size=&apos;original&apos;}}", "custom")).toBe(
      "original"
    );
  });

  test("getSizeType: a custom DC image with a non-original size stays custom (fix scoped to original)", () => {
    expect(sizeTypeOf("{{test size='thumbnail'}}", "custom")).toBe("custom");
    expect(sizeTypeOf('{{test size="medium"}}', "custom")).toBe("custom");
    expect(sizeTypeOf("{{test size=''}}", "custom")).toBe("custom");
  });

  test("preview box for a DC image stored as custom is natural — no fixed padding-top, in-flow img", () => {
    const v = {
      sizeType: "custom",
      imageSrc: "resolved-dc.jpg",
      imagePopulation: population,
      imageExtension: "jpg"
    } as never;
    const props = { desktop: { width: 488, height: 285 } };

    // Before the fix this produced "padding-top: 58.4016%;" (fixed 1.712:1 box) +
    // "position: absolute;" — i.e. the squeeze and the editor/preview height mismatch.
    expect(
      cssStyleElementImagePictureSizePreview({ v, device: "desktop", props })
    ).toBe("padding-top: 0;");
    expect(cssStyleElementImagePosition({ v, device: "desktop" })).toBe(
      "position: inherit;"
    );
  });
});
