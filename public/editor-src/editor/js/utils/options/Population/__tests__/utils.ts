import { property } from "es-toolkit/compat";
import {
  Choices,
  OptGroup
} from "visual/component/Options/types/common/Population/types/Choices";
import { PopulationMethod } from "visual/component/Options/types/common/Population/types/PopulationMethod";
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { bindPopulation } from "visual/utils/options/utils/bindPopulation";
import { isOptgroup } from "../utils";

describe("Testing 'bindPopulation' function", function () {
  const method: PopulationMethod = {
    title: "test",
    value: "test",
    attr: {}
  };
  const option: ToolbarItemType = {
    id: "test",
    type: "imageUpload"
  };
  const withPopulation = { ...option, population: { choices: [method] } };
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
      type: "imageUpload"
    };

    expect(bindPopulation(i)).toEqual(i);
  });

  test("If option is not in development, return original option", () => {
    const i: ToolbarItemType = {
      id: "test",
      type: "imageUpload"
    };

    expect(bindPopulation(i)).toEqual(i);
  });

  test("Wrap option in a population option type", () => {
    const option: ToolbarItemType = {
      id: "test",
      type: "imageUpload"
    };
    const withPopulation = {
      ...option,
      population: { choices: [method] }
    };

    const result: ToolbarItemType = {
      id: "test",
      type: "population",
      config: { choices: [method] },
      fallback: { ...option, id: keyToDCFallback2Key(o.id) },
      option: option
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
  const r = bindPopulation(o) as GenericToolbarItemType<"population">;

  test.each(["label", "helper", "position"])(
    "If option has %s, remove it from option and add to population",
    (k) => {
      expect(property(k)(r)).toBe(property(k)(o));
      expect(r.option).not.toHaveProperty(k);
      expect(r.fallback).not.toHaveProperty(k);
    }
  );

  test.each(["id", "classname"])(
    "If option has %s, add it also to population",
    (k) => {
      expect(property(k)(r)).toBe(property(k)(o));
      expect(r.option?.id).toBe(o.id);
    }
  );

  test("Remove population key from original option", () => {
    expect(r.option).not.toHaveProperty("population");
    expect(r.fallback).not.toHaveProperty("population");
  });

  test("Is optgroup", () => {
    expect(isOptgroup(choices[0])).toBe(false);
    expect(isOptgroup(choices[1])).toBe(true);
  });
});
