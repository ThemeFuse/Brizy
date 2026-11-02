// The ARIA layer of a slider: region, arrows, dots, pause control and the focus of hidden slides.

import type { SliderAccessibilityOptions, SliderHandle } from "./types";

export class SliderAccessibility {
  private readonly slider: HTMLElement;
  private readonly handle: SliderHandle;
  private readonly options: SliderAccessibilityOptions;

  constructor(slider: HTMLElement, handle: SliderHandle, options: SliderAccessibilityOptions) {
    this.slider = slider;
    this.handle = handle;
    this.options = options;
  }

  init(): void {
    this.setupRegionAccessibility();
    this.setupArrowAccessibility();
    this.setupDotsAccessibility();
    this.setupPauseControlAccessibility();
    this.sync();

    this.handle.on("afterChange", () => this.sync());
    this.handle.on("setPosition", () => this.sync());
  }

  private sync(): void {
    if (this.options.focusableArrows) {
      this.syncArrows();
    }

    this.syncSlides();
    this.syncDots();
    this.syncPauseControl();
  }

  /** Where the arrows, dots and pause control are looked up. */
  private get controls(): ParentNode | undefined {
    return this.options.controls === "parent"
      ? (this.slider.parentElement ?? undefined)
      : this.slider;
  }

  private slideId(index: number): string {
    return `${this.options.slideIdPrefix}-${index}`;
  }

  private setupRegionAccessibility(): void {
    this.slider.setAttribute("id", this.options.regionId);
    this.slider.setAttribute("role", "region");
    this.slider.setAttribute("aria-roledescription", "carousel");
    this.slider.setAttribute("aria-label", this.options.regionLabel);
  }

  private setupArrowAccessibility(): void {
    const arrows = [
      {
        element: this.findFirst(this.controls, ".brz-slick-slider__arrow-prev"),
        label: "Previous slide"
      },
      {
        element: this.findFirst(this.controls, ".brz-slick-slider__arrow-next"),
        label: "Next slide"
      }
    ];

    const handleArrowKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          this.handle.prev();
          break;
        case "ArrowRight":
          event.preventDefault();
          this.handle.next();
          break;
      }
    };

    arrows.forEach(({ element, label }) => {
      if (!element) {
        return;
      }

      element.setAttribute("type", "button");
      element.setAttribute("aria-label", label);
      element.setAttribute("aria-controls", this.options.regionId);

      if (this.options.focusableArrows) {
        // A disabled arrow gets tabindex="-1" from the slider; it stays reachable by Tab.
        element.setAttribute("tabindex", "0");
      }

      element.addEventListener("keydown", handleArrowKeyDown);
    });
  }

  private syncArrows(): void {
    const arrows = this.getArrowButtons();

    arrows.forEach((arrow) => {
      arrow.setAttribute("tabindex", "0");

      const isDisabled = arrow.classList.contains("slick-disabled");
      arrow.setAttribute("aria-disabled", isDisabled.toString());
    });
  }

  private setupDotsAccessibility(): void {
    const dots = this.getDotsList();

    if (!dots) {
      return;
    }

    dots.setAttribute("aria-label", "Slide navigation");

    this.getDotButtons().forEach((button, index) => {
      button.setAttribute("type", "button");
      button.setAttribute("aria-label", `Go to slide ${index + 1}`);
      button.setAttribute("aria-controls", this.slideId(index));
    });
  }

  private setupPauseControlAccessibility(): void {
    const pauseItem = this.getPauseItem();

    if (!pauseItem) {
      return;
    }

    const pauseButton = this.ensurePauseButton(pauseItem);
    pauseButton.setAttribute("type", "button");
    pauseButton.setAttribute("aria-controls", this.options.regionId);
  }

  private syncSlides(): void {
    const slides = this.getSlides();

    slides.forEach((slide, index) => {
      const isActive = slide.classList.contains("slick-active");

      slide.setAttribute("id", this.slideId(index));
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `Slide ${index + 1} of ${slides.length}`);
      slide.setAttribute("aria-hidden", (!isActive).toString());

      this.syncSlideFocusableElements(slide, isActive);
    });

    const clonedSlides = this.getClonedSlides();

    clonedSlides.forEach((slide) => {
      const isActive = slide.classList.contains("slick-active");

      this.syncSlideFocusableElements(slide, isActive);
    });
  }

  private syncDots(): void {
    const dots = this.getDotsListItems();

    dots.forEach((dot, index) => {
      const button = dot.querySelector<HTMLButtonElement>("button");

      if (!button) {
        return;
      }

      const isCurrent = dot.classList.contains("slick-active");
      if (isCurrent) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
      button.setAttribute(
        "aria-label",
        `${isCurrent ? "Current slide, " : ""}Go to slide ${index + 1}`
      );
    });
  }

  private syncPauseControl(): void {
    const pauseButton = this.getPauseButton();

    if (!pauseButton) {
      return;
    }

    const isPaused = this.slider.getAttribute("data-slider-paused") === "true";

    pauseButton.setAttribute("aria-label", isPaused ? "Play autoplay" : "Pause autoplay");
    pauseButton.setAttribute("aria-pressed", isPaused.toString());
  }

  private ensurePauseButton(pauseItem: HTMLElement): HTMLButtonElement {
    const existingButton = pauseItem.querySelector<HTMLButtonElement>(
      ".brz-slick-slider__pause-button"
    );

    if (existingButton) {
      return existingButton;
    }

    const button = document.createElement("button");
    const pauseIcon = pauseItem.querySelector<HTMLElement>(".button-pause");
    const playIcon = pauseItem.querySelector<HTMLElement>(".button-play");

    button.type = "button";
    button.className = "brz-slick-slider__pause-button";

    if (pauseIcon) {
      button.appendChild(pauseIcon);
    }

    if (playIcon) {
      button.appendChild(playIcon);
    }

    button.addEventListener("click", (event) => {
      if (event.target !== button) {
        return;
      }

      const isPaused = this.slider.getAttribute("data-slider-paused") === "true";
      const target = isPaused ? playIcon : pauseIcon;

      target?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });

    pauseItem.appendChild(button);

    return button;
  }

  private syncSlideFocusableElements(slide: HTMLElement, isActive: boolean): void {
    const key = this.options.tabindexKey;

    slide
      .querySelectorAll<HTMLElement>(
        "a[href], button, input, select, textarea, iframe, audio[controls], video[controls], [tabindex]"
      )
      .forEach((element) => {
        const savedTabIndex = element.dataset[key];

        if (isActive) {
          if (savedTabIndex !== undefined) {
            if (savedTabIndex === "") {
              element.removeAttribute("tabindex");
            } else {
              element.setAttribute("tabindex", savedTabIndex);
            }

            delete element.dataset[key];
          }

          return;
        }

        if (savedTabIndex === undefined) {
          element.dataset[key] = element.getAttribute("tabindex") ?? "";
        }

        element.setAttribute("tabindex", "-1");
      });
  }

  private getDotsList(): HTMLElement | undefined {
    return this.findFirst(this.controls, ".brz-slick-slider__dots");
  }

  private getDotsListItems(): HTMLElement[] {
    return this.findAll(this.controls, ".brz-slick-slider__dots > li");
  }

  private getDotButtons(): HTMLButtonElement[] {
    return this.findAllButtons(
      this.controls,
      ".brz-slick-slider__dots > li:not(.brz-slick-slider__pause) button"
    );
  }

  private getPauseButton(): HTMLButtonElement | undefined {
    return this.findFirstButton(this.controls, ".brz-slick-slider__pause-button");
  }

  private getPauseItem(): HTMLElement | undefined {
    return this.findFirst(this.controls, ".brz-slick-slider__pause");
  }

  private getSlides(): HTMLElement[] {
    return this.findAll(this.slider, ".slick-slide:not(.slick-cloned)");
  }

  private getArrowButtons(): HTMLButtonElement[] {
    return this.findAllButtons(
      this.controls,
      ".brz-slick-slider__arrow-prev, .brz-slick-slider__arrow-next"
    );
  }

  private getClonedSlides(): HTMLElement[] {
    return this.findAll(this.slider, ".slick-slide.slick-cloned");
  }

  private findFirst(scope: ParentNode | undefined, selector: string): HTMLElement | undefined {
    return scope?.querySelector<HTMLElement>(selector) ?? undefined;
  }

  private findFirstButton(
    scope: ParentNode | undefined,
    selector: string
  ): HTMLButtonElement | undefined {
    return scope?.querySelector<HTMLButtonElement>(selector) ?? undefined;
  }

  private findAll(scope: ParentNode | undefined, selector: string): HTMLElement[] {
    return scope ? Array.from(scope.querySelectorAll<HTMLElement>(selector)) : [];
  }

  private findAllButtons(scope: ParentNode | undefined, selector: string): HTMLButtonElement[] {
    return scope ? Array.from(scope.querySelectorAll<HTMLButtonElement>(selector)) : [];
  }
}
