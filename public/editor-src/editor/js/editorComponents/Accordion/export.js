import { noop } from "es-toolkit";
import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr } from "visual/utils/i18n/attribute";
import { AccordionAccessibility } from "../accessibility";
import {
  animateScrollTop,
  collapse,
  expand,
  getInnerHeight,
  getOffsetTop,
  hasTag,
  indexOf,
  siblings
} from "./utils";

const activeClassName = "brz-accordion__item--active";
let accordionInstance = 0;

export default function (node) {
  const accordions = new Map();

  node.querySelectorAll(".brz-accordion").forEach((accordion) => {
    const accordionNavItems = Array.from(
      accordion.querySelectorAll(
        ":scope > .brz-accordion__item > .brz-accordion__nav"
      )
    );
    const accordionFilters = Array.from(
      accordion.querySelectorAll(".brz-accordion__filter-wrapper")
    );
    const collapsible =
      accordionNavItems[0]?.getAttribute(makeAttr("collapsible")) ?? undefined;
    const duration = Number(accordion.dataset.brzDuration || 0);
    const contents = Array.from(
      accordion.querySelectorAll(
        ":scope > .brz-accordion__item > .brz-accordion__content"
      )
    );
    const instanceId = accordionInstance++;
    const accordionAccessibility = new AccordionAccessibility({
      items: Array.from(
        accordion.querySelectorAll(":scope > .brz-accordion__item")
      )
        .map((item, index) => {
          const button = item.querySelector(":scope > .brz-accordion__nav");
          const panel = item.querySelector(":scope > .brz-accordion__content");

          if (
            !(button instanceof HTMLElement) ||
            !(panel instanceof HTMLElement)
          ) {
            return null;
          }

          const buttonId = `brz-accordion-button-${instanceId}-${index}`;
          const panelId = `brz-accordion-panel-${instanceId}-${index}`;

          button.setAttribute("id", buttonId);
          button.setAttribute("aria-controls", panelId);
          panel.setAttribute("id", panelId);
          panel.setAttribute("role", "region");
          panel.setAttribute("aria-labelledby", buttonId);

          return {
            item,
            button,
            panel,
            keepOnePanelOpen:
              button.getAttribute(makeAttr("collapsible")) === "on",
            api: {
              open: noop,
              close: noop,
              toggle: () => button.click(),
              isOpen: () => item.classList.contains(activeClassName)
            }
          };
        })
        .filter(Boolean),
      filterButtons: Array.from(
        accordion.querySelectorAll(
          ".brz-accordion__filter__button, .brz-accordion__filter__item"
        )
      )
    });

    accordionAccessibility.init();

    const onNavClick = (nav) => {
      const item = nav.closest(".brz-accordion__item");
      const itemContent = item.querySelector(
        ":scope > .brz-accordion__content"
      );
      const itemIndex = accordionFilters.length
        ? indexOf(item) - 1
        : indexOf(item);

      // need to calculate inner elements height
      // it's needed for animation
      const heights = contents.map((node) => {
        const child = node.firstElementChild;
        return child ? child.getBoundingClientRect().height : 0;
      });

      // when animation is done wee need
      // 1. emit.accordion.changed
      // 2. need to see if offset top of elements is outside of viewport
      const handleAnimationComplete = () => {
        // Emit Accordion Changed
        const offsetTop = getOffsetTop(item);
        window.Brz.emit("elements.accordion.changed", accordion, {
          active: item,
          tabs: siblings(item)
        });

        const stickyHeader = document.querySelector(
          ".brz-section__header-sticky-item"
        );
        const stickyHeaderHeight = stickyHeader
          ? getInnerHeight(stickyHeader)
          : 0;

        // verify if content is outside of viewport
        if (window.scrollY > offsetTop) {
          animateScrollTop(offsetTop - stickyHeaderHeight);
        }
      };

      if (collapsible === "on") {
        if (item.classList.contains(activeClassName)) {
          return;
        }

        // animation
        siblings(item)
          .flatMap((sibling) =>
            Array.from(
              sibling.querySelectorAll(":scope > .brz-accordion__content")
            )
          )
          .forEach((node, idx) => {
            const activeNode = node.closest(".brz-accordion__item--active");

            if (activeNode) {
              const height = heights[idx];
              expand(node, {
                height,
                duration,
                onFinish: handleAnimationComplete
              });
              activeNode.classList.remove(activeClassName);
            }
          });

        const height = heights[itemIndex];
        collapse(itemContent, {
          height,
          duration,
          onFinish: handleAnimationComplete
        });

        item.classList.add(activeClassName);
      } else {
        const height = heights[itemIndex];

        if (item.classList.contains(activeClassName)) {
          expand(itemContent, {
            height,
            duration,
            onFinish: handleAnimationComplete
          });
          item.classList.remove(activeClassName);
        } else {
          collapse(itemContent, {
            height,
            duration,
            onFinish: handleAnimationComplete
          });
          item.classList.add(activeClassName);
        }
      }

      accordionAccessibility.sync();
    };

    const onFilterClick = (filterWrapper, target) => {
      const hiddenClassName = "brz-accordion__hidden";
      const filterActiveClassName = "brz-accordion__filter__item--active";
      const filterItem = target.closest(".brz-accordion__filter__item");

      // Active Tag
      if (filterItem && !filterItem.classList.contains(filterActiveClassName)) {
        filterItem.classList.add(filterActiveClassName);
        siblings(filterItem).forEach((sibling) => {
          sibling.classList.remove(filterActiveClassName);
        });
      }

      if (filterItem) {
        const { brzFilter } = filterItem.dataset;
        const wrapperSiblings = siblings(filterWrapper);

        if (brzFilter === "*") {
          wrapperSiblings.forEach((sibling) => {
            sibling.classList.remove(hiddenClassName);
          });
        } else {
          wrapperSiblings.forEach((sibling) => {
            sibling.classList.add(hiddenClassName);
          });
          new Set(wrapperSiblings.flatMap(siblings)).forEach((sibling) => {
            if (hasTag(sibling, `${brzFilter}`)) {
              sibling.classList.remove(hiddenClassName);
            }
          });
        }
      }

      accordionAccessibility.sync();
    };

    accordions.set(accordion, { onNavClick, onFilterClick });
  });

  onBodyClick([
    {
      selector: ".brz-accordion__nav",
      handler: (nav) => {
        accordions.get(nav.closest(".brz-accordion"))?.onNavClick(nav);
      }
    },
    {
      selector: ".brz-accordion__filter-wrapper",
      handler: (filterWrapper, { target }) => {
        accordions.forEach((state, accordion) => {
          if (accordion.contains(filterWrapper)) {
            state.onFilterClick(filterWrapper, target);
          }
        });
      }
    }
  ]);
}
