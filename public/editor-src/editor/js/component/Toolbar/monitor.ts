export interface ToolbarMonitorHandler {
  handleMonitorActivationRequest: () => void;
  handleMonitorDeactivationRequest: () => void;
}

let lastActive: ToolbarMonitorHandler | null = null;
let active: ToolbarMonitorHandler | null = null;

export const monitor = {
  getActive(): ToolbarMonitorHandler | null {
    return active;
  },
  setActive(instance: ToolbarMonitorHandler): void {
    this.unsetActive();

    active = instance;
  },
  unsetIfActive(instance: ToolbarMonitorHandler): void {
    if (instance === active) {
      lastActive = instance;
      active = null;
      lastActive.handleMonitorDeactivationRequest();
    }
  },
  unsetActive(): void {
    if (active !== null) {
      lastActive = active;
      active = null; // setting active to null before calling the method ensures correct behavior
      lastActive.handleMonitorDeactivationRequest();
    }
  },
  activateLastActive(): void {
    if (lastActive) {
      lastActive.handleMonitorActivationRequest();
    }
  }
};
