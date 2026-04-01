interface VideoAccessibilityOptions {
  root: HTMLElement;
}

const roundTo = (num: number, places = 2): string => num.toFixed(places);

export class VideoAccessibility {
  private root: HTMLElement;

  constructor({ root }: VideoAccessibilityOptions) {
    this.root = root;
  }

  public init(): void {
    this.initCovers();
    this.initLightboxes();
    this.initCustomControls();
    this.initCustomSliders();
  }

  private initCovers(): void {
    const covers = this.root.querySelectorAll<HTMLElement>(".brz-video__cover");

    covers.forEach((cover) => {
      // Skip if already initialised
      if (cover.getAttribute("data-brz-a11y-init") === "true") {
        return;
      }

      cover.setAttribute("data-brz-a11y-init", "true");

      // Only expose the cover as a button if it is actually clickable
      const hasClickHandler =
        typeof (cover.onclick) === "function" ||
        cover.closest(".brz-video, .brz-custom-video") !== null;

      if (!hasClickHandler) {
        return;
      }

      const hasLabel =
        !!cover.getAttribute("aria-label") ||
        !!cover.getAttribute("aria-labelledby");

      cover.setAttribute("role", "button");
      cover.setAttribute("tabindex", "0");

      if (!hasLabel) {
        cover.setAttribute("aria-label", "Play video");
      }

      cover.addEventListener("keydown", (event: KeyboardEvent) => {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "Spacebar"
        ) {
          event.preventDefault();
          (event.currentTarget as HTMLElement)?.click();
        }
      });
    });
  }

  private initLightboxes(): void {
    const lightboxes =
      this.root.querySelectorAll<HTMLAnchorElement>(".brz-video__lightbox");

    lightboxes.forEach((lightbox) => {
      if (lightbox.getAttribute("data-brz-a11y-init") === "true") {
        return;
      }

      lightbox.setAttribute("data-brz-a11y-init", "true");

      lightbox.setAttribute("role", "button");
      lightbox.setAttribute("tabindex", "0");

      const hasLabel =
        !!lightbox.getAttribute("aria-label") ||
        !!lightbox.getAttribute("aria-labelledby");

      if (!hasLabel) {
        lightbox.setAttribute("aria-label", "Open video in lightbox");
      }

      lightbox.addEventListener("keydown", (event: KeyboardEvent) => {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "Spacebar"
        ) {
          event.preventDefault();
          (event.currentTarget as HTMLElement)?.click();
        }
      });
    });
  }

  private initCustomControls(): void {
    // Make the whole custom video content area keyboard-activatable
    this.root
      .querySelectorAll<HTMLElement>(".brz-custom-video .brz-video-content")
      .forEach((content) => {
        if (content.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        content.setAttribute("data-brz-a11y-init", "true");
        content.setAttribute("role", "button");
        content.setAttribute("tabindex", "0");

        if (!content.getAttribute("aria-label")) {
          content.setAttribute("aria-label", "Play or pause video");
        }

        content.addEventListener("keydown", (event: KeyboardEvent) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();

            const container = (event.currentTarget as HTMLElement).closest(
              ".brz-custom-video"
            );

            if (!container) {
              return;
            }

            // If lightbox is enabled, prefer opening the lightbox instead of inline play
            const lightbox = container.querySelector<HTMLElement>(
              ".brz-video__lightbox"
            );

            if (lightbox) {
              lightbox.click();
              return;
            }

            const playPauseBtn = container.querySelector<HTMLElement>(
              ".brz-video-custom-play-pause-btn"
            );

            playPauseBtn?.click();
          }
        });
      });

    // Play / pause
    this.root
      .querySelectorAll<HTMLElement>(".brz-video-custom-play-pause-btn")
      .forEach((button) => {
        if (button.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        button.setAttribute("data-brz-a11y-init", "true");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        if (!button.getAttribute("aria-label")) {
          button.setAttribute("aria-label", "Play or pause video");
        }

        button.addEventListener("keydown", (event: KeyboardEvent) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            event.stopPropagation();
            (event.currentTarget as HTMLElement)?.click();
          }
        });
      });

    // Mute / volume toggle
    this.root
      .querySelectorAll<HTMLElement>(".brz-video-custom-volume-btn")
      .forEach((button) => {
        if (button.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        button.setAttribute("data-brz-a11y-init", "true");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        if (!button.getAttribute("aria-label")) {
          button.setAttribute("aria-label", "Toggle mute");
        }

        button.addEventListener("keydown", (event: KeyboardEvent) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            event.stopPropagation();
            (event.currentTarget as HTMLElement)?.click();
          }
        });
      });

    // Fullscreen toggle
    this.root
      .querySelectorAll<HTMLElement>(".brz-video-custom-fullscreen-btn")
      .forEach((button) => {
        if (button.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        button.setAttribute("data-brz-a11y-init", "true");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        if (!button.getAttribute("aria-label")) {
          button.setAttribute("aria-label", "Toggle fullscreen");
        }

        button.addEventListener("keydown", (event: KeyboardEvent) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            event.stopPropagation();
            (event.currentTarget as HTMLElement)?.click();
          }
        });
      });

    // Captions
    this.root
      .querySelectorAll<HTMLElement>(".brz-media-caption")
      .forEach((button) => {
        if (button.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        button.setAttribute("data-brz-a11y-init", "true");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        if (!button.getAttribute("aria-label")) {
          button.setAttribute("aria-label", "Toggle captions");
        }

        button.addEventListener("keydown", (event: KeyboardEvent) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            event.stopPropagation();
            (event.currentTarget as HTMLElement)?.click();
          }
        });
      });
  }

  private initCustomSliders(): void {
    // Time (seconds) slider
    this.root
      .querySelectorAll<HTMLElement>(
        ".brz-custom-video .brz-video-custom-controls .brz-video-custom-slider"
      )
      .forEach((slider) => {
        if (slider.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        slider.setAttribute("data-brz-a11y-init", "true");
        slider.setAttribute("role", "slider");
        slider.setAttribute("tabindex", "0");
        slider.setAttribute("aria-valuemin", "0");
        slider.setAttribute("aria-valuemax", "100");
        if (!slider.getAttribute("aria-label")) {
          slider.setAttribute("aria-label", "Video progress");
        }

        slider.addEventListener("keydown", (event: KeyboardEvent) => {
          const shortcodeVideo = (event.currentTarget as HTMLElement).closest(
            ".brz-custom-video"
          );
          const video = shortcodeVideo?.querySelector("video");

          if (!shortcodeVideo || !video || !video.duration) {
            return;
          }

          const stepSeconds = 5;
          let newTime = video.currentTime;
          let handled = false;

          switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
              newTime = Math.min(video.duration, video.currentTime + stepSeconds);
              handled = true;
              break;
            case "ArrowLeft":
            case "ArrowDown":
              newTime = Math.max(0, video.currentTime - stepSeconds);
              handled = true;
              break;
            case "Home":
              newTime = 0;
              handled = true;
              break;
            case "End":
              newTime = video.duration;
              handled = true;
              break;
          }

          if (!handled) return;

          event.preventDefault();
          event.stopPropagation();
          video.currentTime = newTime;

          const percent = (newTime / video.duration) * 100;
          const progress = shortcodeVideo.querySelector<HTMLElement>(
            ".brz-video-custom-controls .brz-video-custom-progress"
          );

          if (progress) {
            progress.style.width = `${roundTo(percent)}%`;
          }

          slider.setAttribute("aria-valuenow", roundTo(percent));
        });
      });

    // Volume slider
    this.root
      .querySelectorAll<HTMLElement>(
        ".brz-custom-video .brz-video-custom-volume-controls"
      )
      .forEach((slider) => {
        if (slider.getAttribute("data-brz-a11y-init") === "true") {
          return;
        }

        slider.setAttribute("data-brz-a11y-init", "true");
        slider.setAttribute("role", "slider");
        slider.setAttribute("tabindex", "0");
        slider.setAttribute("aria-valuemin", "0");
        slider.setAttribute("aria-valuemax", "100");
        if (!slider.getAttribute("aria-label")) {
          slider.setAttribute("aria-label", "Volume");
        }

        slider.addEventListener("keydown", (event: KeyboardEvent) => {
          const shortcodeVideo = (event.currentTarget as HTMLElement).closest(
            ".brz-custom-video"
          );
          const video = shortcodeVideo?.querySelector("video");

          if (!shortcodeVideo || !video) {
            return;
          }

          const step = 0.1;
          let newVolume = video.volume;
          let handled = false;

          switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
              newVolume = Math.min(1, video.volume + step);
              handled = true;
              break;
            case "ArrowLeft":
            case "ArrowDown":
              newVolume = Math.max(0, video.volume - step);
              handled = true;
              break;
            case "Home":
              newVolume = 0;
              handled = true;
              break;
            case "End":
              newVolume = 1;
              handled = true;
              break;
          }

          if (!handled) return;

          event.preventDefault();
          event.stopPropagation();
          video.volume = newVolume;

          const volumeProgress = shortcodeVideo.querySelector<HTMLElement>(
            ".brz-video-custom-volume-controls .brz-video-custom-progress"
          );
          const volumePercent = newVolume * 100;

          if (volumeProgress) {
            volumeProgress.style.width = `${roundTo(volumePercent)}%`;
          }

          slider.setAttribute("aria-valuenow", roundTo(volumePercent));
        });
      });
  }
}
