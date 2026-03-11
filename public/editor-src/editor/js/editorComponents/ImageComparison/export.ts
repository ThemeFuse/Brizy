import { Num } from "@brizy/readers";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  // Find all image comparison slider wrappers
  const sliders = node.querySelectorAll<HTMLElement>(
    ".brz-image-comparison__slider-wrapper"
  );

  sliders.forEach((sliderWrapper) => {
    const rangeInput = sliderWrapper.querySelector<HTMLInputElement>(
      ".brz-image-comparison__range"
    );
    const overlayPicture = sliderWrapper.querySelector<HTMLElement>(
      ".brz-image-comparison__picture--overlay"
    );
    const sliderHandle = sliderWrapper.querySelector<HTMLElement>(
      ".brz-image-comparison__slider"
    );

    if (!rangeInput || !overlayPicture || !sliderHandle) {
      return;
    }

    const isVertical =
      sliderWrapper.classList.contains(
        "brz-image-comparison__slider-wrapper--vertical"
      ) ||
      rangeInput.classList.contains("brz-image-comparison__range--vertical");

    // Set slider state (active/inactive)
    const setSliderState = (e: Event) => {
      if (e.type === "input") {
        sliderHandle.classList.add("brz-image-comparison__slider--active");
        rangeInput.classList.add("brz-image-comparison__range--active");
        return;
      }
      sliderHandle.classList.remove("brz-image-comparison__slider--active");
      rangeInput.classList.remove("brz-image-comparison__range--active");
    };

    // Move slider range and update overlay
    const moveSliderRange = (e: Event) => {
      const value = Num.read((e.target as HTMLInputElement).value) ?? 0;

      if (isVertical) {
        // Clip from bottom: show top portion
        overlayPicture.style.clipPath = `inset(0 0 ${100 - value}% 0)`;
        sliderHandle.style.top = `${value}%`;
      } else {
        // Clip from right: show left portion
        overlayPicture.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
        sliderHandle.style.left = `${value}%`;
      }

      setSliderState(e);
    };

    // Initialize slider
    rangeInput.addEventListener("input", moveSliderRange);
    rangeInput.addEventListener("change", moveSliderRange);
    rangeInput.addEventListener("mouseup", setSliderState);

    // For non-touch devices, add mousedown for better interaction
    if (!("ontouchstart" in window)) {
      rangeInput.addEventListener("mousedown", () => {
        sliderHandle.classList.add("brz-image-comparison__slider--active");
        rangeInput.classList.add("brz-image-comparison__range--active");
      });
    }
  });
}
