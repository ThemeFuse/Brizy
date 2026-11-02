import { makeAttr } from "visual/utils/i18n/attribute";

const clickOutsideAttr = makeAttr("click_outside_to_close");
const oldClickOutsideAttr = "data-click_outside_to_close";

export interface Popup {
  show: VoidFunction;
  close: VoidFunction;
}

// a set like `$.fn.popup`: classes on every node, attributes and events from the first
export function popup(nodes: HTMLElement[]): Popup {
  const first: HTMLElement | undefined = nodes[0];
  const html = document.documentElement;

  const attr = (name: string): string | undefined =>
    first?.getAttribute(name) ?? undefined;

  const find = (selector: string): HTMLElement[] =>
    nodes.flatMap((node) =>
      Array.from(node.querySelectorAll<HTMLElement>(`:scope ${selector}`))
    );

  return {
    show() {
      const scrollPage = attr(makeAttr("scroll_page"));
      const showAfter = attr(makeAttr("show-close-button-after"));
      const clickedOutSideToClose =
        attr(clickOutsideAttr) ?? attr(oldClickOutsideAttr);

      if (!clickedOutSideToClose) {
        nodes.forEach((node) => {
          node.classList.add("brz-pointer-events-none");
        });
        find(".brz-popup2__inner > .brz-container__wrap").forEach((node) => {
          node.classList.add("brz-pointer-events-auto");
        });
      }

      if (showAfter) {
        setTimeout(() => {
          find(".brz-popup2__close").forEach((node) => {
            node.classList.remove("brz-hidden");
          });
        }, Number(showAfter) * 1000);
      }

      nodes.forEach((node) => {
        node.classList.add("brz-popup2--opened");
      });

      if (!scrollPage) {
        html.classList.add("brz-ow-hidden");
      } else {
        html.classList.remove("brz-ow-hidden");
      }

      nodes.forEach((node) => {
        node.classList.add("brz-popup2--was-shown");
      });
      window.Brz.emit("brz.popup.show", first);
      window.Brz.emit("elements.popup.open", first);
    },
    close() {
      nodes.forEach((node) => {
        node.classList.remove("brz-popup2--opened");
      });
      html.classList.remove("brz-ow-hidden");

      // trigger an event so that other components could listen
      window.Brz.emit("brz.popup.close", first);
      window.Brz.emit("elements.popup.close", first);
    }
  };
}
