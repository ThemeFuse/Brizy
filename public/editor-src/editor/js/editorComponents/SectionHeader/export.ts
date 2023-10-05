import $ from "jquery";

// brzSticky is imported in export.js from Component/Sticky
export default function ($node: JQuery): void {
  // @ts-expect-error: brzSticky is not JQuery type
  $node.find(".brz-section__header--animated").brzSticky({
    type: "animated",
    refNode: function () {
      return $(this).closest(".brz-section__header").get(0);
    },
    onStickyChange: function (isSticky: boolean): void {
      const opened = "brz-section__header--animated-opened";
      const closed = "brz-section__header--animated-closed";

      if (isSticky) {
        this.classList.add(opened);
        this.classList.remove(closed);

        window.Brz.emit("elements.headerSticky.show", {
          node: this,
          type: "animated"
        });
      } else {
        this.classList.add(closed);
        this.classList.remove(opened);

        window.Brz.emit("elements.headerSticky.hide", {
          node: this,
          type: "animated"
        });
      }
    }
  });

  // @ts-expect-error: brzSticky is not JQuery type
  $node.find(".brz-section__header--fixed").brzSticky({
    type: "fixed",
    refNode: function () {
      return $(this).closest(".brz-section__header").get(0);
    },
    onStickyChange: function (isSticky: boolean): void {
      const $this = $(this);
      const $header = $this.closest(".brz-section__header");

      if (isSticky) {
        const marginTop = $this.children().css("marginTop");
        const height: number = $this.outerHeight() as number;
        const css: { height: number } = { height };

        if (parseInt(marginTop) < 0) {
          $header.css({ marginTop });
        }

        this.classList.add("brz-section__header--fixed-opened");
        $this.closest(".brz-section__header").css(css);

        window.Brz.emit("elements.headerSticky.show", {
          node: this,
          type: "fixed"
        });
      } else {
        this.classList.remove("brz-section__header--fixed-opened");
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
