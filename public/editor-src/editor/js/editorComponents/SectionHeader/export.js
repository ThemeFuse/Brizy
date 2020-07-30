import $ from "jquery";

// brzSticky is imported in export.js from Component/Sticky
export default function($node) {
  $node.find(".brz-section__header--animated").brzSticky({
    type: "animated",
    refNode: function() {
      return $(this)
        .closest(".brz-section__header")
        .get(0);
    },
    onStickyChange: function(isSticky) {
      $(this).toggleClass("brz-section__header--animated-closed", !isSticky);
      $(this).toggleClass("brz-section__header--animated-opened", isSticky);

      if (isSticky) {
        window.Brizy.emit("elements.headerSticky.show", {
          node: this,
          type: "animated"
        });
      } else {
        window.Brizy.emit("elements.headerSticky.hide", {
          node: this,
          type: "animated"
        });
      }
    }
  });
  $node.find(".brz-section__header--fixed").brzSticky({
    type: "fixed",
    refNode: function() {
      return $(this)
        .closest(".brz-section__header")
        .get(0);
    },
    onStickyChange: function(isSticky) {
      var $this = $(this);

      if (isSticky) {
        $this.addClass("brz-section__header--fixed-opened");
        $this.closest(".brz-section__header").css({
          height: $this.outerHeight()
        });

        window.Brizy.emit("elements.headerSticky.show", {
          node: this,
          type: "fixed"
        });
      } else {
        $this.removeClass("brz-section__header--fixed-opened");
        $this.closest(".brz-section__header").css({
          height: "auto"
        });

        window.Brizy.emit("elements.headerSticky.hide", {
          node: this,
          type: "fixed"
        });
      }
    }
  });
}
