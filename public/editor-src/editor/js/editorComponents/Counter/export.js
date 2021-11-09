import $ from "jquery";

var elements = [];
export default function($node) {
  const isStory = $node.find(".brz-story").length > 0;

  if (isStory) {
    const $slider = $node.find(".brz-slick-slider");

    $slider.on("afterChange init", function(e, slick) {
      const { currentSlide, $slides } = slick;
      const $currentSlide = $slides[currentSlide];

      $($currentSlide)
        .find(".brz-counter")
        .each(function() {
          var $this = $(this);

          animate({
            elem: this,
            start: $this.attr("data-start"),
            end: $this.attr("data-end"),
            duration: $this.attr("data-duration"),
            separator: $this.attr("data-separator")
          });
        });
    });
  } else {
    $node.find(".brz-counter").each(function() {
      var $this = $(this);
      elements.push({
        elem: this,
        start: $this.attr("data-start"),
        end: $this.attr("data-end"),
        duration: $this.attr("data-duration"),
        separator: $this.attr("data-separator")
      });

      $this.addClass("brz-initialized");
    });

    $(document).on("brz.popup.show", onScroll);
    document.addEventListener("scroll", onScroll);
    onScroll();
  }
}

function formatNumber(number, separator) {
  var splitNum;
  number = number.toFixed(0);
  splitNum = number.split(".");
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return splitNum.join("-");
}

function isScrolledIntoView(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  return isVisible;
}

function animate(value) {
  const { elem, separator } = value;
  var $figures = $(elem).find(".brz-counter-figures .brz-counter-numbers");
  var $chart = $(elem).find(".brz-counter-pie-chart");

  const endNumber = Number(value.end);
  const end = $chart.length ? Math.max(0, Math.min(100, endNumber)) : endNumber;

  var step = function(countNum) {
    $figures.text(formatNumber(countNum, separator));
    $chart &&
      $chart.css("stroke-dasharray", "calc(" + countNum + " + 0.5) 100");
  };

  $({ countNum: Number(value.start) }).animate(
    { countNum: end },
    {
      duration: Number(value.duration * 1000),
      easing: "linear",

      step: function() {
        step(this.countNum);
      },

      complete: function() {
        step(end);
      }
    }
  );
}

function onScroll() {
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
}
