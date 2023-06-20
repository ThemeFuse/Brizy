export const isJustified = (type: string): type is "justified" =>
  type === "justified";

export const removeUselessInfo = (node: HTMLElement) => {
  const clonedImgSources = node.querySelectorAll("picture > source");
  const img = node.querySelector("img");

  img?.removeAttribute("srcset");
  clonedImgSources.forEach((element) => {
    element.remove();
  });
};

export const arrangeGridByTags = (filter: string, items: HTMLElement[]) => {
  if (filter && filter !== "*") {
    items.forEach((item) => {
      item.style.display = "block";
    });

    items.forEach((item) => {
      if (!item.classList.contains(filter)) {
        item.style.display = "none";
      }
    });
  } else {
    items.forEach((item) => {
      item.style.display = "block";
    });
  }
};
