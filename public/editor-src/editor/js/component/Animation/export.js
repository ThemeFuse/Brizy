import $ from "jquery";

export default function($node) {
  const $animated = $node.find(".brz-animated");

  if ($animated.length > 0) {
    const handleIntersection = function(entries) {
      entries.map(function(entry) {
        if (entry.intersectionRatio > 0) {
          let target = entry.target;
          const animateClassName = target.dataset.animateName;
          target.classList.add("brz-animate", animateClassName);
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
      const delay = $this.data("animate-delay");
      const duration = $this.data("animate-duration");

      $this.addClass("brz-initialized");

      if (delay) {
        $this.css({
          "-webkit-animation-delay": delay + "ms",
          "animation-delay": delay + "ms"
        });
      }

      if (duration) {
        $this.css({
          "-webkit-animation-duration": duration + "ms",
          "animation-duration": duration + "ms"
        });
      }

      observer.observe(this);
    });
  }
}
