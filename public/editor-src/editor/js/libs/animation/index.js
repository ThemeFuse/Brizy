import "../common/intersectionObserver";

const Animation = (function() {
  "use strict";
  let defaultSettings = {
    root: null,
    rootMargin: "0px",
    threshold: [0]
  };

  const Constructor = function(selector, settings = {}) {
    if (typeof selector === "string") {
      this.nodes = document.querySelectorAll(selector);
    } else {
      this.nodes = [selector];
    }

    this.settings = { ...defaultSettings, ...settings };

    const handleIntersection = function(entries) {
      entries.map(function(entry) {
        if (entry.intersectionRatio > 0) {
          let target = entry.target;

          const iterationCount =
            Number(target.getAttribute("data-iteration-count")) || 1;

          const iterationCompleted =
            Number(target.getAttribute("data-iteration-completed")) || 1;

          if (iterationCompleted >= iterationCount) {
            observer.unobserve(target);
          }

          target.classList.add("brz-animate");
          target.classList.add("brz-animate-opacity");

          target.setAttribute(
            "data-iteration-completed",
            iterationCompleted + 1
          );
        }
      });
    };

    const observerOptions = {
      root: this.settings.root,
      rootMargin: this.settings.rootMargin,
      threshold: this.settings.threshold
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    this.nodes.forEach(function(el) {
      el.classList.add("brz-initialized");

      observer.observe(el);

      el.addEventListener("animationend", ({ target }) => {
        target.classList.remove("brz-animate");
      });
    });
  };

  return Constructor;
})();

export { Animation };
