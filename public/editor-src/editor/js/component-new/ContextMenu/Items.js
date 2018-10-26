import React from "react";
import itemTypes from "./itemTypes";
import { filterItems } from "./utils";

export default class Items extends React.Component {
  static defaultProps = {
    meta: {}
  };

  render() {
    const { data, meta: meta_ } = this.props;

    return filterItems(data).map((item, index) => {
      if (process.env.NODE_ENV === "development") {
        if (!item.type) {
          throw new Error("Item must have a type");
        }

        if (!itemTypes[item.type]) {
          if (!item.type) {
            throw new Error(`Unknown item type ${item.type}`);
          }
        }
      }

      const ItemComponent = itemTypes[item.type];
      const key = index;
      const meta = {
        ...meta_,
        index
      };

      return <ItemComponent {...item} key={key} meta={meta} />;
    });
  }
}
