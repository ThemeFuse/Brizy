import React from "react";
import { Item, Submenu } from "react-contexify";
import EditorIcon from "visual/component/EditorIcon";
import Items from "../Items";

export default class Group extends React.Component {
  static defaultProps = {
    title: "",
    icon: "",
    items: []
  };

  render() {
    const { title, icon, items, meta } = this.props;
    const itemsMeta = {
      ...meta,
      depth: meta.depth + 1
    };

    if (meta.depth === 0 && meta.index === 0) {
      return (
        <React.Fragment>
          <Item key="title" className="contexify-title">
            {icon && <EditorIcon icon={icon} />} {title}
          </Item>
          <Items data={items} meta={{ ...itemsMeta, isInSubMenu: false }} />
        </React.Fragment>
      );
    } else {
      return (
        <Submenu className="contexify_item_submenu" label={title} arrow="">
          <Items data={items} meta={{ ...itemsMeta, isInSubMenu: true }} />
        </Submenu>
      );
    }
  }
}
