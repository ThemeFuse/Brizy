import $ from "jquery";
import "jquery.mmenu";

export default function($node) {
  $node.find("[data-mmenu-id]").each(function() {
    var $this = $(this);
    var mmenuId = $this.data().mmenuId;
    var mmenuPosition = $this.data().mmenuPosition;
    var mmenuTitle = $this.data().mmenuTitle;
    var $icon = $this.children(".brz-mm-menu__icon");

    var menuAPI = $(mmenuId)
      .mmenu(
        {
          extensions: [
            "theme-dark",
            "pagedim-black",
            "border-full",
            "position-front",
            mmenuPosition
          ],
          slidingSubmenus: false,
          navbar: {
            title: mmenuTitle
          }
        },
        {
          offCanvas: {
            menu: {
              insertSelector: ".brz-root__container"
            },
            page: {
              wrapIfNeeded: false,
              pageSelector: ".brz-root__container"
            }
          }
        }
      )
      .data("mmenu");

    $icon.on("click", function() {
      menuAPI.open();
    });
  });
}
