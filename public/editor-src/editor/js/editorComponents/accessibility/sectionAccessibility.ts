interface Options {
  slick: JQuery<Element>;
  instanceId: number;
}

export class SectionSliderAccessibility {
  private slick: JQuery<Element>;
  private instanceId: number;

  constructor({ slick, instanceId }: Options) {
    this.slick = slick;
    this.instanceId = instanceId;
  }

  public init(): void {
    this.setupRegionAccessibility();
    this.setupArrowAccessibility();
    this.setupDotsAccessibility();
    this.setupPauseControlAccessibility();
    this.sync();

    this.slick.on("afterChange reInit setPosition", () => this.sync());
  }

  public sync(): void {
    this.syncArrows();
    this.syncSlides();
    this.syncDots();
    this.syncPauseControl();
  }

  private setupRegionAccessibility(): void {
    const slider = this.getSliderElement();

    if (!slider) {
      return;
    }

    slider.setAttribute("id", `brz-section-slider-${this.instanceId}`);
    slider.setAttribute("role", "region");
    slider.setAttribute("aria-roledescription", "carousel");
    slider.setAttribute("aria-label", `Section slider ${this.instanceId + 1}`);
  }

  private setupArrowAccessibility(): void {
    const arrows = [
      {
        element: this.slick
          .find(".brz-slick-slider__arrow-prev")
          .get(0) as HTMLElement | undefined,
        label: "Previous slide"
      },
      {
        element: this.slick
          .find(".brz-slick-slider__arrow-next")
          .get(0) as HTMLElement | undefined,
        label: "Next slide"
      }
    ];

    const handleArrowKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          this.slick.slick("slickPrev");
          break;
        case "ArrowRight":
          event.preventDefault();
          this.slick.slick("slickNext");
          break;
      }
    };

    arrows.forEach(({ element, label }) => {
      if (!element) {
        return;
      }

      element.setAttribute("type", "button");
      element.setAttribute("aria-label", label);
      element.setAttribute(
        "aria-controls",
        `brz-section-slider-${this.instanceId}`
      );
      // Slick sets tabindex="-1" on disabled arrows which makes them unreachable by Tab.
      // We keep them tabbable and expose disabled state via aria-disabled.
      element.setAttribute("tabindex", "0");
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
      button.setAttribute(
        "aria-controls",
        `brz-section-slide-${this.instanceId}-${index}`
      );
    });
  }

  private setupPauseControlAccessibility(): void {
    const pauseItem = this.getPauseItem();

    if (!pauseItem) {
      return;
    }

    const pauseButton = this.ensurePauseButton(pauseItem);
    pauseButton.setAttribute("type", "button");
    pauseButton.setAttribute(
      "aria-controls",
      `brz-section-slider-${this.instanceId}`
    );
  }

  private syncSlides(): void {
    const slides = this.getSlides();

    slides.forEach((slide, index) => {
      const isActive = slide.classList.contains("slick-active");

      slide.setAttribute("id", `brz-section-slide-${this.instanceId}-${index}`);
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

    const isPaused = this.slick.attr("data-slider-paused") === "true";

    pauseButton.setAttribute(
      "aria-label",
      isPaused ? "Play autoplay" : "Pause autoplay"
    );
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

      const isPaused = this.slick.attr("data-slider-paused") === "true";
      const target = isPaused ? playIcon : pauseIcon;

      target?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
    });

    pauseItem.appendChild(button);

    return button;
  }

  private syncSlideFocusableElements(
    slide: HTMLElement,
    isActive: boolean
  ): void {
    slide
      .querySelectorAll<HTMLElement>(
        "a[href], button, input, select, textarea, iframe, audio[controls], video[controls], [tabindex]"
      )
      .forEach((element) => {
        const savedTabIndex = element.dataset.brzSectionSliderTabindex;

        if (isActive) {
          if (savedTabIndex !== undefined) {
            if (savedTabIndex === "") {
              element.removeAttribute("tabindex");
            } else {
              element.setAttribute("tabindex", savedTabIndex);
            }

            delete element.dataset.brzSectionSliderTabindex;
          }

          return;
        }

        if (savedTabIndex === undefined) {
          element.dataset.brzSectionSliderTabindex =
            element.getAttribute("tabindex") ?? "";
        }

        element.setAttribute("tabindex", "-1");
      });
  }

  private getSliderElement(): HTMLElement | undefined {
    return this.slick.get(0) as HTMLElement | undefined;
  }

  private getDotsList(): HTMLElement | undefined {
    return this.slick
      .find(".brz-slick-slider__dots")
      .get(0) as HTMLElement | undefined;
  }

  private getDotsListItems(): HTMLElement[] {
    return this.slick
      .find(".brz-slick-slider__dots > li")
      .toArray() as HTMLElement[];
  }

  private getDotButtons(): HTMLButtonElement[] {
    return this.slick
      .find(".brz-slick-slider__dots > li:not(.brz-slick-slider__pause) button")
      .toArray() as HTMLButtonElement[];
  }

  private getPauseButton(): HTMLButtonElement | undefined {
    return this.slick
      .find(".brz-slick-slider__pause-button")
      .get(0) as HTMLButtonElement | undefined;
  }

  private getPauseItem(): HTMLElement | undefined {
    return this.slick
      .find(".brz-slick-slider__pause")
      .get(0) as HTMLElement | undefined;
  }

  private getSlides(): HTMLElement[] {
    return this.slick
      .find(".slick-slide")
      .not(".slick-cloned")
      .toArray() as HTMLElement[];
  }

  private getArrowButtons(): HTMLButtonElement[] {
    return this.slick
      .find(
        ".brz-slick-slider__arrow-prev, .brz-slick-slider__arrow-next"
      )
      .toArray() as HTMLButtonElement[];
  }

  private getClonedSlides(): HTMLElement[] {
    return this.slick
      .find(".slick-slide.slick-cloned")
      .toArray() as HTMLElement[];
  }
}

