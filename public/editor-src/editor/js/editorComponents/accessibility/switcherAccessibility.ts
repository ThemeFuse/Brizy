let switcherInstance = 0;

export interface SwitcherAccessibilityOptions {
  root: HTMLElement;
  buttons: HTMLElement[];
  panels: HTMLElement[];
  getActiveIndex: () => number;
  onChange: (index: number) => void;
}

export class SwitcherAccessibility {
  private root: HTMLElement;
  private buttons: HTMLElement[];
  private panels: HTMLElement[];
  private getActiveIndex: () => number;
  private onChange: (index: number) => void;
  private instanceId: number;

  constructor(options: SwitcherAccessibilityOptions) {
    this.root = options.root;
    this.buttons = options.buttons;
    this.panels = options.panels;
    this.getActiveIndex = options.getActiveIndex;
    this.onChange = options.onChange;
    this.instanceId = switcherInstance++;
  }

  public init(): void {
    if (!this.buttons.length || !this.panels.length) {
      return;
    }

    this.root.setAttribute("role", "tablist");

    this.buttons.forEach((button, index) => {
      this.initButton(button, index);
    });

    this.panels.forEach((panel, index) => {
      this.initPanel(panel, index);
    });

    this.sync();
  }

  public sync(): void {
    const activeIndex = this.getActiveIndex();

    this.buttons.forEach((button, index) => {
      const isActive = index === activeIndex;

      button.setAttribute("aria-selected", isActive.toString());
      button.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    this.panels.forEach((panel, index) => {
      const isActive = index === activeIndex;

      panel.setAttribute("aria-hidden", (!isActive).toString());
    });
  }

  private initButton(button: HTMLElement, index: number): void {
    const buttonId =
      button.id || `brz-switcher-tab-${this.instanceId}-${index}`;

    button.id = buttonId;
    button.setAttribute("role", "tab");
    button.setAttribute("tabindex", "-1");

    button.addEventListener("keydown", (event) =>
      this.handleButtonKeyDown(event, index)
    );
  }

  private initPanel(panel: HTMLElement, index: number): void {
    const panelId =
      panel.id || `brz-switcher-panel-${this.instanceId}-${index}`;

    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");

    const button = this.buttons[index];

    if (button) {
      panel.setAttribute("aria-labelledby", button.id);
      button.setAttribute("aria-controls", panelId);
    }
  }

  private handleButtonKeyDown(event: KeyboardEvent, index: number): void {
    const key = event.key;
    const lastIndex = this.buttons.length - 1;

    switch (key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        this.onChange(index);
        break;
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = index === lastIndex ? 0 : index + 1;
        this.focusButton(nextIndex);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex = index === 0 ? lastIndex : index - 1;
        this.focusButton(prevIndex);
        break;
      }
      case "Home":
        event.preventDefault();
        this.focusButton(0);
        break;
      case "End":
        event.preventDefault();
        this.focusButton(lastIndex);
        break;
    }
  }

  private focusButton(index: number): void {
    const button = this.buttons[index];

    if (button) {
      button.focus();
    }
  }
}

