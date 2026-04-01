export interface AudioAccessibilityState {
  isPlaying: boolean;
  isMuted: boolean;
  progressPercent: number;
  volumePercent: number;
  captionsActive: boolean;
}

interface Options {
  root: HTMLElement;
  playPauseButton: HTMLElement | null;
  muteButton: HTMLElement | null;
  progressSlider: HTMLElement | null;
  volumeSlider: HTMLElement | null;
  captionButton: HTMLElement | null;
  seekToPercent: (percent: number) => void;
  setVolumePercent: (percent: number) => void;
}

export class AudioAccessibility {
  private root: HTMLElement;
  private playPauseButton: HTMLElement | null;
  private muteButton: HTMLElement | null;
  private progressSlider: HTMLElement | null;
  private volumeSlider: HTMLElement | null;
  private captionButton: HTMLElement | null;
  private seekToPercent: (percent: number) => void;
  private setVolumePercent: (percent: number) => void;

  constructor({
    root,
    playPauseButton,
    muteButton,
    progressSlider,
    volumeSlider,
    captionButton,
    seekToPercent,
    setVolumePercent
  }: Options) {
    this.root = root;
    this.playPauseButton = playPauseButton;
    this.muteButton = muteButton;
    this.progressSlider = progressSlider;
    this.volumeSlider = volumeSlider;
    this.captionButton = captionButton;
    this.seekToPercent = seekToPercent;
    this.setVolumePercent = setVolumePercent;
  }

  public init(): void {
    this.root.setAttribute("role", "group");
    this.root.setAttribute("aria-label", "Audio player");

    if (this.playPauseButton) {
      this.playPauseButton.setAttribute("role", "button");
      this.playPauseButton.setAttribute("tabindex", "0");
      this.playPauseButton.setAttribute("aria-label", "Play or pause audio");
      this.playPauseButton.setAttribute("aria-pressed", "false");
      this.playPauseButton.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
          event.preventDefault();
          (event.currentTarget as HTMLElement).click();
        }
      });
    }

    if (this.muteButton) {
      this.muteButton.setAttribute("role", "button");
      this.muteButton.setAttribute("tabindex", "0");
      this.muteButton.setAttribute("aria-label", "Mute or unmute audio");
      this.muteButton.setAttribute("aria-pressed", "false");
      this.muteButton.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
          event.preventDefault();
          (event.currentTarget as HTMLElement).click();
        }
      });
    }

    if (this.captionButton) {
      this.captionButton.setAttribute("role", "button");
      this.captionButton.setAttribute("tabindex", "0");
      this.captionButton.setAttribute("aria-label", "Toggle audio captions");
      this.captionButton.setAttribute("aria-pressed", "false");
      this.captionButton.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
          event.preventDefault();
          (event.currentTarget as HTMLElement).click();
        }
      });
    }

    if (this.progressSlider) {
      this.initSlider(this.progressSlider, "Audio playback position", (delta) =>
        this.handleProgressDelta(delta)
      );
    }

    if (this.volumeSlider) {
      this.initSlider(this.volumeSlider, "Audio volume", (delta) =>
        this.handleVolumeDelta(delta)
      );
    }
  }

  public syncState({
    isPlaying,
    isMuted,
    progressPercent,
    volumePercent,
    captionsActive
  }: AudioAccessibilityState): void {
    if (this.playPauseButton) {
      this.playPauseButton.setAttribute("aria-pressed", isPlaying.toString());
    }

    if (this.muteButton) {
      this.muteButton.setAttribute("aria-pressed", isMuted.toString());
    }

    if (this.captionButton) {
      this.captionButton.setAttribute("aria-pressed", captionsActive.toString());
    }

    if (this.progressSlider) {
      this.progressSlider.setAttribute("aria-valuemin", "0");
      this.progressSlider.setAttribute("aria-valuemax", "100");
      this.progressSlider.setAttribute(
        "aria-valuenow",
        this.normalizePercent(progressPercent).toString()
      );
    }

    if (this.volumeSlider) {
      this.volumeSlider.setAttribute("aria-valuemin", "0");
      this.volumeSlider.setAttribute("aria-valuemax", "100");
      this.volumeSlider.setAttribute(
        "aria-valuenow",
        this.normalizePercent(volumePercent).toString()
      );
    }
  }

  private initSlider(
    slider: HTMLElement,
    ariaLabel: string,
    onDelta: (delta: number) => void
  ): void {
    slider.setAttribute("role", "slider");
    slider.setAttribute("tabindex", "0");
    slider.setAttribute("aria-label", ariaLabel);
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-valuenow", "0");

    slider.addEventListener("keydown", (event: KeyboardEvent) => {
      let delta = 0;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          delta = 5;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          delta = -5;
          break;
        case "Home":
          delta = -100;
          break;
        case "End":
          delta = 100;
          break;
        default:
          return;
      }

      event.preventDefault();
      onDelta(delta);
    });
  }

  private handleProgressDelta(delta: number): void {
    const currentValue = this.getSliderValue(this.progressSlider);
    const next = this.normalizePercent(currentValue + delta);

    this.seekToPercent(next);
  }

  private handleVolumeDelta(delta: number): void {
    const currentValue = this.getSliderValue(this.volumeSlider);
    const next = this.normalizePercent(currentValue + delta);

    this.setVolumePercent(next);
  }

  private getSliderValue(slider: HTMLElement | null): number {
    if (!slider) {
      return 0;
    }

    const raw = parseFloat(slider.getAttribute("aria-valuenow") ?? "0");

    if (Number.isNaN(raw)) {
      return 0;
    }

    return raw;
  }

  private normalizePercent(value: number): number {
    if (value < 0) {
      return 0;
    }

    if (value > 100) {
      return 100;
    }

    return value;
  }
}

