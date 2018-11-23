let lastActive = null;
let active = null;

const monitor = {
  getActive() {
    return active;
  },
  setActive(instance) {
    this.unsetActive();

    active = instance;
  },
  unsetIfActive(instance) {
    if (instance === active) {
      lastActive = instance;
      active = null;
      lastActive.handleMonitorDeactivationRequest();
    }
  },
  unsetActive() {
    if (active !== null) {
      lastActive = active;
      active = null; // setting active to null before calling the method ensures correct behavior
      lastActive.handleMonitorDeactivationRequest();
    }
  },
  activateLastActive() {
    lastActive.handleMonitorActivationRequest();
  }
};

export default monitor;
