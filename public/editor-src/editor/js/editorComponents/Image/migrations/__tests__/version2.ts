import { ElementModel } from "visual/component/Elements/Types";
import { m2 } from "../version2";

describe("Testing Image migration", () => {
  test.each<[ElementModel, ElementModel]>([
    [{}, {}],

    [{ color: "111" }, {}],

    [{ sizeType: "custom" }, {}],

    [{ sizeType: "original" }, {}],

    [{ imagePopulation: "{{ featured_image }}" }, { sizeType: "custom" }],

    [
      { imagePopulation: "{{ featured_image }}", sizeType: "original" },
      { sizeType: "custom" }
    ],

    [
      {
        imagePopulation:
          // prettier-ignore
          "{{brizy_dc_collection_item_field slug=\"image\" size=\"original\"}}", // eslint-disable-line
        sizeType: "custom"
      },
      {
        sizeType: "original"
      }
    ],

    [
      {
        imagePopulation: "{{brizy_dc_collection_item_field size=''}}",
        sizeType: "another"
      },
      {
        sizeType: "custom"
      }
    ],

    [
      {
        imagePopulation: '{{brizy_dc_collection_item_field size=""}}',
        sizeType: "another"
      },
      {
        sizeType: "custom"
      }
    ],

    [
      {
        imagePopulation: "{{UserAttribute['publisher_name']|default('abc')}}"
      },
      {
        sizeType: "custom"
      }
    ],

    [
      {
        imagePopulation: "{{UserAttribute['publisher_name']|default('abc')}}",
        sizeType: "original"
      },
      { sizeType: "custom" }
    ]
  ])("SizeType %#", (v, expected) => {
    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual(expected);
  });
});
