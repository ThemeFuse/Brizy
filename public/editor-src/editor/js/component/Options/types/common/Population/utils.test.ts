import { property } from "underscore";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulation, isOptgroup } from "./utils";
import { PopulationMethod } from "./types/PopulationMethod";
import { Choices, OptGroup } from "./types/Choices";

describe("Testing 'bindPopulation' function", function() {
  const method: PopulationMethod = { title: "test", value: "test" };
  const option: ToolbarItemType = {
    id: "test",
    type: "imageUpload-dev",
    value: { src: "test.jpg", extension: "jpg" }
  };
  const withPopulation = { ...option, population: [method] };
  const choices: (Choices<string | number> | OptGroup<string | number>)[] = [
    {
      value: "1",
      title: "Title"
    },
    {
      title: "Title 2",
      optgroup: [
        {
          value: "2",
          title: "Title 2.1"
        },
        {
          value: "3",
          title: "Title 2.2"
        }
      ]
    }
  ];

  test("If population is not defined, return original option", () => {
    const i: ToolbarItemType = {
      id: "test",
      type: "imageUpload-dev",
      value: { src: "test.jpg", extension: "jpg" }
    };

    expect(bindPopulation(i)).toEqual(i);
  });

  test("If option is not in development, return original option", () => {
    const i: ToolbarItemType = {
      id: "test",
      type: "imageSetter",
      value: { src: "test.jpg", extension: "jpg" },
      population: [method]
    };

    expect(bindPopulation(i)).toEqual(i);
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

    expect(bindPopulation(withPopulation)).toEqual(result);
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
  const r = bindPopulation(o);

  test.each(["label", "helper", "position"])(
    "If option has %s, remove it from option and add to population",
    k => {
      expect(property(k)(r)).toBe(property(k)(o));
      expect(property(["options", 0])(r)).not.toHaveProperty(k);
    }
  );

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

  test("Is optgroup", () => {
    expect(isOptgroup(choices[0])).toBe(false);
    expect(isOptgroup(choices[1])).toBe(true);
  });
});
