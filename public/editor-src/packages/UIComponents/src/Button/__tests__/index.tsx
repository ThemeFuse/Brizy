import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { IconsName } from "../../EditorIcon/types";
import { Button } from "../index";

describe("Test Button", () => {
  const onClick = jest.fn();

  describe("Snapshots", () => {
    test("If no label or icon provided, do not render anything", () => {
      const button = render(<Button onClick={onClick} />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With icon", async () => {
      const button = render(
        <Button onClick={onClick} icon={IconsName.Duplicate} />
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label", () => {
      const button = render(<Button onClick={onClick}>Test</Button>);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label and an icon", async () => {
      const button = render(
        <Button onClick={onClick} icon={IconsName.Duplicate}>
          Test
        </Button>
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label, icon and left aligment", async () => {
      const button = render(
        <Button onClick={onClick} icon={IconsName.Duplicate} align="left">
          Test
        </Button>
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With label, icon and right aligment", async () => {
      const button = render(
        <Button onClick={onClick} icon={IconsName.Duplicate} align="left">
          Test
        </Button>
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With Reverse", async () => {
      const button = render(
        <Button onClick={onClick} icon={IconsName.Duplicate} reverse>
          Test
        </Button>
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("With Reverse Theme", async () => {
      const button = render(
        <Button
          onClick={onClick}
          icon={IconsName.Duplicate}
          reverse
          reverseTheme
        >
          Test
        </Button>
      );

      await waitFor(() => {
        expect(button.container.firstChild).toBeInTheDocument();
      });

      expect(button.container.firstChild).toMatchSnapshot();
    });
  });

  test("Check click event", async () => {
    const { container } = render(
      <Button onClick={onClick} icon={IconsName.Duplicate}>
        Test
      </Button>
    );

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    const nodes = container.querySelectorAll("div");
    const buttonTag = nodes[nodes.length - 1];

    buttonTag && fireEvent.click(buttonTag);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
