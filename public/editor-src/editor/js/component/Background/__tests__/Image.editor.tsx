import { render } from "@testing-library/react";
import React, { type ReactElement, type RefObject } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { createStore } from "visual/redux/store";
import { config } from "../../../../../jest-utils/mocks";
import {
  type BackgroundEnv,
  installBackgroundEnv,
  restoreBackgroundEnv,
  setRect
} from "../__fixtures__/env";
import Image from "../types/Image";

// Characterization suite for the editor half of the parallax plugin. The editor drives it through
// `component/Background/types/Image.tsx`, with its own `bgClass` and its own wheel exceptions, so
// the export suite does not cover any of this.

const INIT_CLASS = "brz-bg-image-parallax--init";

let env: BackgroundEnv;

// `renderWithProviders` ships a store whose state is `{}`, and `deviceModeSelector` reads
// `state.ui`; the real store boots with `deviceMode: "desktop"`, which is what this component asks
// the store for on every render.
function renderImage(
  container: HTMLElement,
  props: { showParallax: boolean }
): {
  rerender: (next: { showParallax: boolean }) => void;
  unmount: () => void;
} {
  const store = createStore();

  const ui = ({ showParallax }: { showParallax: boolean }): ReactElement => (
    <Provider store={store}>
      <ConfigProvider config={config}>
        <Image showParallax={showParallax} renderContext="editor">
          {({ innerRef, attr }): ReactElement => (
            <div ref={innerRef as RefObject<HTMLDivElement>} {...attr} />
          )}
        </Image>
      </ConfigProvider>
    </Provider>
  );

  const result = render(ui(props), { container });

  return {
    rerender: (next): void => result.rerender(ui(next)),
    unmount: result.unmount
  };
}

function mountContainer(): HTMLElement {
  const bg = document.createElement("div");

  bg.className = "brz-bg";
  bg.style.height = "900px";
  document.body.append(bg);
  setRect(bg, { top: 500, height: 900 });

  return bg;
}

const image = (container: HTMLElement): HTMLElement => {
  const node = container.querySelector(".brz-bg-image");

  if (!(node instanceof HTMLElement)) {
    throw new Error("the parallax image was not rendered");
  }

  return node;
};

function wheel(target: HTMLElement, deltaY: number): WheelEvent {
  const event = new WheelEvent("wheel", {
    deltaY,
    deltaMode: 0,
    bubbles: true,
    cancelable: true
  });

  target.dispatchEvent(event);

  return event;
}

beforeEach(() => {
  env = installBackgroundEnv();
  env.setViewport({ clientHeight: 700, innerHeight: 700 });
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  document.body.innerHTML = "";
  restoreBackgroundEnv();
  jest.restoreAllMocks();
});

it("profiles the image on mount", () => {
  const container = mountContainer();

  renderImage(container, { showParallax: true });

  const node = image(container);

  expect(node.style.height).toBe("128.57142857142858vh");
  expect(node.style.transform).toBe("translate3d(0,100px,0)");
  expect(node.classList.contains(INIT_CLASS)).toBe(true);
});

it("tears the parallax down when the option is switched off", () => {
  const container = mountContainer();
  const { rerender } = renderImage(container, { showParallax: true });

  rerender({ showParallax: false });

  const node = image(container);

  expect(node.style.height).toBe("");
  expect(node.style.transform).toBe("");
  expect(node.classList.contains(INIT_CLASS)).toBe(false);
});

it.each([
  { case: "an ordinary target", className: "", prevented: true },
  {
    case: "an element the editor chrome owns",
    className: "brz-content-show",
    prevented: false
  },
  {
    case: "the container plus button",
    className: "brz-ed-container-plus",
    prevented: false
  }
])("hijacks the wheel over $case: $prevented", ({ className, prevented }) => {
  const container = mountContainer();

  renderImage(container, { showParallax: true });

  const target = document.createElement("div");

  target.className = className;
  container.append(target);

  expect(wheel(target, 100).defaultPrevented).toBe(prevented);
});

it("adds the WordPress media modal to the wheel exceptions", () => {
  Object.defineProperty(globalThis, "TARGET", {
    configurable: true,
    writable: true,
    value: "WP"
  });

  const container = mountContainer();

  renderImage(container, { showParallax: true });

  const target = document.createElement("div");

  target.className = "media-modal";
  container.append(target);

  const prevented = wheel(target, 100).defaultPrevented;

  Object.defineProperty(globalThis, "TARGET", {
    configurable: true,
    writable: true,
    value: "Jest"
  });

  expect(prevented).toBe(false);
});

it("cleans the image up when the component goes away", () => {
  const container = mountContainer();
  const { unmount } = renderImage(container, { showParallax: true });
  const node = image(container);

  unmount();

  expect(node.style.height).toBe("");
  expect(node.style.transform).toBe("");
});
