import React from "react";
import { render } from "@testing-library/react";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";
import Config from "visual/global/Config";

describe("Snapshots", () => {
  beforeAll(() => {
    global.IS_EDITOR = true;

    Config.load({
      // @ts-expect-error to find out what happens here
      urls: {
        editorIcons: "/"
      }
    });
  });

  test("Default view", () => {
    const node = render(<FatCheckIcon icon={"nc-button"} label={"Test"} />);

    expect(node.container.firstChild).toMatchSnapshot();
  });
});

describe("Test props", () => {
  test("Put label text on container element as title attribute", () => {
    const node = render(
      <FatCheckIcon icon={"nc-button"} label={"Test label"} />
    );

    expect(node.container.firstElementChild?.getAttribute("title")).toBe(
      "Test label"
    );
  });
});
