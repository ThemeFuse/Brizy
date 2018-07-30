import React from "react";
import _ from "underscore";
import { filterOptionsData } from "visual/component-new/Options";
import ToolbarItem from "./ToolbarItem";

class ToolbarItems extends React.Component {
  static defaultProps = {
    arrow: true,
    items: [],
    toolbarNode: null,
    onChange: _.noop,
    onContentChange: _.noop
  };

  state = {
    itemsRenderer: null
  };

  // api
  setItemsRenderer = itemsRenderer => {
    this.setState({ itemsRenderer }, this.props.onContentChange);
  };

  resetItemsRenderer = () => {
    this.setState({ itemsRenderer: null }, this.props.onContentChange);
  };

  renderItems = items => {
    const { toolbarNode } = this.props;
    const toolbarItems = items.map((item, index) => (
      <ToolbarItem
        key={item.id}
        data={item}
        toolbar={{
          ...this,
          toolbarItemIndex: index + 1,
          toolbarItemsLength: items.length,
          toolbarNode
        }}
      />
    ));

    return (
      <div className="brz-ed-toolbar__items brz-d-xs-flex brz-align-items-center">
        {toolbarItems}
      </div>
    );
  };

  render() {
    const { arrow, items, onMouseEnter, onMouseLeave } = this.props;
    const { itemsRenderer } = this.state;
    const filteredItems = filterOptionsData(items);

    if (!filteredItems.length) {
      return null;
    }

    return (
      <div
        className="brz-ed-toolbar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {itemsRenderer
          ? itemsRenderer(filteredItems)
          : this.renderItems(filteredItems)}
        {arrow && (
          <div className="brz-ed-arrow brz-ed-arrow--top-center brz-ed-toolbar__arrow" />
        )}
      </div>
    );
  }
}

export default ToolbarItems;
