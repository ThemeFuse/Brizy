import { Base64 } from "js-base64";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { imagePopulationUrl } from "../imagePopulationUrl";

describe("Testing 'imagePopulationUrl' function", () => {
  test.each([
    {
      tag: "",
      attr: { cW: 10, cH: 20 }
    },

    {
      tag: "{{ asdasd }}",
      attr: { cW: 10, cH: 20 }
    },

    {
      tag: "{{ placeholder }}",
      attr: { cW: 10, cH: 20 }
    },

    {
      tag: "{{ placeholder content='' }}",
      attr: { cW: 10, cH: 20 }
    }
  ])("Invalid str", ({ tag, attr }) => {
    expect(() => {
      expect(imagePopulationUrl(tag, attr));
    }).toThrow();
  });

  test.each([
    {
      tag: makePlaceholder({ content: "{{ brizy_dc_img_featured_image }}" }),
      attr: { cW: 10, cH: 20 },
      result: `{{placeholder content='${Base64.encode(
        "{{ brizy_dc_img_featured_image }}"
      )}' cH='20' cW='10'}}`
    },

    {
      tag: makePlaceholder({
        content: "{{ brizy_dc_img_featured_image }}",
        attr: { _fallback: "test" }
      }),
      attr: { cW: 10, cH: 20 },
      result: `{{placeholder content='${Base64.encode(
        "{{ brizy_dc_img_featured_image }}"
      )}' _fallback='test' cH='20' cW='10'}}`
    },

    {
      tag: makePlaceholder({ content: "{{ brizy_dc_img_featured_image }}" }),
      attr: { cW: 10, cH: 20 },
      result: `{{placeholder content='${Base64.encode(
        "{{ brizy_dc_img_featured_image }}"
      )}' cH='20' cW='10'}}`
    },

    {
      tag: makePlaceholder({
        content: "{{ brizy_dc_img_featured_image size='original' }}"
      }),
      attr: { cW: 10, cH: 20 },
      result: `{{placeholder content='${Base64.encode(
        "{{ brizy_dc_img_featured_image size='original' }}"
      )}' cH='20' cW='10'}}`
    }
  ])("Valid str", ({ tag, attr, result }) =>
    expect(imagePopulationUrl(tag, attr)).toBe(result)
  );
});
