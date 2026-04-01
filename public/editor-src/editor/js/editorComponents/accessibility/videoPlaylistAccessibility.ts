interface Options {
  root: HTMLElement;
  instanceId: number;
}

type SliderType = "progress" | "volume";

interface PlayerState {
  activeIndex: number;
  activeLabel: string;
  video: HTMLVideoElement | null;
  hasPlayableVideo: boolean;
  hasDuration: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
}

const BUTTON_KEYS = new Set(["Enter", " ", "Spacebar"]);
const VIDEO_EVENTS = [
  "loadedmetadata",
  "play",
  "pause",
  "timeupdate",
  "volumechange",
  "ended"
] as const;
const SELECTORS = {
  sidebar: ".brz-video-playlist-sidebar",
  item: ".brz-video-playlist-video-item",
  panel: ".brz-video-playlist-main",
  iframe: ".brz-iframe",
  video: "video",
  videoElement: ".brz-video-elem",
  controlsGroup: ".brz-video-playlist-main__controls",
  coverButton: ".brz-video-playlist__cover-icon",
  placeholderButton: ".brz-video-playlist-main__placeholder",
  playPauseButton: ".brz-video-custom-play-pause-btn",
  muteButton: ".brz-video-custom-volume-btn",
  fullscreenButton: ".brz-video-custom-fullscreen-btn",
  progressSlider: ".brz-video-custom-controls .brz-video-custom-slider",
  volumeSlider: ".brz-video-custom-volume-controls",
  progressBar: ".brz-video-custom-controls .brz-video-custom-progress",
  volumeProgressBar: ".brz-video-custom-volume-controls .brz-video-custom-progress",
  itemText: ".brz-video-playlist-title-video .brz-span"
} as const;
const PLAYLIST_LABEL = "Video playlist";
const PLAYLIST_ITEMS_LABEL = "Video playlist items";
const VIDEO_CONTROLS_LABEL = "Video controls";

export class VideoPlaylistAccessibility {
  private readonly root: HTMLElement;
  private readonly instanceId: number;
  private currentVideo: HTMLVideoElement | null = null;
  private suppressFocusActivation = false;
  private readonly handleVideoStateChange = (): void => this.sync();
  private readonly handleFullscreenChange = (): void => this.sync();

  constructor({ root, instanceId }: Options) {
    this.root = root;
    this.instanceId = instanceId;
  }

  public init(): void {
    this.root.setAttribute("role", "region");
    this.root.setAttribute("aria-label", PLAYLIST_LABEL);

    this.initSidebar();
    this.initButtons();
    this.initSliders();

    this.root.ownerDocument.addEventListener(
      "fullscreenchange",
      this.handleFullscreenChange
    );

    this.bindVideoEvents();
    this.sync();
  }

  public sync(): void {
    this.bindVideoEvents();

    const state = this.getPlayerState();

    this.syncSidebar(state);
    this.syncPanels();
    this.syncMediaLabels(state.activeLabel, state.video);
    this.syncButtons(state);
    this.syncSliders(state);
  }

  private initSidebar(): void {
    const sidebar = this.q(SELECTORS.sidebar);
    const items = this.getItems();

    sidebar?.setAttribute("role", "listbox");
    sidebar?.setAttribute("aria-label", PLAYLIST_ITEMS_LABEL);

    items.forEach((item, index) => {
      item.setAttribute("id", this.getItemId(index));
      item.setAttribute("role", "option");
      item.setAttribute("aria-posinset", String(index + 1));
      item.setAttribute("aria-setsize", String(items.length));

      ["pointerdown", "mousedown"].forEach((eventName) => {
        item.addEventListener(eventName, () =>
          this.temporarilySuppressFocusActivation()
        );
      });

      item.addEventListener("focus", () => this.handleItemFocus(item, index));
      item.addEventListener("keydown", (event) =>
        this.handleItemKeyDown(event, index)
      );
    });
  }

  private initButtons(): void {
    [
      SELECTORS.coverButton,
      SELECTORS.placeholderButton,
      SELECTORS.playPauseButton,
      SELECTORS.muteButton,
      SELECTORS.fullscreenButton
    ].forEach((selector) => this.prepareButton(this.q(selector)));

    const controlsGroup = this.q(SELECTORS.controlsGroup);

    controlsGroup?.setAttribute("role", "group");
    controlsGroup?.setAttribute("aria-label", VIDEO_CONTROLS_LABEL);
  }

  private initSliders(): void {
    this.prepareSlider(this.q(SELECTORS.progressSlider), "progress");
    this.prepareSlider(this.q(SELECTORS.volumeSlider), "volume");
  }

  private bindVideoEvents(): void {
    const nextVideo = this.getVideo();

    if (this.currentVideo === nextVideo) {
      return;
    }

    if (this.currentVideo) {
      VIDEO_EVENTS.forEach((eventName) =>
        this.currentVideo?.removeEventListener(
          eventName,
          this.handleVideoStateChange
        )
      );
    }

    this.currentVideo = nextVideo;

    VIDEO_EVENTS.forEach((eventName) =>
      this.currentVideo?.addEventListener(eventName, this.handleVideoStateChange)
    );
  }

  private prepareButton(button: HTMLElement | null): void {
    if (!button) {
      return;
    }

    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.addEventListener("keydown", this.handleButtonKeyDown);
  }

  private prepareSlider(
    slider: HTMLElement | null,
    sliderType: SliderType
  ): void {
    if (!slider) {
      return;
    }

    slider.setAttribute("role", "slider");
    slider.setAttribute("tabindex", "0");
    slider.addEventListener("keydown", (event) =>
      this.handleSliderKeyDown(event, sliderType)
    );
  }

  private syncSidebar({ activeIndex }: PlayerState): void {
    this.getItems().forEach((item, index) => {
      const isActive = index === activeIndex;

      item.setAttribute("aria-label", this.getItemLabel(item, index));
      item.setAttribute("aria-selected", isActive.toString());
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  }

  private syncPanels(): void {
    this.qa(SELECTORS.panel).forEach((panel, index) => {
      panel.setAttribute("id", `brz-video-playlist-panel-${this.instanceId}-${index}`);

      if (!panel.classList.contains("brz-video-playlist-main__placeholder")) {
        panel.setAttribute("role", "group");
      }

      panel.setAttribute("aria-hidden", this.isHidden(panel).toString());
    });

    const controlsGroup = this.q(SELECTORS.controlsGroup);
    controlsGroup?.setAttribute(
      "aria-hidden",
      this.isHidden(controlsGroup).toString()
    );
  }

  private syncMediaLabels(
    activeLabel: string,
    video: HTMLVideoElement | null
  ): void {
    const iframe = this.root.querySelector<HTMLIFrameElement>(SELECTORS.iframe);

    iframe?.setAttribute(
      "title",
      activeLabel ? `${activeLabel} video` : "Embedded video player"
    );
    video?.setAttribute(
      "aria-label",
      activeLabel ? `${activeLabel} video` : "Video player"
    );
  }

  private syncButtons(state: PlayerState): void {
    const {
      activeLabel,
      hasPlayableVideo,
      isPlaying,
      isMuted,
      isFullscreen,
      duration
    } = state;
    const buttonConfigs = [
      {
        selector: SELECTORS.coverButton,
        label: activeLabel ? `Play ${activeLabel}` : "Play selected video"
      },
      {
        selector: SELECTORS.placeholderButton,
        label: activeLabel ? `Play ${activeLabel}` : "Play selected video"
      },
      {
        selector: SELECTORS.playPauseButton,
        label: isPlaying ? "Pause video" : "Play video",
        pressed: isPlaying,
        disabled: !hasPlayableVideo,
        toggleIcons: isPlaying
      },
      {
        selector: SELECTORS.muteButton,
        label: isMuted ? "Unmute video" : "Mute video",
        pressed: isMuted,
        disabled: !hasPlayableVideo,
        toggleIcons: isMuted
      },
      {
        selector: SELECTORS.fullscreenButton,
        label: isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
        pressed: isFullscreen,
        disabled:
          !hasPlayableVideo || !Number.isFinite(duration) || Number(duration) <= 0
      }
    ];

    buttonConfigs.forEach(
      ({ selector, toggleIcons, ...options }) => {
        const button = this.q(selector);

        this.updateButton(button, options);

        if (toggleIcons !== undefined) {
          this.syncToggleIcons(button, toggleIcons);
        }
      }
    );
  }

  private syncSliders(state: PlayerState): void {
    const { hasPlayableVideo, hasDuration, duration, currentTime, volume } =
      state;

    this.updateSlider(this.q(SELECTORS.progressSlider), {
      label: "Seek video",
      disabled: !hasDuration,
      min: 0,
      max: hasDuration ? duration : 0,
      now: hasDuration ? currentTime : 0,
      text: hasDuration
        ? `${this.formatTime(currentTime)} of ${this.formatTime(duration)}`
        : "Video is not ready"
    });

    this.updateSlider(this.q(SELECTORS.volumeSlider), {
      label: "Volume",
      disabled: !hasPlayableVideo,
      min: 0,
      max: 100,
      now: volume,
      text: `${Math.round(volume)}%`
    });

    this.updateProgressBar(
      this.q(SELECTORS.progressBar),
      hasDuration ? (currentTime / duration) * 100 : 0
    );
    this.updateProgressBar(this.q(SELECTORS.volumeProgressBar), volume);
  }

  private updateButton(
    button: HTMLElement | null,
    options: { label: string; pressed?: boolean; disabled?: boolean }
  ): void {
    if (!button) {
      return;
    }

    const { label, pressed, disabled = false } = options;

    button.setAttribute("aria-label", label);
    button.setAttribute("aria-disabled", disabled.toString());
    button.setAttribute("tabindex", disabled ? "-1" : "0");

    if (pressed === undefined) {
      button.removeAttribute("aria-pressed");
    } else {
      button.setAttribute("aria-pressed", pressed.toString());
    }
  }

  private updateSlider(
    slider: HTMLElement | null,
    options: {
      label: string;
      disabled: boolean;
      min: number;
      max: number;
      now: number;
      text: string;
    }
  ): void {
    if (!slider) {
      return;
    }

    const { label, disabled, min, max, now, text } = options;

    slider.setAttribute("aria-label", label);
    slider.setAttribute("aria-disabled", disabled.toString());
    slider.setAttribute("aria-valuemin", String(Math.round(min)));
    slider.setAttribute("aria-valuemax", String(Math.round(max)));
    slider.setAttribute("aria-valuenow", String(Math.round(now)));
    slider.setAttribute("aria-valuetext", text);
    slider.setAttribute("tabindex", disabled ? "-1" : "0");
  }

  private handleButtonKeyDown = (event: KeyboardEvent): void => {
    if (!BUTTON_KEYS.has(event.key)) {
      return;
    }

    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  };

  private handleItemKeyDown(event: KeyboardEvent, index: number): void {
    const items = this.getItems();

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        items[index]?.click();
        window.requestAnimationFrame(() => this.sync());
        break;
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        this.focusItem(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        this.focusItem(index - 1);
        break;
      case "Home":
        event.preventDefault();
        this.focusItem(0);
        break;
      case "End":
        event.preventDefault();
        this.focusItem(items.length - 1);
        break;
    }
  }

  private handleItemFocus(item: HTMLElement, index: number): void {
    if (
      this.suppressFocusActivation ||
      item.classList.contains("brz-video-playlist-video-item--active")
    ) {
      return;
    }

    item.setAttribute("tabindex", "0");
    item.click();

    window.requestAnimationFrame(() => {
      this.sync();
      this.focusItem(index, false);
    });
  }

  private handleSliderKeyDown(
    event: KeyboardEvent,
    sliderType: SliderType
  ): void {
    const video = this.getVideo();

    if (!video?.src) {
      return;
    }

    if (sliderType === "progress") {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const nextTime = this.getKeyboardAdjustedValue(
        event,
        video.currentTime,
        video.duration
      );

      if (nextTime === null) {
        return;
      }

      event.preventDefault();
      video.currentTime = nextTime;
      this.sync();
      return;
    }

    const nextVolume = this.getKeyboardAdjustedValue(
      event,
      video.muted ? 0 : video.volume * 100,
      100
    );

    if (nextVolume === null) {
      return;
    }

    event.preventDefault();
    video.volume = nextVolume / 100;
    video.muted = nextVolume === 0;
    this.sync();
  }

  private getKeyboardAdjustedValue(
    event: KeyboardEvent,
    currentValue: number,
    maxValue: number
  ): number | null {
    let nextValue = currentValue;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        nextValue -= 5;
        break;
      case "ArrowRight":
      case "ArrowUp":
        nextValue += 5;
        break;
      case "PageDown":
        nextValue -= 10;
        break;
      case "PageUp":
        nextValue += 10;
        break;
      case "Home":
        nextValue = 0;
        break;
      case "End":
        nextValue = maxValue;
        break;
      default:
        return null;
    }

    return this.clamp(nextValue, 0, maxValue);
  }

  private focusItem(index: number, shouldFocus = true): void {
    const items = this.getItems();

    if (!items.length) {
      return;
    }

    const normalizedIndex = (index + items.length) % items.length;

    items.forEach((item, itemIndex) => {
      item.setAttribute("tabindex", itemIndex === normalizedIndex ? "0" : "-1");
    });

    if (shouldFocus) {
      items[normalizedIndex]?.focus();
    }
  }

  private syncToggleIcons(
    button: HTMLElement | null,
    showSecondIcon: boolean
  ): void {
    if (!button || button.children.length < 2) {
      return;
    }

    button.children[0].classList.toggle("brz-hidden", showSecondIcon);
    button.children[1].classList.toggle("brz-hidden", !showSecondIcon);
  }

  private getPlayerState(): PlayerState {
    const video = this.getVideo();
    const activeIndex = Math.max(
      this.getItems().findIndex((item) =>
        item.classList.contains("brz-video-playlist-video-item--active")
      ),
      0
    );
    const duration = video?.duration ?? 0;
    const currentTime = video?.currentTime ?? 0;
    const volume = video ? (video.muted ? 0 : video.volume * 100) : 0;
    const hasPlayableVideo = !!video?.src;
    const hasDuration = hasPlayableVideo && Number.isFinite(duration) && duration > 0;

    return {
      activeIndex,
      activeLabel: this.getItemLabel(this.getItems()[activeIndex], activeIndex),
      video,
      hasPlayableVideo,
      hasDuration,
      duration,
      currentTime,
      volume,
      isPlaying: !!video?.src && !video.paused,
      isMuted: !video || video.muted || video.volume === 0,
      isFullscreen: this.isFullscreen()
    };
  }

  private getItems(): HTMLElement[] {
    return this.qa(SELECTORS.item);
  }

  private getVideo(): HTMLVideoElement | null {
    const video = this.root.querySelector<HTMLVideoElement>(SELECTORS.video);
    return video?.getAttribute("src") ? video : null;
  }

  private getItemId(index: number): string {
    return `brz-video-playlist-item-${this.instanceId}-${index}`;
  }

  private getItemLabel(item: HTMLElement | undefined, index: number): string {
    const label =
      item
        ? this.qa(SELECTORS.itemText, item)
            .map((part) => part.textContent?.trim() ?? "")
            .filter(Boolean)
            .join(" ") || item.textContent?.replace(/\s+/g, " ").trim()
        : "";

    return label || `Video ${index + 1}`;
  }

  private isHidden(element: HTMLElement): boolean {
    return element.classList.contains("brz-d-none");
  }

  private isFullscreen(): boolean {
    const fullscreenElement = this.root.ownerDocument.fullscreenElement;
    const videoElement = this.q(SELECTORS.videoElement);

    return (
      !!fullscreenElement &&
      !!videoElement &&
      fullscreenElement.contains(videoElement)
    );
  }

  private formatTime(time: number): string {
    const totalSeconds = Math.max(Math.floor(time), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private temporarilySuppressFocusActivation(): void {
    this.suppressFocusActivation = true;

    window.requestAnimationFrame(() => {
      this.suppressFocusActivation = false;
    });
  }

  private updateProgressBar(
    progressBar: HTMLElement | null,
    percent: number
  ): void {
    if (!progressBar) {
      return;
    }

    progressBar.style.width = `${this.clamp(percent, 0, 100)}%`;
  }

  private q<T extends HTMLElement = HTMLElement>(
    selector: string,
    scope: ParentNode = this.root
  ): T | null {
    return scope.querySelector<T>(selector);
  }

  private qa<T extends HTMLElement = HTMLElement>(
    selector: string,
    scope: ParentNode = this.root
  ): T[] {
    return Array.from(scope.querySelectorAll<T>(selector));
  }
}
