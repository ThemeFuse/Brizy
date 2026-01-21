import {
  createPopper as CreatePopper,
  Instance as PopperInstance,
  Options as PopperOptions
} from "@popperjs/core";

type Disabled = {
  events?: boolean;
  position?: boolean;
};

interface Settings {
  offset?: number;
  placement?: PopperOptions["placement"];
  disabled?: Disabled;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
}

export class Dropdown {
  private settings: Settings = {
    offset: 0,
    placement: "bottom-start",
    onOpen: undefined
  };

  private itemPopper: undefined | PopperInstance;

  private readonly item: Element | undefined;

  private readonly content: Element | undefined;

  private attached = {
    events: false,
    popper: false
  };

  constructor(item: Element, content: Element, settings?: Settings) {
    this.item = item;
    this.content = content;
    this.settings = { ...this.settings, ...settings };
    this.init();
  }

  private init(): void {
    const { disabled } = this.settings;

    if (disabled) {
      const { position, events } = disabled;

      if (position) {
        this.destroyPopper();
      } else {
        this.initPopper();
      }

      if (events) {
        this.destroyEvents();
      } else {
        this.initEvents();
      }
    } else {
      this.initEvents();
      this.initPopper();
    }
  }

  private initPopper() {
    if (
      this.item &&
      this.content instanceof HTMLElement &&
      !this.attached.popper
    ) {
      this.attached.popper = true;
      const offset = this.settings.offset;

      const isRtl = window.getComputedStyle(this.item).direction === "rtl";

      if (isRtl && this.settings.placement) {
        this.settings.placement = this.settings.placement.replace(
          /right|left/,
          (match) => (match === "right" ? "left" : "right")
        ) as PopperOptions["placement"];

        this.content.style.setProperty(
          "inset-inline-start",
          "0px",
          "important"
        );
      }

      const options: Partial<PopperOptions> = {
        placement: this.settings.placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, offset]
            }
          }
        ]
      };
      this.content.style.setProperty("--offset", `${offset}px`);
      this.itemPopper = CreatePopper(this.item, this.content, options);
    }
  }

  private initEvents(): void {
    if (this.item && !this.attached.events) {
      this.item.addEventListener("mouseenter", this.handleEnter);
      this.item.addEventListener("mouseleave", this.handleLeave);
      this.attached.events = true;
    }
  }

  private destroyPopper(): void {
    this.itemPopper?.destroy();
    this.itemPopper = undefined;
    this.attached.popper = false;

    if (this.content instanceof HTMLElement) {
      this.content.style.removeProperty("--offset");
    }
  }

  private destroyEvents(): void {
    this.item?.removeEventListener("mouseenter", this.handleEnter);
    this.item?.removeEventListener("mouseleave", this.handleLeave);
    this.attached.events = false;
  }

  private handleEnter = (): void => {
    this.open();
  };

  private handleLeave = (): void => {
    this.close();
  };

  public open(): void {
    const popper = this.itemPopper;

    if (popper) {
      popper.update().then(() => {
        this.item?.classList.add("brz-menu__item-dropdown--active");
        this.settings.onOpen?.();
      });
    } else {
      this.item?.classList.add("brz-menu__item-dropdown--active");
      this.settings.onOpen?.();
    }
  }

  public isOpen(): boolean {
    return (
      this.item?.classList.contains("brz-menu__item-dropdown--active") ?? false
    );
  }

  public close(): void {
    this.item?.classList.remove("brz-menu__item-dropdown--active");
    this.settings.onClose?.();
  }

  public update(settings?: Settings): void {
    if (settings) {
      this.settings = { ...this.settings, ...settings };
    }

    this.init();
  }
}
