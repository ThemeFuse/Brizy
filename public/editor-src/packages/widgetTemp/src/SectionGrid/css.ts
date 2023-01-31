import {
  styleElementSectionContainerSize,
  styleElementSectionContainerType
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { getHorizontalGap, getRowsNr, getVerticalGap } from "./model";
import { gridCellHeight, gridCellWidth } from "./utils";

export function cssTemplateColumns({ v, device, state }: CSSValue): string {
  // Grid Cell Width
  const cellWidth = gridCellWidth({
    containerType: styleElementSectionContainerType({ v, device, state }),
    containerSize: styleElementSectionContainerSize({ v, device, state }),
    gridHorizontalGap: getHorizontalGap({ v, device, state })
  });

  return `grid-template-columns: minmax(0, 1fr) repeat(24, minmax(0, ${cellWidth})) minmax(0, 1fr);`;
}

export function cssRowsNr({ v, device, state }: CSSValue): string {
  const gridRowsNr = getRowsNr({ v, device, state });

  // Grid Cell Height
  const cellHeight = gridCellHeight({
    containerType: styleElementSectionContainerType({ v, device, state }),
    containerSize: styleElementSectionContainerSize({ v, device, state }),
    gridHorizontalGap: getHorizontalGap({
      v,
      device,
      state
    })
  });

  return `grid-template-rows:repeat(${gridRowsNr}, ${cellHeight});`;
}

export function cssHorizontalGap({ v, device, state }: CSSValue): string {
  const gridHorizontalGap = getHorizontalGap({
    v,
    device,
    state
  });

  return `grid-column-gap:${gridHorizontalGap}px;`;
}

export function cssVerticalGap({ v, device, state }: CSSValue): string {
  const gridVerticalGap = getVerticalGap({
    v,
    device,
    state
  });

  return `grid-row-gap:${gridVerticalGap}px;`;
}
