import { onBodyClick } from "visual/utils/export/delegate";

function openSidebar(cart) {
  cart
    .closest(".brz-woocart__wrapper")
    ?.classList.add("brz-woocart__wrapper--opened");
  document.body.classList.add("brz-ow-hidden", "brz-woocart--opened");
}

function closeSidebar(close) {
  close
    .closest(".brz-woocart__wrapper")
    ?.classList.remove("brz-woocart__wrapper--opened");
  document.body.classList.remove("brz-ow-hidden", "brz-woocart--opened");
}

export default function (node) {
  const wrappers = new Set(node.querySelectorAll(".brz-woocart__wrapper"));
  const isOwn = (element) =>
    wrappers.has(element.closest(".brz-woocart__wrapper"));

  onBodyClick([
    {
      selector: ".brz-woocart",
      handler: (cart) => {
        if (isOwn(cart)) {
          openSidebar(cart);
        }
      }
    },
    {
      selector: ".brz-woocart__sidebar-close, .brz-woocart__background",
      handler: (close) => {
        if (isOwn(close)) {
          closeSidebar(close);
        }
      }
    }
  ]);
}
