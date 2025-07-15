import React, {
  ReactElement,
  Ref,
  RefCallback,
  forwardRef,
  useCallback
} from "react";
import Scrollbars from "react-custom-scrollbars";
import {
  FixedSizeGrid,
  GridChildComponentProps,
  ReactElementType
} from "react-window";
import { useIsRTL } from "visual/global/hooks";

type RefType = (r: Ref<ReactElement>) => void;

type CustomScrollbars = {
  onScroll: () => void;
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
  const refSetter = useCallback<RefCallback<Scrollbars>>(
    (scrollbarsRef) => {
      if (scrollbarsRef) {
        // @ts-expect-error: react-custom-scrollbars
        forwardedRef(scrollbarsRef.view);
      } else {
        forwardedRef(null);
      }
    },
    [forwardedRef]
  );

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
  const InnerElement: ReactElementType = forwardRef<
    HTMLDivElement,
    { style: CSSStyleRule }
  >(({ style, ...rest }, ref) => (
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
  ));

  InnerElement.displayName = "InnerElement";

  return InnerElement;
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
      direction={isRTL ? "rtl" : "ltr"}
    >
      {renderItem}
    </FixedSizeGrid>
  );
};

export default SmartGrid;
