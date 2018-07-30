export var observer = {
  events: ["load", "scroll"],
  listeners: [],
  framePending: false,
  addEvents: function() {
    this.notifyListeners = this.notifyListeners.bind(this);
    this.events.forEach(function(event) {
      window.addEventListener(event, this.notifyListeners);
    });
  },
  removeEvents: function() {
    this.events.forEach(function(event) {
      window.removeEventListener(event, this.notifyListeners);
    });
  },
  addListener: function(listener) {
    if (this.listeners.length === 0) {
      this.addEvents();
    }

    this.listeners.push(listener);
  },
  removeListener: function(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);

    if (this.listeners.length === 0) {
      this.removeEvents();
    }
  },
  notifyListeners: function() {
    if (!this.framePending) {
      requestAnimationFrame(function() {
        this.framePending = false;
        this.listeners.forEach(function(listener) {
          listener();
        });
      });
      this.framePending = true;
    }
  }
};
