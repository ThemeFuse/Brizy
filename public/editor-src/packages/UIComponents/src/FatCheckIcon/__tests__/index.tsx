import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { FatCheckIcon } from "../";
import { IconsName } from "../../EditorIcon/types";

describe("Test props", () => {
  test("Put label text on container element as title attribute", async () => {
    const { container } = render(
      <FatCheckIcon icon={IconsName.Settings} label="Test label" />
    );

    expect(container.firstChild).toMatchSnapshot();

    expect(container.firstElementChild?.getAttribute("title")).toBe(
      "Test label"
    );

    expect(
      container.querySelector(".brz-ed--fat-icon__wrapper--inactive")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".brz-ed--fat-icon__label--inactive")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".brz-ed--check-mark__unchecked")
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        container.querySelector(".brz-icon-svg__inactive")
      ).toBeInTheDocument()
    );
  });

  test("should have onClick", () => {
    const onClick = jest.fn();
    const { container } = render(
      <FatCheckIcon
        icon={IconsName.Settings}
        label="Test label"
        onClick={onClick}
      />
    );
    const div = container.querySelector(".brz-ed--fat-icon");

    div && fireEvent.click(div);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("should have onCheck", () => {
    const onCheck = jest.fn();
    const { container } = render(
      <FatCheckIcon
        icon={IconsName.Settings}
        label="Test label"
        onCheck={onCheck}
      />
    );

    const checkMark = container.querySelector(".brz-ed--check-mark");

    checkMark && fireEvent.click(checkMark);

    expect(onCheck).toHaveBeenCalledTimes(1);
  });

  test("should be isChecked true", () => {
    const { container } = render(
      <FatCheckIcon icon={IconsName.Settings} label="Test label" isChecked />
    );

    expect(container.firstChild).toMatchSnapshot();

    expect(
      container.querySelector(".brz-ed--check-mark__checked")
    ).toBeInTheDocument();
  });

  test("should be isActive true", async () => {
    const { container } = render(
      <FatCheckIcon icon={IconsName.Settings} label="Test label" isActive />
    );

    expect(container.firstChild).toMatchSnapshot();

    expect(
      container.querySelector(".brz-ed--fat-icon__wrapper--active")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".brz-ed--fat-icon__label--active")
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        container.querySelector(".brz-icon-svg__active")
      ).toBeInTheDocument()
    );
  });

  test("className should be className", () => {
    const { container } = render(
      <FatCheckIcon
        icon={IconsName.Settings}
        label="Test label"
        className="className"
      />
    );

    expect(container.firstChild).toMatchSnapshot();

    expect(container.querySelector(".brz-ed--fat-icon")).toHaveClass(
      "className"
    );
  });
});
