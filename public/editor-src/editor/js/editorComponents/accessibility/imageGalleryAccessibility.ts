export interface ImageGalleryFilterAccessibilityOptions {
  filterWrapper: HTMLElement;
}

export interface ImageGalleryBigImageAccessibilityOptions {
  bigImageWrapper: HTMLElement;
  bigImage: HTMLImageElement;
  thumbnails: HTMLElement[];
  onBigImageActivate?: () => void;
  isLightbox?: boolean;
}

export const initImageGalleryFilterAccessibility = ({
  filterWrapper
}: ImageGalleryFilterAccessibilityOptions): void => {
  const list = filterWrapper.querySelector<HTMLElement>(
    "ul.brz-image__gallery-filter"
  );

  if (!list) {
    return;
  }

  list.setAttribute("role", "tablist");

  const items = Array.from(
    list.querySelectorAll<HTMLElement>(".brz-image__gallery-filter__item")
  );

  const updateState = (): void => {
    items.forEach((item) => {
      const isActive = item.classList.contains(
        "brz-image__gallery-filter__item--active"
      );

      item.setAttribute("role", "tab");
      item.setAttribute("tabindex", isActive ? "0" : "-1");
      item.setAttribute("aria-selected", String(isActive));
    });
  };

  const focusSibling = (current: HTMLElement, direction: 1 | -1): void => {
    const index = items.indexOf(current);

    if (index === -1) {
      return;
    }

    const nextIndex = (index + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  items.forEach((item) => {
    item.addEventListener("keydown", (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
        case " ":
        case "Spacebar":
          event.preventDefault();
          item.click();
          updateState();
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusSibling(item, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusSibling(item, -1);
          break;
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
      }
    });
  });

  updateState();
};

export const initImageGalleryBigImageAccessibility = ({
  bigImageWrapper,
  bigImage,
  thumbnails,
  onBigImageActivate,
  isLightbox
}: ImageGalleryBigImageAccessibilityOptions): void => {
  if (isLightbox) {
    bigImageWrapper.setAttribute("aria-haspopup", "dialog");
    bigImageWrapper.setAttribute("role", "button");
    bigImageWrapper.setAttribute("tabindex", "0");
  } else {
    bigImageWrapper.removeAttribute("aria-haspopup");
  }

  thumbnails.forEach((item) => {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
  });

  if (onBigImageActivate) {
    bigImageWrapper.addEventListener("keydown", (event: KeyboardEvent) => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "Spacebar"
      ) {
        event.preventDefault();
        onBigImageActivate();
      }
    });
  }

  const handleThumbnailKeyDown = (event: KeyboardEvent, item: HTMLElement) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      item.click();
    }
  };

  thumbnails.forEach((item) => {
    item.addEventListener("keydown", (event: KeyboardEvent) =>
      handleThumbnailKeyDown(event, item)
    );
  });

  bigImage.setAttribute("role", "img");
};
