import $ from "jquery";
import MMenu from "../../libs/mmenu/custom-build/mmenu";

export default function() {
  $("[data-mmenu-id]").each(function() {
    const $this = $(this);
    const mmenuId = $this.data().mmenuId;
    const mmenuPosition = $this.data().mmenuPosition;
    const mmenuTitle = $this.data().mmenuTitle;
    const $icon = $this.children(".brz-mm-menu__icon");
    const options = {
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
    };
    const config = {
      offCanvas: {
        menu: {
          insertSelector: ".brz-root__container"
        },
        page: {
          wrapIfNeeded: false,
          selector: ".brz-root__container"
        }
      }
    };

    const menu = new MMenu(mmenuId, options, config);
    const menuAPI = menu.API;

    $icon.on("click", function() {
      menuAPI.open();
    });
  });
}
