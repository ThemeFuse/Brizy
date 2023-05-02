import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { Hex } from "../../types/Hex";
import { ColorPalette } from "../index";
import { PaletteObject } from "../types";

const mockPalette: PaletteObject<string>[] = [
  { id: "red", hex: "#FF0000" as Hex },
  { id: "green", hex: "#00FF00" as Hex },
  { id: "blue", hex: "#0000FF" as Hex }
];

const onChange = jest.fn();
const onOpenSettings = jest.fn();
describe("Test ColorPalette", () => {
  describe("snapshots", () => {
    test("Default usage", async () => {
      const palette = render(
        <ColorPalette
          palette={mockPalette}
          onChange={onChange}
          value={"red"}
          openSettings={onOpenSettings}
        />
      );

      await waitFor(() => {
        expect(palette.container.firstChild).toBeInTheDocument();
      });

      expect(palette.container.firstChild).toMatchSnapshot();
    });
  });

  test("Renders div with correct className", () => {
    const { container } = render(
      <ColorPalette onChange={onChange} value={"red"} palette={mockPalette} />
    );
    expect(container.firstChild).toHaveClass("brz-ed-control__color-palette");
  });

  test("Renders div with correct className and custom className", () => {
    const { container } = render(
      <ColorPalette
        className="custom-class"
        palette={mockPalette}
        onChange={onChange}
        value={"red"}
      />
    );
    expect(container.firstChild).toHaveClass("brz-ed-control__color-palette");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("Renders div with the correct number of color items", () => {
    const { container } = render(
      <ColorPalette palette={mockPalette} onChange={onChange} value={"red"} />
    );
    expect(
      container.querySelectorAll(".brz-ed-control__color-palette__item")
    ).toHaveLength(3);
  });

  test("Check onChange", () => {
    const { container } = render(
      <ColorPalette palette={mockPalette} value="red" onChange={onChange} />
    );

    const node = container.querySelectorAll(
      ".brz-ed-control__color-palette__item"
    )[1];

    fireEvent.click(node);
    expect(onChange).toHaveBeenCalledWith("green");
  });

  test("Render icon and call openSettings", async () => {
    const { container } = render(
      <ColorPalette
        palette={mockPalette}
        openSettings={onOpenSettings}
        value={""}
        onChange={onChange}
      />
    );

    const settingsIcon = container.querySelector(
      ".brz-ed-control__color-palette__icon"
    );

    await waitFor(() => {
      expect(settingsIcon).toBeInTheDocument();
    });

    settingsIcon && fireEvent.click(settingsIcon);
    expect(onOpenSettings).toHaveBeenCalled();
  });

  test("Do not render icon when no openSettings prop", async () => {
    const { container } = render(
      <ColorPalette palette={mockPalette} value={""} onChange={onChange} />
    );

    expect(
      container.querySelector(".brz-ed-control__color-palette__icon")
    ).toBeNull();
  });

  test("Render active className", () => {
    const { container } = render(
      <ColorPalette palette={mockPalette} value="green" onChange={onChange} />
    );
    expect(
      container.querySelectorAll(".brz-ed-control__color-palette__item")[1]
    ).toHaveClass("active");
  });
});
