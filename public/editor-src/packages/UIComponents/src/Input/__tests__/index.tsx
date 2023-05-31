import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { Input } from "../index";

const MockComponent = () => {
  const [value, setValue] = useState("value");
  return <Input value={value} onChange={setValue} placeholder="test" />;
};

describe("Test Input", () => {
  const onChange = jest.fn();
  describe("Snapshots", () => {
    test("Render default input", () => {
      const inputDev = render(<Input value={"dffd"} onChange={onChange} />);
      expect(inputDev.container.firstChild).toMatchSnapshot();
    });
    test("Render large input", () => {
      const inputDev = render(
        <Input size="large" value={"1111"} onChange={onChange} />
      );
      expect(inputDev.container.firstChild).toHaveClass(
        "brz-ed-control__input2 brz-ed-control__input2--large"
      );
      expect(inputDev.container.firstChild).toMatchSnapshot();
    });
    test("Render medium input", () => {
      const inputDev = render(
        <Input size="medium" value={""} onChange={onChange} />
      );
      expect(inputDev.container.firstChild).toHaveClass(
        "brz-ed-control__input2 brz-ed-control__input2--medium"
      );
      expect(inputDev.container.firstChild).toMatchSnapshot();
    });
    test("Render short input", () => {
      const inputDev = render(
        <Input size="short" value={"Short Input"} onChange={onChange} />
      );
      expect(inputDev.container.firstChild).toHaveClass(
        "brz-ed-control__input2 brz-ed-control__input2--short"
      );
      expect(inputDev.container.firstChild).toMatchSnapshot();
    });
    test("should render the placeholder text correctly", () => {
      render(<Input placeholder="Placeholder text" onChange={onChange} />);
      const input = screen.getByPlaceholderText("Placeholder text");
      expect(input).toBeInTheDocument();
    });
  });
  test("should be able to type name input field", () => {
    render(<MockComponent />);
    expect(screen.getByDisplayValue("value")).toBeInTheDocument();
    const current = screen.getByPlaceholderText("test") as HTMLTextAreaElement;
    fireEvent.change(current, { target: { value: "1111" } });
    expect(current.value).toBe("1111");
  });

  test("calls onBlur function", () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input value={""} onChange={onChange} placeholder={""} onBlur={onBlur} />
    );
    fireEvent.blur(getByPlaceholderText(""));
    expect(onBlur).toHaveBeenCalled();
  });
});
