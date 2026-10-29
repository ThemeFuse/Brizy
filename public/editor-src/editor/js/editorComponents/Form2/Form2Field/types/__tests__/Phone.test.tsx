import { render } from "@testing-library/react";
import React from "react";
import Phone from "../Phone";

// The phone field renders a country <select> via SlimSelect and a Toolbar
// wrapper that are irrelevant to this test. Mock them out so we can focus on
// the phone-number <input> markup.
jest.mock("visual/component/SlimSelect", () => ({
  SlimSelect: () => null
}));
jest.mock("visual/component/Toolbar", () => ({
  __esModule: true,
  default: ({ children }: { children: (a: { ref: null }) => JSX.Element }) =>
    children({ ref: null })
}));
jest.mock("visual/component/ThemeIcon", () => ({
  ThemeIcon: () => null
}));
jest.mock("../../../utils", () => ({
  getFlags: () => [],
  flagsToSelectPhoneOptions: () => [],
  getFlagIconClass: () => ""
}));

const baseProps = {
  _id: "id",
  name: "phone",
  label: "Phone",
  labelType: "outside",
  showPlaceholder: true,
  placeholder: "Enter your phone",
  required: "off",
  type: "Phone",
  onChange: jest.fn()
};

function getPhoneInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector(
    ".brz-forms2__phone--number input"
  ) as HTMLInputElement | null;
  if (!input) {
    throw new Error("phone number input not found");
  }
  return input;
}

describe("Form2 Phone field (labelType: outside)", () => {
  test("on the published page the placeholder is NOT used as the input value", () => {
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    const { container } = render(
      <Phone {...(baseProps as any)} renderContext="view" />
    );

    const input = getPhoneInput(container);

    expect(input.getAttribute("placeholder")).toBe("Enter your phone");
    // The bug: the placeholder text was prefilled as the input's value, so the
    // user had to delete it before typing. The value must start empty.
    expect(input.value).toBe("");
    expect(input.getAttribute("value")).not.toBe("Enter your phone");
  });

  test("in the editor the placeholder text remains editable as the value", () => {
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    const { container } = render(
      <Phone {...(baseProps as any)} renderContext="editor" />
    );

    const input = getPhoneInput(container);

    expect(input.value).toBe("Enter your phone");
  });
});
