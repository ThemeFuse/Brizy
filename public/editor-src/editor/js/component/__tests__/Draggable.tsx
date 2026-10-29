import { fireEvent, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { z } from "zod";
import Draggable from "../Draggable";

const query = (root: ParentNode, selector: string): HTMLElement =>
  z.instanceof(HTMLElement).parse(root.querySelector(selector));

interface Handlers {
  onDragStart: () => void;
  onDrag: (delta: { deltaX: number; deltaY: number }) => void;
  onDragEnd: () => void;
}

const page = (
  exceptions: string[] | undefined,
  handlers: Handlers
): ReactElement => (
  <div className="parent">
    <Draggable<HTMLDivElement>
      active={true}
      exceptions={exceptions}
      draggingCursor={undefined}
      onDragStart={handlers.onDragStart}
      onDrag={handlers.onDrag}
      onDragEnd={handlers.onDragEnd}
    >
      {(ref, className): ReactElement => (
        <div ref={ref} className={className}>
          <span className="handle" />
          <div className="skip">
            <span className="skip-child" />
          </div>
          <div className="group">
            <span className="marked" />
          </div>
        </div>
      )}
    </Draggable>
  </div>
);

const makeHandlers = (): jest.Mocked<Handlers> => ({
  onDragStart: jest.fn(),
  onDrag: jest.fn(),
  onDragEnd: jest.fn()
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  fireEvent.mouseUp(window);
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe("Draggable", () => {
  it.each<{
    case: string;
    exceptions: string[] | undefined;
    target: string;
    button: number;
    out: { started: boolean; propagated: boolean };
  }>([
    {
      case: "a plain node with no exceptions",
      exceptions: undefined,
      target: ".handle",
      button: 0,
      out: { started: true, propagated: false }
    },
    {
      case: "a plain node with an empty exception list",
      exceptions: [],
      target: ".handle",
      button: 0,
      out: { started: true, propagated: false }
    },
    {
      case: "a node no exception matches",
      exceptions: [".skip"],
      target: ".handle",
      button: 0,
      out: { started: true, propagated: false }
    },
    {
      case: "a node matched by an exception",
      exceptions: [".skip"],
      target: ".skip",
      button: 0,
      out: { started: false, propagated: true }
    },
    {
      case: "a descendant of an exception",
      exceptions: [".skip"],
      target: ".skip-child",
      button: 0,
      out: { started: false, propagated: true }
    },
    {
      case: "a node matched by the second exception",
      exceptions: [".missing", ".skip"],
      target: ".skip-child",
      button: 0,
      out: { started: false, propagated: true }
    },
    {
      case: "a node matched by a descendant selector",
      exceptions: [".group .marked"],
      target: ".marked",
      button: 0,
      out: { started: false, propagated: true }
    },
    {
      case: "the parent named in a descendant selector",
      exceptions: [".group .marked"],
      target: ".group",
      button: 0,
      out: { started: true, propagated: false }
    },
    {
      case: "a plain node with the right button",
      exceptions: [".skip"],
      target: ".handle",
      button: 2,
      out: { started: false, propagated: false }
    }
  ])("mousedown on $case", ({ exceptions, target, button, out }) => {
    const handlers = makeHandlers();
    const { container } = render(page(exceptions, handlers));
    const onParentMouseDown = jest.fn();

    query(container, ".parent").addEventListener(
      "mousedown",
      onParentMouseDown
    );
    fireEvent.mouseDown(query(container, target), { button });
    fireEvent.mouseMove(window, { clientX: 10, clientY: 20 });

    expect({
      started: handlers.onDragStart.mock.calls.length === 1,
      propagated: onParentMouseDown.mock.calls.length === 1
    }).toEqual(out);
  });

  it("reports the drag distance and the end of the drag", () => {
    const handlers = makeHandlers();
    const { container } = render(page([".skip"], handlers));

    fireEvent.mouseDown(query(container, ".handle"), { button: 0 });
    fireEvent.mouseMove(window, { clientX: 10, clientY: 20 });
    fireEvent.mouseMove(window, { clientX: 15, clientY: 28 });
    jest.advanceTimersByTime(16);
    fireEvent.mouseUp(window);

    expect(handlers.onDrag.mock.calls).toEqual([[{ deltaX: 5, deltaY: 8 }]]);
    expect(handlers.onDragEnd).toHaveBeenCalledTimes(1);
  });
});
