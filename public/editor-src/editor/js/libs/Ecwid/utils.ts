import { EcwidCartCheckoutStep } from "../../editorComponents/Ecwid/EcwidCart/types/Value";
import { EcwidWidget } from "./types/EcwidWidget";

export function convertEcwidWidget(widget: EcwidWidget): {
  widgetType: "ProductBrowser";
  id: string;
  arg: string[];
} {
  switch (widget.type) {
    case "account":
    case "account/favorites":
    case EcwidCartCheckoutStep.Cart:
    case EcwidCartCheckoutStep.Address:
    case EcwidCartCheckoutStep.Shipping:
    case EcwidCartCheckoutStep.Payment:
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`]
      };
    case "product":
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`, `productId=${widget.args.id}`]
      };
    case "CATEGORY":
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`, `categoryId=${widget.args.categoryId}`]
      };
  }
}

export const replaceFooterLink = (
  node: HTMLElement,
  selector: string,
  url: string
): void => {
  const link = node.querySelector(selector);

  if (link && link.parentNode) {
    const linkParent = link.parentNode;

    const clonedParent = linkParent.cloneNode(true) as HTMLElement;

    if (linkParent.parentNode) {
      linkParent.parentNode.replaceChild(clonedParent, linkParent);
    }

    if (clonedParent) {
      const newLink = clonedParent.querySelector<HTMLLinkElement>(selector);

      if (newLink) {
        newLink.href = url;
      }
    }
  }
};

export const replaceContentLink = (
  node: HTMLElement,
  selector: string,
  url: string
): void => {
  const current = node.querySelector(selector);

  if (current && current.parentNode) {
    const clone = current.cloneNode(true);

    current.parentNode.replaceChild(clone, current);

    const button = node.querySelector(`${selector} >  button`);

    if (button) {
      button.addEventListener("click", (e) => {
        window.location.replace(url);
        e.stopPropagation();
      });
    }
  }
};

export const addListenerToPlaceOrder = () => {
  const placeOrderButton = document.querySelector(
    ".ec-cart__step.ec-cart-step.ec-cart-step--payment .ec-cart-step__body .ec-form .ec-form__row--continue"
  );

  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", () => {
      window.location.href = "/thank-you";
    });
  }
};
