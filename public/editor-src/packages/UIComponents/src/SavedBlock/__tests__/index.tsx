import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { IconsName } from "../../EditorIcon/types";
import { SavedBlock } from "../index";

describe("Test SavedBlock", () => {
  const onClick = jest.fn();

  describe("Snapshots", () => {
    test("Render loader", async () => {
      const savedBlock = render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading
          onClick={onClick}
          title="Save"
          tooltipContent="Saved"
        />
      );

      await waitFor(() => {
        expect(savedBlock.container.firstChild).toBeInTheDocument();
      });

      const loadingIcon = savedBlock.container.querySelector(
        ".brz-ed-animated--spin"
      );
      expect(loadingIcon).toBeInTheDocument();
      expect(savedBlock.container.firstChild).toMatchSnapshot();
    });

    test("Render Icon", async () => {
      const savedBlock = render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading={false}
          onClick={onClick}
          title="Save"
          tooltipContent="Saved"
        />
      );

      await waitFor(() => {
        expect(savedBlock.container.firstChild).toBeInTheDocument();
      });

      const icon = savedBlock.container.querySelector(
        ".brz-ed-animated--fadeIn"
      );
      expect(icon).toBeInTheDocument();
      expect(savedBlock.container.firstChild).toMatchSnapshot();
    });

    test("Check title prop", () => {
      render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading={false}
          onClick={onClick}
          title="Save"
          tooltipContent="Saved"
        />
      );
      const titleElement = screen.getByTitle("Save");
      expect(titleElement).toBeInTheDocument();
    });

    test("Check tooltip render", () => {
      const { container } = render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading={false}
          onClick={onClick}
          title="Save"
          tooltipContent="Saved"
        />
      );

      const tooltip = container.querySelector(".brz-ed-toolbar__item__tooltip");
      expect(tooltip).toBeInTheDocument();
    });

    test("If loading is true dont render tooltip", () => {
      const { container } = render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading
          onClick={onClick}
          title="Save"
          tooltipContent="Saved"
        />
      );

      const tooltip = container.querySelector(".brz-ed-toolbar__item__tooltip");
      expect(tooltip).not.toBeInTheDocument();
    });

    test("If no tooltip provided dont render tooltip", () => {
      const { container } = render(
        <SavedBlock
          icon={IconsName.Heart}
          isLoading={false}
          onClick={onClick}
          title="Save"
        />
      );

      const tooltip = container.querySelector(".brz-ed-toolbar__item__tooltip");
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  test("Check click event", () => {
    const { container } = render(
      <SavedBlock
        icon={IconsName.Heart}
        isLoading={false}
        onClick={onClick}
        title="Save"
        tooltipContent="Saved"
      />
    );
    const element = container.firstElementChild;

    element && fireEvent.click(element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
