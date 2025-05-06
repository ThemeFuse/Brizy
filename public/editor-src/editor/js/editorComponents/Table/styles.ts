import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidthPercentOnly"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz &&:hover .brz-table__tr:nth-child(2n + 1) .brz-table__td": {
      standart: ["cssStyleBgColor"]
    },
    ".brz &&:hover .brz-table__tr:nth-child(even) .brz-table__td": {
      standart: ["cssStyleElementTableEvenBgColor"]
    },
    ".brz && .brz-table__td": {
      standart: ["cssStyleTablePadding"]
    },
    ".brz &&:hover .brz-table__td, .brz &&:hover .brz-table__th": {
      standart: ["cssStyleBorder"]
    },
    ".brz &&:not(.brz-table__disabled-tableAside) .brz-table__head > .brz-table__tr > .brz-table__aside:first-child":
      {
        standart: ["cssStyleElementTableAsideWidth"]
      },
    ".brz &&:not(.brz-table__disabled-tableAside) .brz-table__body > .brz-table__tr > .brz-table__aside:first-child":
      {
        standart: ["cssStyleElementTableAsideWidth"]
      },
    ".brz &&:not(.brz-table__custom--width) .brz-table__head .brz-table__aside":
      {
        standart: ["cssStyleElementTableAsideAutoWidth"]
      }
  };

  return renderStyles({ ...data, styles });
}
