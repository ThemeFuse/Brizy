import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { CheckMark } from "../CheckMark";

describe("Test props", () => {
  test("if is checked should have className brz-ed--check-mark__checked", () => {
    const { container } = render(<CheckMark isChecked />);

    expect(container.firstChild).toMatchSnapshot();

    expect(
      container.querySelector(".brz-ed--check-mark__checked")
    ).toBeInTheDocument();
  });

  test("if isn't checked should have className brz-ed--check-mark__unchecked", () => {
    const { container } = render(<CheckMark isChecked={false} />);

    expect(container.firstChild).toMatchSnapshot();

    expect(
      container.querySelector(".brz-ed--check-mark__unchecked")
    ).toBeInTheDocument();
  });

  test("className should be className", () => {
    const { container } = render(<CheckMark isChecked className="className" />);

    expect(container.firstChild).toMatchSnapshot();

    expect(container.querySelector(".brz-ed--check-mark")).toHaveClass(
      "className"
    );
  });

  test("should have onClick", function () {
    const onClick = jest.fn();
    const { container } = render(<CheckMark isChecked onClick={onClick} />);
    const span = container.querySelector(".brz-ed--check-mark");

    span && fireEvent.click(span);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
