import { act, fireEvent, render, waitFor } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Tooltip } from "../index";
import { Placement, Props, Size } from "../types";
import {
  getOffsetPosition,
  getToolbar,
  placements,
  sizes
} from "../utils/testUtils";

describe("Test Tooltip", () => {
  jest.useFakeTimers();
  const popperUpdate = () =>
    act(async () => {
      await null;
    }); // Popper update() - https://github.com/popperjs/react-popper/issues/350

  const clickTooltip = async (container: HTMLElement) => {
    const valueEl = container.querySelector(".brz-ed-tooltip__content");
    valueEl && fireEvent.click(valueEl);

    await popperUpdate();
  };
  const hoverTooltip = (container: HTMLElement) => {
    const valueEl = container.querySelector(".brz-ed-tooltip__content");

    const mouseEnter = async () => {
      valueEl && fireEvent.mouseEnter(valueEl);

      await popperUpdate();
    };

    const mouseLeave = async () => {
      valueEl && fireEvent.mouseLeave(valueEl);

      await popperUpdate();
    };

    return { mouseLeave, mouseEnter };
  };
  describe("Snapshots Simple render", () => {
    test("Should have children and by default shouldn't have arrow and should open on hover", async () => {
      const { container } = render(
        <Tooltip placement="top">
          <p className="children">children</p>
        </Tooltip>
      );

      expect(container.querySelector(".brz-ed-tooltip")).not.toHaveClass(
        "brz-ed-tooltip--opened"
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip__content .children")
      ).toBeInTheDocument();
      expect(container.querySelector(".brz-ed-arrow")).not.toBeInTheDocument();
      expect(container.querySelector(".brz-ed-tooltip")).toHaveClass(
        "brz-ed-tooltip--opened"
      );
    });

    test("should open on hover and close without him", async () => {
      const { container } = render(<Tooltip placement="top">Children</Tooltip>);

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() =>
        expect(
          container.querySelector(".brz-ed-tooltip--opened")
        ).not.toBeInTheDocument()
      );
    });

    test("should call onOpen on mouseEnter and onClose on mouse leave", async () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { container } = render(
        <Tooltip onOpen={onOpen} onClose={onClose} placement="top">
          Children
        </Tooltip>
      );

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    test("onFirstClick should be called onOpen in second onClose", async () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { container } = render(
        <Tooltip onOpen={onOpen} onClose={onClose} placement="top" showOnClick>
          Children
        </Tooltip>
      );

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(onOpen).toHaveBeenCalledTimes(1);

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("when open on hover closeDelay should be 3000", async () => {
      const { container } = render(
        <Tooltip closeDelay={3000} placement="top">
          Children
        </Tooltip>
      );

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      jest.advanceTimersByTime(3000);

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).not.toBeInTheDocument();
    });

    test("overlayClassName should be overlayClassName", async () => {
      const { container } = render(
        <Tooltip overlayClassName="overlayClassName" placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-tooltip__overlay")).toHaveClass(
        "overlayClassName"
      );
    });

    test("overlay should be overlay", async () => {
      const { container } = render(
        <Tooltip overlay="overlay" placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      const div = container.querySelector(".brz-ed-tooltip__overlay");

      expect(container.firstChild).toMatchSnapshot();

      expect(div?.innerHTML).toContain("overlay");
    });

    test("title should be title", async () => {
      const { container, getByTitle } = render(
        <Tooltip title="title" placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(getByTitle("title")).toBeInTheDocument();
    });

    test("when is show Arrow should have children with className:brz-ed-arrow", async () => {
      const { container } = render(
        <Tooltip showArrow placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-arrow")).toBeInTheDocument();
    });

    test("if element is in clickOutsideException onClick him tooltip shouldn't close", async () => {
      const { container } = render(
        <div>
          <div className="click-outside__exception" />
          <div className="click-outside__not--exception" />
          <Tooltip
            clickOutsideExceptions={[".click-outside__exception"]}
            placement="top"
            showOnClick
          >
            Children
          </Tooltip>
        </div>
      );

      const exception = container.querySelector(".click-outside__exception");
      const notException = container.querySelector(
        ".click-outside__not--exception"
      );

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      exception && fireEvent.mouseDown(exception);

      await popperUpdate();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      notException && fireEvent.mouseDown(notException);

      await popperUpdate();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).not.toBeInTheDocument();
    });

    test("if is in portal should have brz-ed-tooltip__content-portal className", async () => {
      const { container } = render(
        <Tooltip isInPortal placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(
        portalNode.querySelector(".brz-ed-tooltip__content-portal")
      ).toBeInTheDocument();
    });

    test("if is in portal and portal node is provided should have brz-ed-tooltip__content-portal className as children of portalNode", async () => {
      const portalNode = document.createElement("div");
      document.body.appendChild(portalNode);
      const { container } = render(
        <Tooltip isInPortal portalNode={portalNode} placement="top">
          Children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(
        portalNode.querySelector(".brz-ed-tooltip__content-portal")
      ).toBeInTheDocument();
    });

    test.each<Size>(sizes)("Should have size:%s", async (size) => {
      const { container } = render(
        <Tooltip size={size} placement="top">
          children
        </Tooltip>
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(`.brz-ed-tooltip--${size}`)
      ).toBeInTheDocument();
    });

    test.each<Placement>(placements.filter((i) => !i.includes("auto")))(
      "Should have placement:%s",
      async (placement) => {
        const { container } = render(
          <Tooltip placement={placement} showArrow>
            children
          </Tooltip>
        );

        await hoverTooltip(container).mouseEnter();

        expect(container.firstChild).toMatchSnapshot();

        expect(
          container.querySelector(`.brz-ed-arrow--${placement}`)
        ).toBeInTheDocument();
      }
    );

    test.each<Placement>(placements.filter((i) => !i.includes("auto")))(
      "Should have offset:15px on opossite of %s",
      async (placement) => {
        const { container } = render(
          <Tooltip placement={placement} offset={15}>
            children
          </Tooltip>
        );

        await hoverTooltip(container).mouseEnter();

        expect(container.firstChild).toMatchSnapshot();

        expect(container.querySelector(`.brz-ed-tooltip__overlay`)).toHaveStyle(
          `${getOffsetPosition(placement)}:15px`
        );
      }
    );
  });
  describe("Snapshots render in Toolbar", () => {
    const component = ({ children, ...props }: PropsWithChildren<Props>) => (
      <Tooltip {...props} toolbar={getToolbar()}>
        {children ?? "children"}
      </Tooltip>
    );
    test("Should have children and by default shouldn't have arrow and should open on hover", async () => {
      const { container } = render(
        component({
          children: <p className="children">children</p>,
          placement: "top"
        })
      );

      expect(container.querySelector(".brz-ed-tooltip")).not.toHaveClass(
        "brz-ed-tooltip--opened"
      );

      await hoverTooltip(container).mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip__content .children")
      ).toBeInTheDocument();
      expect(container.querySelector(".brz-ed-arrow")).not.toBeInTheDocument();
      expect(container.querySelector(".brz-ed-tooltip")).toHaveClass(
        "brz-ed-tooltip--opened"
      );
    });

    test("if element is in clickOutsideException onClick him tooltip shouldn't close", async () => {
      const { container } = render(
        <div>
          <div className="click-outside__exception" />
          <div className="click-outside__not--exception" />
          {component({
            clickOutsideExceptions: [".click-outside__exception"],
            placement: "top",
            showOnClick: true
          })}
        </div>
      );

      const exception = container.querySelector(".click-outside__exception");
      const notException = container.querySelector(
        ".click-outside__not--exception"
      );

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      exception && fireEvent.mouseDown(exception);

      await popperUpdate();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      notException && fireEvent.mouseDown(notException);

      await popperUpdate();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).not.toBeInTheDocument();
    });

    test("if portal node is provided should have brz-ed-tooltip__content-portal className as children of portalNode", async () => {
      const portalNode = document.createElement("div");
      document.body.appendChild(portalNode);
      const { container } = render(component({ portalNode, placement: "top" }));

      await hoverTooltip(container).mouseEnter();

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(
        portalNode.querySelector(".brz-ed-tooltip__content-portal")
      ).toBeInTheDocument();
    });

    test("when open on hover closeDelay should be 3000", async () => {
      const { container } = render(
        component({ closeDelay: 3000, placement: "top" })
      );

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      jest.advanceTimersByTime(3000);

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).not.toBeInTheDocument();
    });

    test("should open on hover and close without him", async () => {
      const { container } = render(component({ placement: "top" }));

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip--opened")
      ).toBeInTheDocument();

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() =>
        expect(
          container.querySelector(".brz-ed-tooltip--opened")
        ).not.toBeInTheDocument()
      );
    });

    test("should call onOpen on mouseEnter and onClose on mouse leave", async () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { container } = render(
        component({ onOpen, onClose, placement: "top" })
      );

      const hover = hoverTooltip(container);

      await hover.mouseEnter();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));

      await hover.mouseLeave();

      expect(container.firstChild).toMatchSnapshot();

      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    test("onFirstClick should be called onOpen in second onClose", async () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { container } = render(
        component({ onOpen, onClose, placement: "top", showOnClick: true })
      );

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(onOpen).toHaveBeenCalledTimes(1);

      await clickTooltip(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("overlayClassName should be overlayClassName", async () => {
      const { container } = render(
        component({
          overlayClassName: "overlayClassName",
          placement: "top"
        })
      );

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(portalNode.querySelector(".brz-ed-tooltip__overlay")).toHaveClass(
        "overlayClassName"
      );
    });

    test("overlay should be overlay", async () => {
      const { container } = render(
        component({ overlay: "overlay", placement: "top" })
      );

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      const div = portalNode.querySelector(".brz-ed-tooltip__overlay");

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(div?.innerHTML).toContain("overlay");
    });

    test("title should be title", async () => {
      const { container, getByTitle } = render(
        component({ title: "title", placement: "top" })
      );

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(getByTitle("title")).toBeInTheDocument();
    });

    test("when is show Arrow should have children with className:brz-ed-arrow", async () => {
      const { container } = render(
        component({ placement: "top", showArrow: true })
      );

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(portalNode.querySelector(".brz-ed-arrow")).toBeInTheDocument();
    });

    test.each<Size>(sizes)("Should have size:%s", async (size) => {
      const { container } = render(component({ size, placement: "top" }));

      await hoverTooltip(container).mouseEnter();

      const portalNode = container.ownerDocument.body;

      expect(portalNode.firstChild).toMatchSnapshot();

      expect(
        portalNode.querySelector(`.brz-ed-tooltip--${size}`)
      ).toBeInTheDocument();
    });
  });
});
