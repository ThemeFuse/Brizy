import $ from "jquery";

// brzSticky is imported in export.js from Component/Sticky
export default function ($node) {
  $node.find(".brz-section__header--animated").brzSticky({
    type: "animated",
    refNode: function () {
      return $(this).closest(".brz-section__header").get(0);
    },
    onStickyChange: function (isSticky) {
      const opened = "brz-section__header--animated-opened";
      const closed = "brz-section__header--animated-closed";

      if (isSticky) {
        this.classList.add(opened);
        this.classList.remove(closed);
      } else {
        this.classList.add(closed);
        this.classList.remove(opened);
      }

      if (isSticky) {
        window.Brz.emit("elements.headerSticky.show", {
          node: this,
          type: "animated"
        });
      } else {
        window.Brz.emit("elements.headerSticky.hide", {
          node: this,
          type: "animated"
        });
      }
    }
  });
  $node.find(".brz-section__header--fixed").brzSticky({
    type: "fixed",
    refNode: function () {
      return $(this).closest(".brz-section__header").get(0);
    },
    onStickyChange: function (isSticky) {
      const $this = $(this);
      const $header = $(this).closest(".brz-section__header");

      if (isSticky) {
        const marginTop = $this.children().css("marginTop");
        const height = $this.outerHeight();
        const css = { height };

        if (parseInt(marginTop) < 0) {
          $header.css({ marginTop });
        }

        $this.addClass("brz-section__header--fixed-opened");
        $this.closest(".brz-section__header").css(css);

        window.Brz.emit("elements.headerSticky.show", {
          node: this,
          type: "fixed"
        });
      } else {
        $this.removeClass("brz-section__header--fixed-opened");
        $this.closest(".brz-section__header").css({ height: "auto" });
        $header.css({ marginTop: "" });

        window.Brz.emit("elements.headerSticky.hide", {
          node: this,
          type: "fixed"
        });
      }
    }
  });
}
