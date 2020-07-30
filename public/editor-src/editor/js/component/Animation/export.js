import $ from "jquery";

export default function($node) {
  const $animated = $node.find(".brz-animated");

  if ($animated.length > 0) {
    const handleIntersection = function(entries) {
      entries.map(function(entry) {
        if (entry.intersectionRatio > 0) {
          let target = entry.target;
          target.classList.add("brz-animate");
          observer.unobserve(target);
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
  }
}
