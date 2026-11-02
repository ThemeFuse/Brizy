// The calculated field of a published Form2 following the fields it is built from.

import type Formula from "fparser";
import {
  mount,
  mouseDown,
  mouseUp,
  NO_MODIFIERS,
  query,
  queryAll,
  queryInput
} from "visual/libs/select2/__fixtures__/env";
import { formSelect, option } from "visual/libs/select2/__fixtures__/markup";
import { useGroup1Env } from "visual/libs/select2/__fixtures__/suite";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";
import {
  ACTION,
  calculatedField,
  checkboxField,
  form2,
  radioField,
  textField
} from "../__fixtures__/form";

useGroup1Env();

const PRICE = textField({
  label: "Price",
  type: "Number",
  inputType: "number",
  required: false,
  attributes: ""
});

const TAX = formSelect({
  id: "tax",
  label: "Tax",
  multiple: false,
  required: false,
  placeholder: "Pick a tax",
  defaultValue: "",
  options: [option("", "Tax"), option("2", "Two"), option("3", "Three")]
});

interface Page {
  root: HTMLElement;
  total: () => string;
  typeNumber: (value: string) => void;
  check: (value: string, checked: boolean) => void;
  choose: (text: string) => void;
}

async function page(expression: string, fields: string): Promise<Page> {
  const parser = jest.requireActual<typeof Formula>(
    "fparser/dist/fparser.umd.cjs"
  );
  publishLibGroup("BrizyLibs", { ...window.BrizyLibs, Formula: parser });

  const { default: init } = await import(
    "visual/editorComponents/Form2/export"
  );
  const root = mount(
    form2({
      attributes: ACTION,
      fields:
        fields + calculatedField({ label: "Total", expression, initial: "0" })
    })
  );

  init(root);

  return {
    root,
    total: () => queryInput(root, `input[name="Total"]`).value,
    typeNumber: (value) => {
      const input = queryInput(root, `input[name="Price"]`);

      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    check: (value, checked) => {
      const input = queryInput(root, `input[value="${value}"]`);

      input.checked = checked;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    choose: (text) => {
      mouseDown(query(root, ".select2-selection"));

      const result = queryAll(root, ".select2-results__option").find(
        (node) => node.textContent === text
      );

      if (!result) {
        throw new Error(`no result with the text ${text}`);
      }

      mouseUp(result, NO_MODIFIERS);
    }
  };
}

describe("the calculated field", () => {
  it("follows a number field as it is typed", async () => {
    const { total, typeNumber } = await page("{{Price}} * 2", PRICE);

    typeNumber("21");
    expect(total()).toBe("42");

    typeNumber("4");
    expect(total()).toBe("8");
  });

  it("follows the chosen radio", async () => {
    const { total, check } = await page(
      "{{Plan}} * 3",
      radioField({ label: "Plan", values: ["10", "20"], defaultValue: "" })
    );

    check("20", true);
    expect(total()).toBe("60");

    check("10", true);
    expect(total()).toBe("30");
  });

  it("follows the sum of the checked boxes", async () => {
    const { total, check } = await page(
      "{{Extras}} + 1",
      checkboxField({ label: "Extras", values: ["5", "7"], defaultValue: "" })
    );

    check("5", true);
    expect(total()).toBe("6");

    check("7", true);
    expect(total()).toBe("13");

    check("5", false);
    expect(total()).toBe("8");
  });

  it("follows the option chosen in a select", async () => {
    const { total, choose } = await page("{{Tax}} * 10", TAX);

    choose("Two");
    expect(total()).toBe("20");

    choose("Three");
    expect(total()).toBe("30");
  });

  it("combines a number field with a select", async () => {
    const { total, typeNumber, choose } = await page(
      "{{Price}} + {{Tax}}",
      PRICE + TAX
    );

    typeNumber("10");
    expect(total()).toBe("10");

    choose("Three");
    expect(total()).toBe("13");
  });

  it("keeps the names of fields that have spaces", async () => {
    const { total, root } = await page(
      "{{Unit price}} * 2",
      textField({
        label: "Unit price",
        type: "Number",
        inputType: "number",
        required: false,
        attributes: ""
      })
    );
    const input = queryInput(root, `input[name="Unit price"]`);

    input.value = "6";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(total()).toBe("12");
  });
});
