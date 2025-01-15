import React from "react";
import { fireEvent, renderWithProviders } from "test-utils";
import { Button } from "./Button";

describe("Test Button", () => {
  const onClick = jest.fn();

  describe("Snapshots", () => {
    test("If not label or icon provided, do not render anything", () => {
      const button = renderWithProviders(<Button onClick={onClick} />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With icon", () => {
      const button = renderWithProviders(
        <Button onClick={onClick} icon={"nc-cog"} />
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label", () => {
      const button = renderWithProviders(
        <Button onClick={onClick}>Test</Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label add icon", () => {
      const button = renderWithProviders(
        <Button onClick={onClick} icon={"nc-cog"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label and icon and align Left", () => {
      const button = renderWithProviders(
        <Button onClick={onClick} icon={"nc-cog"} align={"left"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label and icon and align Right", () => {
      const button = renderWithProviders(
        <Button onClick={onClick} icon={"nc-cog"} align={"left"}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("Reversed", () => {
      const button = renderWithProviders(
        <Button onClick={onClick} icon={"nc-cog"} reverse={true}>
          Test
        </Button>
      );

      expect(button.container.firstChild).toMatchSnapshot();
    });
  });

  test("Test onClick", () => {
    const button = renderWithProviders(
      <Button onClick={onClick} icon={"nc-cog"}>
        Test
      </Button>
    );
    const input = button.container.firstElementChild;

    input && fireEvent.click(input);

    expect(onClick).toBeCalledTimes(1);
  });
});
