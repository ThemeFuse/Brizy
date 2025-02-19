import React, { Component, ForwardedRef, ReactNode, RefObject } from "react";
import {
  calcMaxHeightBasedOnWidth,
  calcRectangleSide,
  calcRectangleSize
} from "visual/component/BoxResizer/utils";
import ClickOutside from "visual/component/ClickOutside";
import { DraggableDiv } from "visual/component/DraggableDiv";
import { clamp } from "visual/utils/math";
import { attachRefs } from "visual/utils/react";
import { Patch, Point, RestrictionMapping, SimpleRestriction } from "./types";

interface State {
  showPoints: boolean;
}

interface Props {
  keepAspectRatio: boolean;
  points: Point[];
  restrictions?: SimpleRestriction;
  isHorizontalCenterAligned: boolean;
  isVerticalCenterAligned: boolean;
  getValue: () => RestrictionMapping;
  children: ReactNode;
  onStart?: () => void;
  onEnd?: () => void;
  onChange: (data: Patch) => void;
  containerRef: ForwardedRef<HTMLElement>;
}

interface DragInfo {
  deltaX: number;
  deltaY: number;
}

interface DragHandler {
  (dragInfo: DragInfo): void;
}

export class Resizer extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    keepAspectRatio: false,
    points: [
      "topCenter",
      "topRight",
      "centerRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
      "centerLeft",
      "topLeft"
    ],
    isHorizontalCenterAligned: false,
    isVerticalCenterAligned: false
  };

  state = {
    showPoints: false
  };

  contentRef = React.createRef<HTMLDivElement>();

  startValue?: RestrictionMapping;

  startRect?: DOMRect;

  handleClick = (): void => {
    this.setState({ showPoints: true });
  };

  handleClickOutside = (): void => {
    if (this.state.showPoints) {
      this.setState({ showPoints: false });
    }
  };

  handleDragStart = (): void => {
    this.startValue = this.props.getValue();

    const node = this.contentRef.current;
    if (node) {
      this.startRect = node.getBoundingClientRect();
    }

    this.props.onStart?.();
  };

  handleDragEnd = (): void => {
    this.startValue = undefined;
    this.startRect = undefined;

    this.props.onEnd?.();
  };

  handleDrag(point: Point, { deltaX, deltaY }: DragInfo): void {
    if (!this.startValue || !this.startRect) {
      return;
    }

    const {
      restrictions,
      isHorizontalCenterAligned,
      isVerticalCenterAligned,
      keepAspectRatio
    } = this.props;
    const value = this.props.getValue();
    const horizontalDeltaMultiplier = isHorizontalCenterAligned ? 2 : 1;
    const verticalDeltaMultiplier = isVerticalCenterAligned ? 2 : 1;
    const startValue = this.startValue;
    const startRect = this.startRect;

    let patchData: [
      keyof SimpleRestriction,
      number | { dx: number; dy: number }
    ][];
    switch (point) {
      case "topCenter":
        patchData = [["height", -deltaY * verticalDeltaMultiplier]];
        break;
      case "bottomCenter":
        patchData = [["height", deltaY * verticalDeltaMultiplier]];
        break;
      case "centerLeft": {
        patchData = [["width", -deltaX * horizontalDeltaMultiplier]];
        break;
      }
      case "centerRight": {
        patchData = [["width", deltaX * horizontalDeltaMultiplier]];
        break;
      }
      case "topLeft": {
        const valueHasSize = Boolean(value.size);
        const dx = -deltaX * horizontalDeltaMultiplier;
        const dy = -deltaY * verticalDeltaMultiplier;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [
              ["width", dx],
              ["height", dy]
            ];
        break;
      }
      case "bottomLeft": {
        const valueHasSize = Boolean(value.size);
        const dx = -deltaX * horizontalDeltaMultiplier;
        const dy = deltaY * verticalDeltaMultiplier;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [
              ["width", dx],
              ["height", dy]
            ];
        break;
      }
      case "topRight": {
        const valueHasSize = Boolean(value.size);
        const dx = deltaX * horizontalDeltaMultiplier;
        const dy = -deltaY * verticalDeltaMultiplier;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [
              ["width", dx],
              ["height", dy]
            ];
        break;
      }
      case "bottomRight": {
        const valueHasSize = Boolean(value.size);
        const dx = deltaX * horizontalDeltaMultiplier;
        const dy = deltaY * verticalDeltaMultiplier;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [
              ["width", dx],
              ["height", dy]
            ];
        break;
      }
    }

    const patch = patchData.reduce(
      (acc, [key, delta], _i, arr) => {
        const kValue = startValue[key];

        if (kValue === undefined) {
          return acc;
        }

        const min = restrictions?.[key]?.min ?? 0;
        let max = restrictions?.[key]?.max ?? Infinity;

        let offset;
        const isSizeChanging = arr.length === 2;
        if (keepAspectRatio && isSizeChanging) {
          const [, dx, , dy] = patchData.flat();
          delta = { dx, dy } as { dx: number; dy: number };

          offset = calcRectangleSize(
            kValue,
            startRect.width,
            startRect.height,
            delta
          );

          if (key === "height" && startValue.width) {
            max = calcMaxHeightBasedOnWidth(
              restrictions?.width?.max || Infinity,
              startRect.width,
              startRect.height,
              startValue.width,
              kValue
            );
          }
        } else {
          offset =
            typeof delta === "number"
              ? calcRectangleSide(
                  kValue,
                  startRect[key as "width" | "height"],
                  delta
                )
              : calcRectangleSize(
                  kValue,
                  startRect.width,
                  startRect.height,
                  delta
                );
        }

        acc[key] = clamp(Math.round(kValue + offset), min, max);

        return acc;
      },
      {} as Patch["patch"]
    );

    this.props.onChange({ patch, deltaX, deltaY, point, startRect });
  }

  handleTopCenterDrag: DragHandler = (dragInfo) =>
    this.handleDrag("topCenter", dragInfo);

  handleBottomCenterDrag: DragHandler = (dragInfo) =>
    this.handleDrag("bottomCenter", dragInfo);

  handleCenterLeftDrag: DragHandler = (dragInfo) =>
    this.handleDrag("centerLeft", dragInfo);

  handleCenterRightDrag: DragHandler = (dragInfo) =>
    this.handleDrag("centerRight", dragInfo);

  handleTopLeftDrag: DragHandler = (dragInfo) =>
    this.handleDrag("topLeft", dragInfo);

  handleTopRightDrag: DragHandler = (dragInfo) =>
    this.handleDrag("topRight", dragInfo);

  handleBottomLeftDrag: DragHandler = (dragInfo) =>
    this.handleDrag("bottomLeft", dragInfo);

  handleBottomRightDrag: DragHandler = (dragInfo) =>
    this.handleDrag("bottomRight", dragInfo);

  render(): React.ReactNode {
    const { showPoints } = this.state;
    const { points, children, containerRef } = this.props;
    const {
      topCenter,
      topRight,
      centerRight,
      bottomLeft,
      bottomCenter,
      bottomRight,
      centerLeft,
      topLeft
    } = points.reduce(
      (acc, point) => {
        acc[point] = true;
        return acc;
      },
      {} as Record<string, true | undefined>
    );

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        {({ ref: clickOutsideRef }) => (
          <div
            ref={(node) => {
              attachRefs(node, [
                this.contentRef,
                containerRef as RefObject<HTMLDivElement>,
                clickOutsideRef
              ]);
            }}
            className="brz-ed-box__resizer"
            onClick={this.handleClick}
          >
            {children}
            {showPoints && topCenter && (
              <DraggableDiv
                key="topCenter"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--top-center"
                draggingCursor="ns-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleTopCenterDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && topRight && (
              <DraggableDiv
                key="topRight"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--top-right"
                draggingCursor="nesw-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleTopRightDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && centerRight && (
              <DraggableDiv
                key="centerRight"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--center-right"
                draggingCursor="col-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleCenterRightDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && bottomLeft && (
              <DraggableDiv
                key="bottomLeft"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-left"
                draggingCursor="nesw-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleBottomLeftDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && bottomCenter && (
              <DraggableDiv
                key="bottomCenter"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-center"
                draggingCursor="ns-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleBottomCenterDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && bottomRight && (
              <DraggableDiv
                key="bottomRight"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-right"
                draggingCursor="nwse-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleBottomRightDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && centerLeft && (
              <DraggableDiv
                key="centerLeft"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--center-left"
                draggingCursor="col-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleCenterLeftDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
            {showPoints && topLeft && (
              <DraggableDiv
                key="topLeft"
                className="brz-ed-box__resizer--point brz-ed-box__resizer--top-left"
                draggingCursor="nwse-resize"
                onDragStart={this.handleDragStart}
                onDrag={this.handleTopLeftDrag}
                onDragEnd={this.handleDragEnd}
              />
            )}
          </div>
        )}
      </ClickOutside>
    );
  }
}
