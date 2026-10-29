import { appendContent } from "../dom";
import type { DataItem } from "../types";
import { itemStore } from "../utils";
import { BaseSelection, type SelectionContainer } from "./base";

export class MultipleSelection extends BaseSelection {
  render(): HTMLElement {
    const selection = super.render();

    selection.classList.add("select2-selection--multiple");

    selection.innerHTML = '<ul class="select2-selection__rendered"></ul>';

    return selection;
  }

  bind(container: SelectionContainer): void {
    super.bind(container);

    this.hubs?.click.on(() => {
      this.trigger("toggle", undefined);
    });

    this.hubs?.click.delegate(
      ".select2-selection__choice__remove",
      (event, remove) => {
        if (this.isDisabled()) {
          return;
        }

        const choice = remove.parentElement;
        const data = choice ? itemStore.get(choice) : undefined;

        if (data !== undefined) {
          this.trigger("unselect", {
            originalEvent: event,
            data
          });
        }
      }
    );
  }

  clear(): void {
    const rendered = this.rendered();

    rendered?.replaceChildren();
    rendered?.removeAttribute("title");
  }

  selectionContainer(): HTMLElement {
    const container = document.createElement("li");

    container.className = "select2-selection__choice";
    container.innerHTML =
      '<span class="select2-selection__choice__remove" role="presentation">' +
      "&times;" +
      "</span>";

    return container;
  }

  update(data: DataItem[]): void {
    this.clear();

    if (data.length === 0) {
      return;
    }

    const selections = data.map((selection) => {
      const choice = this.selectionContainer();
      const formatted = this.display(selection);

      appendContent(choice, formatted);

      const title = selection.title || selection.text;

      if (title) {
        choice.setAttribute("title", title);
      }

      itemStore.set(choice, selection);

      return choice;
    });

    this.rendered()?.append(...selections);
  }

  protected rendered(): HTMLElement | undefined {
    return (
      this.selection.querySelector<HTMLElement>(
        ".select2-selection__rendered"
      ) ?? undefined
    );
  }
}
