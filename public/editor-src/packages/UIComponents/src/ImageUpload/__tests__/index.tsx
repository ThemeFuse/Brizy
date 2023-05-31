import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { EditorIcon } from "../../EditorIcon";
import { IconsName } from "../../EditorIcon/types";
import { ImageUpload } from "../index";

describe("Test ImageUpload", () => {
  const onChange = jest.fn();
  const component = (
    <ImageUpload onChange={onChange}>
      <EditorIcon
        icon={IconsName.PlusCircle}
        className="brz-ed-control__gallery__item__icon"
      />
    </ImageUpload>
  );

  describe("Snapshots", () => {
    test("Image upload renders correctly", async () => {
      const { container } = render(component);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test("Check click event", async () => {
    const { container } = render(component);
    const element = container.firstElementChild;
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    element && fireEvent.click(element);

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
