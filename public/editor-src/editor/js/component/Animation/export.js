import $ from "jquery";

export default function() {
  var $animated = $(".brz-animated");

  if ($animated.length > 0) {
    var handleIntersection = function(entries) {
      entries.map(function(entry) {
        if (entry.intersectionRatio > 0) {
          var target = entry.target;
          var animateClassName = target.dataset.animateName;
          target.classList.add("brz-animate", animateClassName);
          observer.unobserve(target);
        }
      });
    };
    var observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.35
    };
    var observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    $animated.each(function() {
      var $this = $(this);
      var delay = $this.data("animate-delay");
      var duration = $this.data("animate-duration");

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
