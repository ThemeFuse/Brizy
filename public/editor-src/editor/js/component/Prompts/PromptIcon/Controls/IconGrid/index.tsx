import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SmartGrid from "visual/component/Prompts/common/SmartGrid";
import { getIconClassName, getTypes } from "visual/config/icons";
import { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { FCC } from "visual/utils/react/types";
import { LoadingSpinner } from "../LoadingSpinner";
import { Props } from "./types";

export const IconGrid: FCC<Props> = ({ icons, value, onChange, config }) => {
  const [gridSize, setGridSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const node = useRef<HTMLDivElement>(null);
  const activeIconIndex = icons.findIndex((icon) => icon.name === value.name);
  const rowCount = Math.floor(icons.length / 8) + 1;
  const activeRowIndex = Math.floor(activeIconIndex / 8);
  const prettyRowIndex = activeRowIndex === 0 ? 0 : activeRowIndex - 1;
  const _isPro = isPro(config);
  const _isWp = isWp(config);

  const typeIdsToNames = useMemo(() => {
    return getTypes(_isPro, _isWp).reduce<Record<string, string>>(
      (acc, { id, name }) => {
        acc[id] = name;
        return acc;
      },
      {}
    );
  }, [_isPro, _isWp]);

  useEffect(() => {
    if (node.current) {
      const { width, height } = node.current.getBoundingClientRect();
      setGridSize({ width, height });
    }
  }, []);

  if (!gridSize) {
    return (
      <div style={{ height: "100%" }} ref={node}>
        <LoadingSpinner />
      </div>
    );
  }

  const { width, height } = gridSize;
  const columnWidth = 68;
  const columnsInRow = 8;
  const rowHeight = 68;
  const gutter = 6;
  const initialScrollTop = prettyRowIndex * (68 + gutter);

  return (
    <SmartGrid
      width={width}
      height={height}
      columnCount={columnsInRow}
      columnWidth={columnWidth}
      rowCount={rowCount}
      rowHeight={rowHeight}
      gutter={gutter}
      initialScrollTop={initialScrollTop}
      renderItem={({ rowIndex, columnIndex, style }) => {
        const index = rowIndex * 8 + columnIndex;
        const icon = icons[index];

        if (!icon) {
          return <></>;
        }

        const { type, name } = {
          type: typeIdsToNames[icon.type],
          name: icon.name
        };
        const className = classNames("brz-ed-popup-icons__grid__item", {
          active: type === value.type && name === value.name
        });

        const styles = style
          ? {
              ...style,
              left: +(style.left ?? 0) + gutter,
              top: +(style.top ?? 0) + gutter,
              width: +(style.width ?? 0) - gutter,
              height: +(style.height ?? 0) - gutter
            }
          : {};

        return (
          <div
            style={styles}
            className={className}
            onClick={() => onChange({ type, name })}
          >
            <i
              className={classNames([
                "brz-font-icon",
                getIconClassName({
                  type,
                  name,
                  family: icon.family
                })
              ])}
            />
          </div>
        );
      }}
    />
  );
};
