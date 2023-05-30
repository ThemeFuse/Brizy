import { fireEvent, render, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { FontFamily } from "..";
import { fonts } from "../mock/fonts";
import { FontWithType } from "../types";

const MockComponent = () => {
  const [value, setValue] = useState("overpass");
  const addFont = () => undefined;

  const onChange = (value: FontWithType) => {
    setValue(value.id);
  };

  return (
    <FontFamily
      addFontLabel="Add New Font"
      addFont={addFont}
      onChange={onChange}
      value={value}
      fonts={fonts}
    />
  );
};

describe("Test FontFamily", () => {
  const addFont = jest.fn();
  const onChange = jest.fn();

  describe("Snapshots", () => {
    test("Render font list", async () => {
      const { container } = render(
        <FontFamily
          addFontLabel="Add New Font"
          addFont={addFont}
          onChange={onChange}
          value="overpass"
          fonts={fonts}
        />
      );
      const current = container.firstElementChild;

      await waitFor(() => {
        expect(current).toBeInTheDocument();
      });

      expect(current).toMatchSnapshot();
    });
    test("Render without addFontLabel prop", async () => {
      const { container } = render(
        <FontFamily
          addFont={addFont}
          onChange={onChange}
          value="overpass"
          fonts={fonts}
        />
      );
      const current = container.firstElementChild;

      await waitFor(() => {
        expect(current).toBeInTheDocument();
      });

      const typographyAdder = container.querySelector(
        ".brz-ed-font__typography-adder"
      );

      expect(typographyAdder).toBeInTheDocument();
      expect(current).toMatchSnapshot();
    });
  });

  test("Checking if active value has class", async () => {
    const { container } = render(<MockComponent />);

    const current = container.querySelector(".brz-ed-font__name");

    await waitFor(() => {
      expect(current).toBeInTheDocument();
    });

    if (current) {
      fireEvent.click(current, {
        value: "noto_serif"
      });
    }

    expect(current).not.toBeNull();
    expect(current).toHaveClass("active");
  });

  test("Checking addFont function", async () => {
    const { container } = render(
      <FontFamily
        addFont={addFont}
        onChange={onChange}
        value="overpass"
        fonts={fonts}
      />
    );
    const current = container.querySelector(".brz-ed-font__typography-adder");

    await waitFor(() => {
      expect(current).toBeInTheDocument();
    });

    current && fireEvent.click(current);

    expect(addFont).toHaveBeenCalledTimes(1);
  });
});
