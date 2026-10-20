import { fireEvent, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { z } from "zod";
import ClickOutside from "../ClickOutside";

type Exception = string | ((el: HTMLElement) => boolean);

const query = (root: ParentNode, selector: string): HTMLElement =>
  z.instanceof(HTMLElement).parse(root.querySelector(selector));

const page = (
  exceptions: Exception[],
  onClickOutside: (e: MouseEvent) => void
): ReactElement => (
  <div>
    <ClickOutside exceptions={exceptions} onClickOutside={onClickOutside}>
      {({ ref }): ReactElement => (
        <div ref={ref} className="inside">
          <span className="inside-child" />
        </div>
      )}
    </ClickOutside>
    <div className="outside" />
    <div className="exception">
      <span className="exception-child" />
    </div>
    <div className="group">
      <span className="marked" />
    </div>
  </div>
);

describe("ClickOutside", () => {
  it.each<{
    case: string;
    exceptions: Exception[];
    target: string;
    out: boolean;
  }>([
    {
      case: "the wrapped node",
      exceptions: [],
      target: ".inside",
      out: false
    },
    {
      case: "a child of the wrapped node",
      exceptions: [],
      target: ".inside-child",
      out: false
    },
    {
      case: "a node outside",
      exceptions: [],
      target: ".outside",
      out: true
    },
    {
      case: "a node matched by a string exception",
      exceptions: [".exception"],
      target: ".exception",
      out: false
    },
    {
      case: "a descendant of a string exception",
      exceptions: [".exception"],
      target: ".exception-child",
      out: false
    },
    {
      case: "a node no string exception matches",
      exceptions: [".exception"],
      target: ".outside",
      out: true
    },
    {
      case: "a node matched by the second string exception",
      exceptions: [".missing", ".exception"],
      target: ".exception-child",
      out: false
    },
    {
      case: "a node matched by a descendant selector",
      exceptions: [".group .marked"],
      target: ".marked",
      out: false
    },
    {
      case: "the parent named in a descendant selector",
      exceptions: [".group .marked"],
      target: ".group",
      out: true
    },
    {
      case: "a node a function exception accepts",
      exceptions: [(el): boolean => el.classList.contains("outside")],
      target: ".outside",
      out: false
    },
    {
      case: "a node a function exception rejects",
      exceptions: [(el): boolean => el.classList.contains("exception")],
      target: ".outside",
      out: true
    },
    {
      case: "a node the function rejects and the string matches",
      exceptions: [(): boolean => false, ".exception"],
      target: ".exception-child",
      out: false
    },
    {
      case: "a node the function accepts and the string misses",
      exceptions: [(): boolean => true, ".missing"],
      target: ".outside",
      out: false
    }
  ])(
    "mousedown on $case reports outside: $out",
    ({ exceptions, target, out }) => {
      const onClickOutside = jest.fn();
      const { container } = render(page(exceptions, onClickOutside));

      fireEvent.mouseDown(query(container, target));

      expect(onClickOutside).toHaveBeenCalledTimes(out ? 1 : 0);
    }
  );

  it("decides for every mounted instance", () => {
    const first = jest.fn();
    const second = jest.fn();
    const { container } = render(
      <div>
        <ClickOutside exceptions={[]} onClickOutside={first}>
          {({ ref }): ReactElement => <div ref={ref} className="first" />}
        </ClickOutside>
        <ClickOutside exceptions={[".first"]} onClickOutside={second}>
          {({ ref }): ReactElement => <div ref={ref} className="second" />}
        </ClickOutside>
        <div className="outside" />
      </div>
    );

    fireEvent.mouseDown(query(container, ".first"));
    fireEvent.mouseDown(query(container, ".second"));
    fireEvent.mouseDown(query(container, ".outside"));

    expect([first.mock.calls.length, second.mock.calls.length]).toEqual([2, 1]);
  });

  it("stops listening once unmounted", () => {
    const onClickOutside = jest.fn();
    const { container, unmount } = render(page([], onClickOutside));
    const outside = document.createElement("div");

    document.body.append(outside);
    unmount();
    fireEvent.mouseDown(outside);
    outside.remove();

    expect(container.childElementCount).toBe(0);
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
