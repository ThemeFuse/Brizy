import $ from "jquery";

export default function($node) {
  const $animated = $node.find(".brz-animated");

  if ($animated.length > 0) {
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
      root: null,
      rootMargin: "0px",
      threshold: [0]
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    $animated.each(function() {
      const $this = $(this);

      $this.addClass("brz-initialized");

      observer.observe(this);
    });

    $animated.on("animationend", ({ target }) => {
      target.classList.remove("brz-animate");
    });
  }
}
