import {
  cssPosition,
  offset,
  offsetParent,
  outerHeight,
  outerWidth,
  pageScrollTop,
  px,
  viewportHeight
} from "../dom";
import { hasScroll, scrollPositionStore } from "../utils";
import type { DropdownConstructor, DropdownContainer } from "./dropdown";

const parentsOf = (element: HTMLElement): HTMLElement[] => {
  const parents: HTMLElement[] = [];
  let parent = element.parentElement;

  while (parent) {
    parents.push(parent);
    parent = parent.parentElement;
  }

  return parents;
};

// Keeps the open dropdown in the dropdown parent, under or above the container.
export function withAttachBody(Base: DropdownConstructor): DropdownConstructor {
  return class extends Base {
    private dropdownParent: HTMLElement = this.options.dropdownParent;
    private dropdownContainer: HTMLElement = document.createElement("span");
    private container: HTMLElement = document.createElement("span");
    private resultHandlersBound = false;
    private watched = new Map<HTMLElement, VoidFunction[]>();
    private windowHandler: VoidFunction | undefined = undefined;

    bind(container: DropdownContainer): void {
      super.bind(container);

      container.on("open", () => {
        this.showDropdown();
        this.attachPositioningHandler();

        // Bound after the results handlers so the sizes are the final ones.
        this.bindContainerResultHandlers(container);
      });

      container.on("close", () => {
        this.hideDropdown();
        this.detachPositioningHandler();
      });

      this.dropdownContainer.addEventListener("mousedown", (event) => {
        event.stopPropagation();
      });
    }

    destroy(): void {
      super.destroy();

      this.dropdownContainer.remove();
    }

    position(dropdown: HTMLElement, container: HTMLElement): void {
      dropdown.setAttribute("class", container.getAttribute("class") ?? "");

      dropdown.classList.remove("select2");
      dropdown.classList.add("select2-container--open");

      dropdown.style.position = "absolute";
      dropdown.style.top = px(-999999);

      this.container = container;
    }

    render(): HTMLElement {
      const container = document.createElement("span");
      const dropdown = super.render();

      container.append(dropdown);

      this.dropdownContainer = container;

      return container;
    }

    private hideDropdown(): void {
      this.dropdownContainer.remove();
    }

    private bindContainerResultHandlers(container: DropdownContainer): void {
      if (this.resultHandlersBound) {
        return;
      }

      const place = (): void => {
        this.positionDropdown();
        this.resizeDropdown();
      };

      container.on("results:all", place);
      container.on("results:message", place);
      container.on("select", place);
      container.on("unselect", place);

      this.resultHandlersBound = true;
    }

    private attachPositioningHandler(): void {
      const watchers = parentsOf(this.container).filter(hasScroll);

      watchers.forEach((watcher) => {
        scrollPositionStore.set(watcher, { y: watcher.scrollTop });
      });

      watchers.forEach((watcher) => {
        const hold = (): void => {
          const held = scrollPositionStore.get(watcher);

          if (held !== undefined) {
            watcher.scrollTop = held.y;
          }
        };

        watcher.addEventListener("scroll", hold);
        this.watched.set(watcher, [...(this.watched.get(watcher) ?? []), hold]);
      });

      const place = (): void => {
        this.positionDropdown();
        this.resizeDropdown();
      };

      window.addEventListener("scroll", place);
      window.addEventListener("resize", place);
      window.addEventListener("orientationchange", place);

      this.windowHandler = place;
    }

    private detachPositioningHandler(): void {
      parentsOf(this.container)
        .filter(hasScroll)
        .forEach((watcher) => {
          this.watched
            .get(watcher)
            ?.forEach((hold) => watcher.removeEventListener("scroll", hold));
          this.watched.delete(watcher);
        });

      if (this.windowHandler !== undefined) {
        window.removeEventListener("scroll", this.windowHandler);
        window.removeEventListener("resize", this.windowHandler);
        window.removeEventListener("orientationchange", this.windowHandler);
        this.windowHandler = undefined;
      }
    }

    private positionDropdown(): void {
      const isCurrentlyAbove = this.dropdown.classList.contains(
        "select2-dropdown--above"
      );
      const isCurrentlyBelow = this.dropdown.classList.contains(
        "select2-dropdown--below"
      );

      let newDirection: "above" | "below" | undefined = undefined;

      const containerOffset = offset(this.container);
      const containerHeight = outerHeight(this.container);
      const containerBottom = containerOffset.top + containerHeight;
      const dropdownHeight = outerHeight(this.dropdown);

      const viewportTop = pageScrollTop();
      const viewportBottom = pageScrollTop() + viewportHeight();

      const enoughRoomAbove =
        viewportTop < containerOffset.top - dropdownHeight;
      const enoughRoomBelow = viewportBottom > containerBottom + dropdownHeight;

      let top = containerBottom;
      let left = containerOffset.left;

      // A parent that is not positioned leaves the offset to its offset parent.
      const anchor =
        cssPosition(this.dropdownParent) === "static"
          ? offsetParent(this.dropdownParent)
          : this.dropdownParent;

      const parentOffset =
        document.body.contains(anchor) || anchor.isConnected
          ? offset(anchor)
          : { top: 0, left: 0 };

      top -= parentOffset.top;
      left -= parentOffset.left;

      if (!isCurrentlyAbove && !isCurrentlyBelow) {
        newDirection = "below";
      }

      if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
        newDirection = "above";
      } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
        newDirection = "below";
      }

      if (
        newDirection === "above" ||
        (isCurrentlyAbove && newDirection !== "below")
      ) {
        top = containerOffset.top - parentOffset.top - dropdownHeight;
      }

      if (newDirection !== undefined) {
        this.dropdown.classList.remove(
          "select2-dropdown--below",
          "select2-dropdown--above"
        );
        this.dropdown.classList.add(`select2-dropdown--${newDirection}`);
        this.container.classList.remove(
          "select2-container--below",
          "select2-container--above"
        );
        this.container.classList.add(`select2-container--${newDirection}`);
      }

      this.dropdownContainer.style.left = px(left);
      this.dropdownContainer.style.top = px(top);
    }

    private resizeDropdown(): void {
      const width = px(outerWidth(this.container));

      if (this.options.get("dropdownAutoWidth")) {
        this.dropdown.style.width = "auto";
        this.dropdown.style.minWidth = width;
        this.dropdown.style.position = "relative";
      } else {
        this.dropdown.style.width = width;
      }
    }

    private showDropdown(): void {
      this.dropdownParent.append(this.dropdownContainer);

      this.positionDropdown();
      this.resizeDropdown();
    }
  };
}
