import React, { useCallback, forwardRef, ReactElement, Ref } from "react";
import {
  FixedSizeGrid,
  GridChildComponentProps,
  ReactElementType
} from "react-window";
import Scrollbars from "react-custom-scrollbars";

type RefType = (r: Ref<ReactElement>) => void;

type CustomScrollbars = {
  onScroll: () => {};
  forwardedRef: RefType;
  style: StyleSheet;
  children?: ReactElement;
};

type SmartGridProps = {
  height: number;
  width: number;
  columnCount: number;
  columnWidth: number;
  rowCount: number;
  rowHeight: number;
  initialScrollTop: number;
  renderItem: (r: GridChildComponentProps) => ReactElement;
  style?: StyleSheet;
  gutter?: number;
};

const CustomScrollbars = ({
  onScroll,
  forwardedRef,
  style,
  children
}: CustomScrollbars): ReactElement => {
  const refSetter = useCallback(scrollbarsRef => {
    if (scrollbarsRef) {
      forwardedRef(scrollbarsRef.view);
    } else {
      forwardedRef(null);
    }
  }, []);

  return (
    <Scrollbars
      ref={refSetter}
      style={{ ...style, overflow: "hidden" }}
      onScroll={onScroll}
    >
      {children}
    </Scrollbars>
  );
};

const CustomScrollbarsVirtualList = forwardRef(
  (props: CustomScrollbars, ref: unknown): ReactElement => (
    <CustomScrollbars {...props} forwardedRef={ref as RefType} />
  )
);
CustomScrollbarsVirtualList.displayName = "CustomScrollbarsVirtualList";

const CustomInnerElementType = (gutter: number): ReactElementType => {
  const InnerElement: ReactElementType = forwardRef(
    ({ style, ...rest }, ref) => (
      <div
        ref={ref}
        style={{
          ...style,
          paddingLeft: gutter,
          paddingTop: gutter,
          marginBottom: gutter
        }}
        {...rest}
      />
    )
  );

  InnerElement.displayName = "InnerElement";

  return InnerElement;
};

const SmartGrid: React.FC<SmartGridProps> = (
  props: SmartGridProps
): ReactElement => {
  const {
    height,
    width,
    columnCount,
    columnWidth,
    rowCount,
    rowHeight,
    initialScrollTop,
    renderItem,
    style = {},
    gutter = 0
  } = props;

  return (
    <FixedSizeGrid
      height={height}
      width={width}
      columnCount={columnCount}
      columnWidth={columnWidth + gutter}
      rowCount={rowCount}
      rowHeight={rowHeight + gutter}
      style={style}
      initialScrollTop={initialScrollTop}
      outerElementType={CustomScrollbarsVirtualList}
      innerElementType={CustomInnerElementType(gutter)}
    >
      {renderItem}
    </FixedSizeGrid>
  );
};

export default SmartGrid;
