import $ from "jquery";
import { getProLibs } from "visual/libs";
import Gallery, { Settings } from "visual/libs/gallery";
import { decodeFromString } from "visual/utils/string";
import { IsotopeSettings, JustifySettings } from "./utils";
import {
  arrangeGridByTags,
  isJustified,
  removeUselessInfo
} from "./utils.export";

export default function ($node: JQuery): void {
  const { Isotope, ImagesLoaded, Gallery } = getProLibs();

  if (!Isotope || !ImagesLoaded || !Gallery) {
    return;
  }

  const root = $node.get(0);

  if (!root) {
    return;
  }

  // Isotope
  root.querySelectorAll(".brz-image__gallery").forEach((item) => {
    const _this = item;
    const wrapper = item.querySelector<HTMLElement>(
      ".brz-image__gallery-wrapper"
    );

    let iso: Isotope;
    let galleryInstance: Gallery;

    // masonry is default layout type, is used in case which we can't decode settings
    // from data attribute
    let layoutType = "masonry";

    const settings = wrapper?.getAttribute("data-settings");
    const bigImageWrapper = _this.querySelector<HTMLElement>(
      ".brz-image__gallery-big-image"
    );

    try {
      if (settings) {
        const _settings = decodeFromString<JustifySettings | IsotopeSettings>(
          settings
        );

        const { type, settings: gallerySettings } = _settings;

        if (wrapper && type) {
          layoutType = type;
          switch (type) {
            case "masonry":
              ImagesLoaded(wrapper, () => {
                // init Isotope after all images have loaded
                iso = new Isotope(wrapper, gallerySettings ?? {});

                // add isotope for data attr uses in tabs and accordion
                // need to find alternative for "data" method, because dataset set [object Object]
                $(wrapper).data("isotope", iso);

                window.Brz.emit("elements.gallery.changed", wrapper, {
                  type: "masonry"
                });
              });
              break;
            case "justified":
              ImagesLoaded(wrapper, () => {
                galleryInstance = new Gallery(
                  wrapper,
                  gallerySettings as Settings
                );

                window.Brz.emit("elements.gallery.changed", wrapper, {
                  type: "justified"
                });
              });

              window.addEventListener("resize", () => {
                if (galleryInstance) {
                  ImagesLoaded(wrapper, () => {
                    galleryInstance.arrange();
                  });
                }
              });
              break;
          }
        }
      }
    } catch (error) {
      return;
    }

    const items = [
      ..._this.querySelectorAll<HTMLElement>(".brz-image__gallery-item")
    ];

    if (bigImageWrapper) {
      const bigImage = bigImageWrapper.querySelector("img");

      const imageItems = Array.from(items).filter((item) =>
        item.querySelector("picture > img")
      );

      let currentIndex = 0;
      let imagesSrc: string[] = [];
      try {
        imagesSrc = decodeFromString<string[]>(
          bigImageWrapper.getAttribute("data-images") ?? "[]"
        ).filter(Boolean);
      } catch (error) {
        return;
      }

      const lightBox = bigImageWrapper.getAttribute("data-lightbox");
      const links = bigImageWrapper.querySelectorAll<HTMLElement>(
        ".brz-image__gallery-big-image-lightbox"
      );

      if (imageItems && imageItems.length && imagesSrc.length && bigImage) {
        removeUselessInfo(bigImageWrapper);

        if (lightBox === "on") {
          imageItems.forEach((item, index) => {
            item.onclick = () => {
              bigImage.src = imagesSrc[index];
              currentIndex = index;
            };
          });
          // small hack to open lightBox by click on bigImage
          bigImageWrapper.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (links[currentIndex]) {
              links[currentIndex].click();
            }
          };

          // @ts-expect-error magnificPopup have no types
          $(bigImageWrapper).magnificPopup({
            delegate: "a",
            type: "image",
            gallery: {
              enabled: true
            }
          });
        } else {
          imageItems.forEach((item, index) => {
            item.onclick = () => {
              if (imagesSrc[index]) {
                bigImage.src = imagesSrc[index];
              }
            };
          });
        }
      }
    }

    if (_this) {
      const galleryFilter = _this.querySelector<HTMLElement>(
        "ul.brz-image__gallery-filter"
      );

      if (galleryFilter) {
        const child = galleryFilter.firstChild as HTMLElement | null;

        if (child) {
          child.classList.add("brz-image__gallery-filter__item--active");
        }
      }
    }

    const filterWrapper = _this.querySelector(
      ".brz-image__gallery--filter-wrapper"
    );

    if (filterWrapper) {
      const activeClass = "brz-image__gallery-filter__item--active";
      filterWrapper
        .querySelectorAll<HTMLElement>(".brz-image__gallery-filter__item")
        .forEach((node: HTMLElement) => {
          node.addEventListener("click", () => {
            const { filter = "*" } = node.dataset;

            const _filter = filter === "*" ? "*" : filter;

            if (!node.classList.contains(activeClass)) {
              const currentActive = filterWrapper.querySelector(
                `.${activeClass}`
              );

              if (currentActive) {
                currentActive.classList.remove(activeClass);
              }

              node.classList.add(activeClass);

              if (layoutType === "grid") {
                arrangeGridByTags(_filter, items);
              }

              if (iso && !isJustified(layoutType)) {
                iso.arrange({
                  filter: filter === "*" ? "*" : `.${filter}`
                });
              }

              if (galleryInstance && isJustified(layoutType)) {
                galleryInstance.arrange({
                  filter: _filter
                });
              }
            }
          });
        });
    }

    // Need rearrange when changed some of elements [tabs, accordion, ... ]
    const elements = [
      "elements.tabs.changed",
      "elements.accordion.changed",
      "elements.switcher.changed"
    ];

    elements.forEach((id: string) => {
      window.Brz.on(id, (element: HTMLElement) => {
        if (iso && element && element.contains(_this)) {
          iso.arrange({});
        }
        if (galleryInstance && element && element.contains(_this)) {
          galleryInstance.arrange();
        }
      });
    });
  });

  // MagnificPopup
  root.querySelectorAll(".brz-image__gallery-lightbox").forEach((item) => {
    const aTag = item.querySelectorAll(
      ".brz-image__gallery-item  .brz-image > a"
    );

    aTag.forEach((img, index) => {
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        $(item)
          // @ts-expect-error magnificPopup have no types
          .magnificPopup({
            delegate: "a",
            type: "image",
            gallery: {
              enabled: true
            },
            mainClass: "brz brz-lightbox"
          })
          .magnificPopup("open")
          .magnificPopup("goTo", index);
      });
    });
  });
}
