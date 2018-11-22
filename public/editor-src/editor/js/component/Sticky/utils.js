export const observer = {
  events: ["load", "scroll"],
  listeners: [],
  framePending: false,
  addEvents: function() {
    var _this = this;
    this.notifyListeners = this.notifyListeners.bind(this);

    this.events.forEach(function(event) {
      window.addEventListener(event, _this.notifyListeners);
    });
  },
  removeEvents: function() {
    var _this = this;

    this.events.forEach(function(event) {
      window.removeEventListener(event, _this.notifyListeners);
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
      var _this = this;

      requestAnimationFrame(function() {
        _this.framePending = false;
        _this.listeners.forEach(function(listener) {
          listener();
        });
      });
      this.framePending = true;
    }
  }
};
