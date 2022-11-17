import { useWindowSize } from "core/src/hooks";
import React, { ReactElement } from "react";
import { GridSimulatorData } from "./types";
import {
  gridSimulatorCellHeight,
  gridSimulatorCellWidth,
  gridSimulatorGridArea,
  gridSimulatorPatternHeight,
  gridSimulatorPatternWidth,
  windowContainerSizeWidth
} from "./utils";

export const SectionGridSimulator = (
  props: GridSimulatorData
): ReactElement => {
  const { data } = props;
  const size = useWindowSize();

  // New Object for Pattern
  const dataForPattern = windowContainerSizeWidth(data, size.width);

  // Grid Cell Width
  const gridCellWidth = gridSimulatorCellWidth(dataForPattern);

  // Grid Cell Height
  const gridCellHeight = gridSimulatorCellHeight(dataForPattern);

  // Grid Pattern Width
  const gridPatternWidth = gridSimulatorPatternWidth(dataForPattern);

  // Grid Pattern Height
  const gridPatternHeight = gridSimulatorPatternHeight(dataForPattern);

  // Grid Area
  const gridArea = gridSimulatorGridArea(dataForPattern);

  return (
    <div
      style={{ gridArea }}
      className="hidden group-[.brz-ed-draggable-section-grid--resizer-active]:block"
    >
      <svg width="100%" height="100%">
        <pattern
          id="section-grid"
          x="0"
          y="0"
          width={gridPatternWidth}
          height={gridPatternHeight}
          patternUnits="userSpaceOnUse"
        >
          <rect
            style={{
              width: gridCellWidth,
              height: gridCellHeight
            }}
            x="0"
            y="0"
            rx="3"
            strokeWidth="1"
            stroke="#CCCCCC"
            fill="#F2F2F240"
          />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#section-grid)"
        />
      </svg>
    </div>
  );
};
