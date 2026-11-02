import { appendContent } from "../dom";
import type { DataItem } from "../types";
import { BaseSelection, type SelectionContainer } from "./base";

export class SingleSelection extends BaseSelection {
  render(): HTMLElement {
    const selection = super.render();

    selection.classList.add("select2-selection--single");

    selection.innerHTML =
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
      '<b role="presentation"></b>' +
      "</span>";

    return selection;
  }

  bind(container: SelectionContainer): void {
    super.bind(container);

    const id = `${container.id}-container`;
    const rendered = this.rendered();

    rendered?.setAttribute("id", id);
    rendered?.setAttribute("role", "textbox");
    rendered?.setAttribute("aria-readonly", "true");
    this.selection.setAttribute("aria-labelledby", id);

    this.selection.addEventListener("mousedown", (event) => {
      // Only the left button.
      if (event.which !== 1) {
        return;
      }

      this.trigger("toggle", undefined);
    });

    container.on("focus", () => {
      if (!container.isOpen()) {
        this.focusSelection();
      }
    });
  }

  clear(): void {
    const rendered = this.rendered();

    rendered?.replaceChildren();
    rendered?.removeAttribute("title");
  }

  update(data: DataItem[]): void {
    if (data.length === 0) {
      this.clear();
      return;
    }

    const selection = data[0];
    const rendered = this.rendered();

    if (!rendered) {
      return;
    }

    const formatted = this.display(selection);

    rendered.replaceChildren();
    appendContent(rendered, formatted);

    const title = selection.title || selection.text;

    if (title) {
      rendered.setAttribute("title", title);
    } else {
      rendered.removeAttribute("title");
    }
  }

  private rendered(): HTMLElement | undefined {
    return (
      this.selection.querySelector<HTMLElement>(
        ".select2-selection__rendered"
      ) ?? undefined
    );
  }
}
