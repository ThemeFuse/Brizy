import { fireEvent, render } from "@testing-library/react";
import React from "react";
import Config from "visual/global/Config";
import { Button } from "./Button";

describe("Test Button", () => {
  beforeAll(() => {
    global.IS_EDITOR = true;

    Config.load({
      // @ts-expect-error to find out what happens here
      urls: {
        editorIcons: "/"
      }
    });
  });

  const onClick = jest.fn();

  describe("Snapshots", () => {
    test("If not label or icon provided, do not render anything", () => {
      const button = render(<Button onClick={onClick} />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With icon", () => {
      const button = render(<Button onClick={onClick} icon={"nc-cog"} />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label", () => {
      const button = render(<Button onClick={onClick}>Test</Button>);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label add icon", () => {
      const button = render(
        <Button onClick={onClick} icon={"nc-cog"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label and icon and align Left", () => {
      const button = render(
        <Button onClick={onClick} icon={"nc-cog"} align={"left"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label and icon and align Right", () => {
      const button = render(
        <Button onClick={onClick} icon={"nc-cog"} align={"left"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("Reversed", () => {
      const button = render(
        <Button onClick={onClick} icon={"nc-cog"} reverse={true}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });
  });

  test("Test onClick", () => {
    const button = render(
      <Button onClick={onClick} icon={"nc-cog"}>
        Test
      </Button>
    );
    const input = button.container.firstElementChild;

    input && fireEvent.click(input);

    expect(onClick).toBeCalledTimes(1);
  });
});
