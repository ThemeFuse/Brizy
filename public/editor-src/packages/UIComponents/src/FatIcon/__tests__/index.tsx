import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import _ from "underscore";
import { IconsName } from "../../EditorIcon/types";
import { FatIcon } from "../index";

describe("Test FatIcon", () => {
  const onClick = jest.fn();
  const iconName = IconsName["t2-event-calendar"];

  describe("Snapshots", () => {
    test("FatIcon snapshot", () => {
      const icon = render(
        <FatIcon onClick={onClick} icon={iconName} label={"Label"} />
      );

      expect(icon.container.firstChild).toMatchSnapshot();
    });

    test("FatIcon active", async () => {
      const { container } = render(
        <FatIcon onClick={onClick} icon={iconName} label={"Label"} isActive />
      );

      await waitFor(() => {
        const fatIcon = container.getElementsByClassName("brz-ed--fat-icon")[0];
        const wrapper = container.getElementsByClassName(
          "brz-ed--fat-icon__wrapper"
        )[0];
        const icon = container.getElementsByClassName(
          "brz-ed--fat-icon-icon"
        )[0];
        const label = container.getElementsByClassName(
          "brz-ed--fat-icon__label"
        )[0];

        expect(fatIcon).toHaveClass("brz-ed--fat-icon__active");
        expect(wrapper).toHaveClass("brz-ed--fat-icon__wrapper--active");
        expect(icon).toHaveClass("brz-ed--fat-icon-icon--active");
        expect(label).toHaveClass("brz-ed--fat-icon__label--active");

        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  test("Check click event", () => {
    const { container } = render(
      <FatIcon onClick={onClick} icon={iconName} label={"Label"} />
    );
    const nodes = container.querySelectorAll("div");
    const icon = nodes[nodes.length - 1];

    icon && fireEvent.click(icon);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("renders the label prop correctly", () => {
    const label = "Test Label";
    const { getByText } = render(
      <FatIcon
        isActive={false}
        className="test-class"
        icon={iconName}
        label={label}
        onClick={_.noop}
      />
    );
    expect(getByText(label)).toBeInTheDocument();
  });
});
