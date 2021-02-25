import { property } from "underscore";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulationEnabled } from "visual/component/Options/types/common/Population/utils";
import { PopulationMethod } from "visual/component/Options/types/common/Population/types/PopulationMethod";

describe("Testing 'bindPopulationEnabled' function", function() {
  const method: PopulationMethod = { title: "test", value: "test" };
  const option: ToolbarItemType = {
    id: "test",
    type: "imageUpload-dev",
    value: { src: "test.jpg", extension: "jpg" }
  };
  const withPopulation = { ...option, population: [method] };

  test("If population is not defined, return original option", () => {
    const i: ToolbarItemType = {
      id: "test",
      type: "imageUpload-dev",
      value: { src: "test.jpg", extension: "jpg" }
    };

    expect(bindPopulationEnabled(i)).toEqual(i);
  });

  test("If option is not in development, return original option", () => {
    const i: ToolbarItemType = {
      id: "test",
      type: "imageSetter",
      value: { src: "test.jpg", extension: "jpg" },
      population: [method]
    };

    expect(bindPopulationEnabled(i)).toEqual(i);
  });

  test("Wrap option in a population option type", () => {
    const option: ToolbarItemType = {
      id: "test",
      type: "imageUpload-dev",
      value: { src: "test.jpg", extension: "jpg" }
    };
    const withPopulation = { ...option, population: [method] };

    const result: ToolbarItemType = {
      id: "test",
      type: "population-dev",
      config: { choices: [method] },
      options: [option]
    };

    expect(bindPopulationEnabled(withPopulation)).toEqual(result);
  });

  const o: ToolbarItemType = {
    ...withPopulation,
    label: "Test",
    display: "inline",
    disabled: false,
    states: ["normal", "hover"],
    devices: "responsive",
    className: "test-class",
    position: 30,
    helper: {
      content: "Test helper"
    }
  };
  const r = bindPopulationEnabled(o);

  test.each([
    "label",
    "display",
    "disabled",
    "states",
    "devices",
    "helper",
    "position"
  ])("If option has %s, remove it from option and add to population", k => {
    expect(property(k)(r)).toBe(property(k)(o));
    expect(property(["options", 0])(r)).not.toHaveProperty(k);
  });

  test.each(["id", "classname"])(
    "If option has %s, add it also to population",
    k => {
      expect(property(k)(r)).toBe(property(k)(o));
      expect(property(["options", 0, k])(r)).toBe(property(k)(o));
    }
  );

  test("Remove population key from original option", () => {
    expect(property(["options", 0])(r)).not.toHaveProperty(
      property("population")(o)
    );
  });
});
