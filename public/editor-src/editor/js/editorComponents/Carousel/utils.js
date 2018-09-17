import { setIn } from "timm";

// Disabled Sortable for inactive SlideItem
export const setDataSortable = slider => {
  if (!slider) {
    return;
  }

  const slides = slider.querySelectorAll(".slick-slide");
  slides.forEach(node => {
    node.dataset.sortableDisabled = node.attributes["aria-hidden"].value;
  });
};

// Normalize Columns Width
export const normalizeCarouselColumns = columns => {
  return columns.map(column => setIn(column, ["value", "width"], 100));
};
