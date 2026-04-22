import React, { ReactElement, useEffect } from "react";
import { CellComponentProps, Grid, useGridRef } from "react-window";
import { useIsRTL } from "visual/global/hooks";

type SmartGridProps = {
  height: number;
  width: number;
  columnCount: number;
  columnWidth: number;
  rowCount: number;
  rowHeight: number;
  initialScrollRow?: number;
  renderItem: (r: CellComponentProps) => ReactElement | null;
  style?: React.CSSProperties;
  gutter?: number;
};

const SmartGrid = (props: SmartGridProps): ReactElement => {
  const isRTL = useIsRTL();
  const {
    height,
    width,
    columnCount,
    columnWidth,
    rowCount,
    rowHeight,
    initialScrollRow = 0,
    renderItem,
    style = {},
    gutter = 0
  } = props;

  const gridRef = useGridRef(null);

  useEffect(() => {
    if (initialScrollRow <= 0) return;
    const rafId = requestAnimationFrame(() => {
      gridRef.current?.scrollToRow({
        index: initialScrollRow,
        align: "start",
        behavior: "instant"
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [initialScrollRow, gridRef]);

  return (
    <Grid
      gridRef={gridRef}
      cellComponent={renderItem}
      cellProps={{}}
      columnCount={columnCount}
      columnWidth={columnWidth + gutter}
      rowCount={rowCount}
      rowHeight={rowHeight + gutter}
      style={{ height, width, ...style }}
      dir={isRTL ? "rtl" : "ltr"}
      className="brz-smart-grid"
    />
  );
};

export default SmartGrid;
