import { ExportFunction } from "visual/types";
import { Action } from "./types";

const inputValue = (prev: number, action: Action): string => {
  switch (action) {
    case Action.Increment:
      return String(prev + 1);
    case Action.Decrement:
      return prev <= 0 ? "0" : String(prev - 1);
  }
};

export const fn: ExportFunction = ($node) => {
  const node = $node.get(0);

  if (!node) return;

  node
    .querySelectorAll<HTMLElement>(".brz-shopify-quantity-container")
    .forEach((item) => {
      const incrementButton = item.querySelector(
        ".brz-shopify-quantity-style2 .brz-button-increment"
      );

      const input = item.querySelector<HTMLInputElement>("input[type=number]");

      const decrementButton = item.querySelector(
        ".brz-shopify-quantity-style2 .brz-button-decrement"
      );

      if (incrementButton && input && decrementButton) {
        incrementButton?.addEventListener("click", () => {
          input.value = inputValue(Number(input.value), Action.Increment);
        });

        decrementButton?.addEventListener("click", () => {
          input.value = inputValue(Number(input.value), Action.Decrement);
        });
      }
    });
};
