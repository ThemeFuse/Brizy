import $ from "jquery";
import "./lib/jquery.background-video";
import "./lib/jquery.parallax";

const getCurrentDevice = () => {
  const { innerWidth } = window;
  let device = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};

export default function ($node) {
  const $parallax = $node.find(".brz-bg-image-parallax");

  if ($parallax.length > 0) {
    const $parallaxContainers = $parallax.closest(".brz-bg");
    const initialDeviceMode = getCurrentDevice();

    if (initialDeviceMode === "desktop") {
      $parallaxContainers.parallax({
        bgClass: "brz-bg-image-parallax"
      });
    }

    $(window).on("resize", function () {
      const device = getCurrentDevice();

      if (device === "desktop") {
        $parallaxContainers.parallax({
          bgClass: "brz-bg-image-parallax"
        });
      } else {
        $parallaxContainers.parallax("destroy");
      }
    });

    // when some of element popup, mmenu opened
    // wee need stop parallax
    const openedElements = ["elements.mmenu.open", "elements.popup.open"];
    openedElements.forEach((id) => {
      window.Brz.on(id, (element) => {
        if (id === "elements.popup.open") {
          // need to check scroll behance
          const { scroll_page = "false" } = element.dataset;
          const isScrolled = scroll_page === "true";

          if (isScrolled) {
            return;
          }

          $parallaxContainers.parallax("paused", true);
        } else {
          $parallaxContainers.parallax("paused", true);
        }
      });
    });

    // start parallaxes
    const closedElements = ["elements.mmenu.close", "elements.popup.close"];
    closedElements.forEach((id) => {
      window.Brz.on(id, (element) => {
        if (id === "elements.popup.close") {
          // need to check scroll behance
          const { scroll_page = "false" } = element.dataset;
          const isScrolled = scroll_page === "true";

          if (isScrolled) {
            return;
          }

          $parallaxContainers.parallax("paused", false);
        } else {
          $parallaxContainers.parallax("paused", false);
        }
      });
    });
  }

  $node.find(".brz-bg-video").each(function () {
    const $this = $(this);
    const { type, loop, start } = $this.data();

    $this.backgroundVideo({ type, loop, start });

    window.Brz.on("elements.story.init", (element) => {
      if (element.contains($this.get(0))) {
        $this.backgroundVideo("typeChange", { type, loop, start });
      }
    });
  });
}
