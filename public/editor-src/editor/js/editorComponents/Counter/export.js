import $ from "jquery";

export default function() {
  var elements = [];

  $(".brz-counter").each(function() {
    var $this = $(this);
    elements.push({
      elem: this,
      start: $this.attr("data-start"),
      end: $this.attr("data-end"),
      duration: $this.attr("data-duration")
    });
  });

  var isScrolledIntoView = function(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    return isVisible;
  };

  var animate = function(value) {
    $({ countNum: Number(value.start) }).animate(
      {
        countNum: Number(value.end)
      },
      {
        duration: Number(value.duration * 1000),
        easing: "linear",

        step: function() {
          $(value.elem).text(Math.floor(this.countNum));
        },

        complete: function() {
          $(value.elem).text(this.countNum);
        }
      }
    );
  };

  var onScroll = function() {
    elements = elements.filter(function(value) {
      if (isScrolledIntoView(value.elem)) {
        animate(value);
        return false;
      }
      return true;
    });

    if (!elements.length) {
      document.removeEventListener("scroll", onScroll);
    }
  };

  document.addEventListener("scroll", onScroll);
  onScroll();
}
