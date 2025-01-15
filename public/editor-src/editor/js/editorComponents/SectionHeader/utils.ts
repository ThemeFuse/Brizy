import jQuery from "jquery";
import { t } from "visual/utils/i18n";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export const STICKY_ITEM_INDEX = 1;

export const fixedContainerPlus = ({
  fixed,
  node,
  height
}: {
  fixed: MValue<boolean>;
  node: HTMLElement | null;
  height?: Literal;
}): void => {
  if (!node) {
    return;
  }

  const $adderBlock = jQuery(node).siblings(".brz-ed-container-plus");

  if (fixed) {
    $adderBlock.addClass("brz-ed-container-plus--fixed").css({
      top: `${height}px`
    });
  } else {
    $adderBlock.removeClass("brz-ed-container-plus--fixed").css({
      top: "auto"
    });
  }
};

export const getToolbarTagsChoices = () => [
  { title: "Div", value: "div" },
  { title: t("Header"), value: "header" },
  { title: t("Footer"), value: "footer" },
  { title: t("Main"), value: "main" },
  { title: t("Article"), value: "article" },
  { title: t("Section"), value: "section" },
  { title: t("Aside"), value: "aside" },
  { title: t("Nav"), value: "nav" }
];
