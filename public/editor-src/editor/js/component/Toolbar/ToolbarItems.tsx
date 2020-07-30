import React from "react";
import { filterOptionsData } from "visual/component/Options";
import { ToolbarItem } from "./ToolbarItem";
import { OptionDefinition } from "visual/component/Options/Type";

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
    const filteredItems = filterOptionsData(items);

    if (!filteredItems.length) {
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
          ? itemsRenderer(filteredItems)
          : this.renderItems(filteredItems)}
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
