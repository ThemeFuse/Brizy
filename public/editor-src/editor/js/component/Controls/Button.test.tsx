import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import Config from "visual/global/Config";

describe("Test Button", () => {
  beforeAll(() => {
    global.IS_EDITOR = true;

    Config.load({
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
      const button = render(<Button onClick={onClick} label={"Test"} />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label add icon", () => {
      const button = render(
        <Button onClick={onClick} label={"Test"} icon={"nc-cog"} />
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("Reversed", () => {
      const button = render(
        <Button
          onClick={onClick}
          label={"Test"}
          icon={"nc-cog"}
          reverse={true}
        />
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });
  });

  test("Test onClick", () => {
    const button = render(
      <Button onClick={onClick} icon={"nc-cog"} label={"Test"} />
    );
    const input = button.container.firstElementChild;

    input && fireEvent.click(input);

    expect(onClick).toBeCalledTimes(1);
  });
});
