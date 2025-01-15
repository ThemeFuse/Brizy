import React from "react";
import { renderWithProviders } from "test-utils";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";

describe("Snapshots", () => {
  test("Default view", () => {
    const node = renderWithProviders(
      <FatCheckIcon icon={"nc-button"} label={"Test"} />
    );

    expect(node.container.firstChild).toMatchSnapshot();
  });
});

describe("Test props", () => {
  test("Put label text on container element as title attribute", () => {
    const node = renderWithProviders(
      <FatCheckIcon icon={"nc-button"} label={"Test label"} />
    );

    expect(node.container.firstElementChild?.getAttribute("title")).toBe(
      "Test label"
    );
  });
});
