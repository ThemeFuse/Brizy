import { imagePopulationUrl } from "../imagePopulationUrl";

describe("Testing 'imagePopulationUrl' function", () => {
  test.each([
    {
      tag: "{{ brizy_dc_img_featured_image }}",
      cW: 10,
      cH: 20,
      result: "{{brizy_dc_img_featured_image cH='20' cW='10'}}"
    },

    {
      tag: "{{ brizy_dc_img_featured_image _fallback='test' }}",
      cW: 10,
      cH: 20,
      result: "{{brizy_dc_img_featured_image _fallback='test' cH='20' cW='10'}}"
    }
  ])("Valid str", ({ tag, cH, cW, result }) =>
    expect(imagePopulationUrl(tag, { cW, cH })).toBe(result)
  );
});
