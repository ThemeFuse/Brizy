import { render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import type { RenderType } from "visual/providers/RenderProvider";
import Phone from "../Phone";

// The country code a phone field shows beside its flag when "Show Country Code" is on.

jest.mock("visual/component/Toolbar", () => ({
  __esModule: true,
  default: ({
    children
  }: {
    children: (props: { ref: () => void }) => unknown;
  }): unknown => children({ ref: () => undefined })
}));
jest.mock("visual/component/SlimSelect", () => ({
  SlimSelect: (): null => null
}));
jest.mock("visual/component/ThemeIcon", () => ({
  ThemeIcon: ({ name }: { name: string }): ReactElement => (
    <i data-icon={name} />
  )
}));
jest.mock("../../../utils", () => ({
  getFlags: () => [
    { code: "MD", dialCode: "+373", name: "Moldova" },
    { code: "RO", dialCode: "+40", name: "Romania" }
  ],
  flagsToSelectPhoneOptions: (): [] => [],
  getFlagIconClass: (code: string): string => `flag-${code}`
}));

interface Variant {
  renderContext: RenderType;
  phoneShowDialCode: string;
  phoneDefaultCountry: string;
}

const phone = ({
  renderContext,
  phoneShowDialCode,
  phoneDefaultCountry
}: Variant): ReactElement => (
  <Phone
    name="phone"
    label="Phone"
    labelType="inside"
    showPlaceholder={true}
    placeholder="Phone"
    items={[]}
    type="Phone"
    renderContext={renderContext}
    phoneShowDialCode={phoneShowDialCode}
    phoneDefaultCountry={phoneDefaultCountry}
  />
);

const dialCodeOf = (container: HTMLElement): string | undefined =>
  container.querySelector(".brz-forms2__phone--country-code")?.textContent ??
  undefined;

describe("Form2 Phone field country code", () => {
  it.each([
    {
      case: "the editor, on",
      renderContext: "editor",
      show: "on",
      out: "+373"
    },
    { case: "the page, on", renderContext: "view", show: "on", out: "+373" },
    {
      case: "the editor, off",
      renderContext: "editor",
      show: "off",
      out: undefined
    },
    {
      case: "the page, off",
      renderContext: "view",
      show: "off",
      out: undefined
    }
  ] satisfies Array<{
    case: string;
    renderContext: RenderType;
    show: string;
    out: string | undefined;
  }>)("in $case", ({ renderContext, show, out }) => {
    const { container } = render(
      phone({
        renderContext,
        phoneShowDialCode: show,
        phoneDefaultCountry: "MD"
      })
    );

    expect(dialCodeOf(container)).toBe(out);
  });

  it("sits between the flag and the arrow", () => {
    const { container } = render(
      phone({
        renderContext: "view",
        phoneShowDialCode: "on",
        phoneDefaultCountry: "MD"
      })
    );
    const selected = container.querySelector(
      ".brz-forms2__phone--country-selected"
    );

    expect(
      Array.from(selected?.children ?? []).map(
        (child) => child.className || child.getAttribute("data-icon")
      )
    ).toEqual(["flag-MD", "brz-forms2__phone--country-code", "arrow-down"]);
  });

  it("follows the default country in the editor", () => {
    const variant: Variant = {
      renderContext: "editor",
      phoneShowDialCode: "on",
      phoneDefaultCountry: "MD"
    };
    const { container, rerender } = render(phone(variant));

    rerender(phone({ ...variant, phoneDefaultCountry: "RO" }));

    expect(dialCodeOf(container)).toBe("+40");
  });
});
