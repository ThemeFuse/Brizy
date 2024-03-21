import React, { ReactElement } from "react";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ToolbarItem } from "./ToolbarItem";

export type ToolbarItemsItems = OptionDefinition[];
export type ToolbarItemsRenderer = (
  items: ToolbarItemsItems
) => React.ReactNode;
export type ToolbarItemsProps = {
  containerRef?: React.RefObject<HTMLDivElement>;
  arrowRef?: React.RefObject<HTMLDivElement>;
  arrow?: boolean;
  items: ToolbarItemsItems;
  position?: "fixed" | "absolute";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onContentChange?: () => void;
};
export type ToolbarItemsState = {
  itemsRenderer: ToolbarItemsRenderer | undefined;
};

export type ToolbarItemsInstance = typeof ToolbarItems & {
  toolbarRef: React.RefObject<HTMLDivElement>;
  toolbarCSSPosition: ToolbarItemsProps["position"];
  toolbarItemIndex: number;
  toolbarItemsLength: number;
  setItemsRenderer: <T>(e: T) => ReactElement;
};

export class ToolbarItems extends React.Component<
  ToolbarItemsProps,
  ToolbarItemsState
> {
  static defaultProps = {
    arrow: true,
    items: []
  };

  state: ToolbarItemsState = {
    itemsRenderer: undefined
  };

  containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  arrowRef: React.RefObject<HTMLDivElement> = React.createRef();

  // api
  setItemsRenderer = (itemsRenderer: ToolbarItemsRenderer): void => {
    this.setState({ itemsRenderer }, this.props.onContentChange);
  };

  resetItemsRenderer = (): void => {
    this.setState({ itemsRenderer: undefined }, this.props.onContentChange);
  };

  renderItems = (items: ToolbarItemsItems): React.ReactElement => {
    const { position, containerRef } = this.props;

    const toolbarItems = items.map((item, index) => (
      <ToolbarItem
        key={item.id}
        data={item}
        // @ts-expect-error: need review this code and eliminate the toolbar instance
        toolbar={{
          ...this,
          toolbarRef: containerRef ?? this.containerRef,
          toolbarCSSPosition: position,
          toolbarItemIndex: index + 1,
          toolbarItemsLength: items.length
        }}
      />
    ));

    return (
      <div className="brz-ed-toolbar__items brz-d-xs-flex brz-align-items-center">
        {toolbarItems}
      </div>
    );
  };

  render(): React.ReactNode {
    const {
      containerRef,
      arrowRef,
      arrow,
      items,
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this.props;
    const { itemsRenderer } = this.state;

    if (!items.length) {
      return null;
    }

    return (
      <div
        ref={containerRef ?? this.containerRef}
        className="brz-ed-toolbar"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {itemsRenderer !== undefined
          ? itemsRenderer(items)
          : this.renderItems(items)}
        {arrow && (
          <div
            ref={arrowRef ?? this.arrowRef}
            className="brz-ed-arrow brz-ed-arrow--top-center brz-ed-toolbar__arrow"
          />
        )}
      </div>
    );
  }
}
