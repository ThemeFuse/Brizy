import { fireEvent, render, screen } from "@testing-library/react";
import React, { ReactElement } from "react";
import { RadioGroup } from "..";
import { IconsName } from "../../EditorIcon/types";
import { Item } from "../Item/Item";

describe("RadioGroup", () => {
  const onChange = jest.fn();
  const mockChildren: ReactElement[] = [
    <Item
      icon={IconsName.MediaImage}
      isActive={true}
      value="value1"
      title="title1"
      key={1}
    />,
    <Item
      icon={IconsName.MediaImage}
      isActive={false}
      value="value2"
      title="title2"
      key={2}
    />
  ];
  describe("snapshots", () => {
    test("Default usage", () => {
      const group = render(
        <RadioGroup onChange={onChange}>{mockChildren}</RadioGroup>
      );
      expect(group.container.firstChild).toMatchSnapshot();
    });

    test("should render the children", () => {
      render(<RadioGroup onChange={onChange}>{mockChildren}</RadioGroup>);
      const firstChild = screen.getByTitle("title1");
      const secondChild = screen.getByTitle("title2");
      expect(firstChild).toBeInTheDocument();
      expect(secondChild).toBeInTheDocument();
    });

    test("should call onChange when an option is clicked", () => {
      render(<RadioGroup onChange={onChange}>{mockChildren}</RadioGroup>);
      const firstChild = screen.getByTitle("title1");
      const secondChild = screen.getByTitle("title2");
      fireEvent.click(firstChild);
      expect(onChange).toHaveBeenCalledWith("value1");

      fireEvent.click(secondChild);
      expect(onChange).toHaveBeenCalledWith("value2");
    });

    test("should add the active class when the active prop is set to true", () => {
      render(
        <RadioGroup onChange={onChange} value={"value1"}>
          {mockChildren}
        </RadioGroup>
      );
      const firstChild = screen.getByTitle("title1");
      const secondChild = screen.getByTitle("title2");

      expect(firstChild).toHaveClass(
        "brz-ed-control__radio-group2__item--active"
      );
      expect(secondChild).toHaveClass("brz-ed-control__radio-group2__item");
    });
  });
});
