import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { ReactElement, ReactNode } from "react";
import Sortable from "visual/component/Sortable";
import { Shortcode } from "visual/types";
import { SortData } from "./types";

const sortableBlindZone = {
  left: 0,
  right: 328,
  top: 0,
  bottom: Infinity
};
const sortableDragOffset = {
  top: 0,
  left: -48 // left sidebar width
};

export interface Props {
  category: string;
  shortcodes: Shortcode[];
  children: ReactNode;
  onChange: (data: SortData, shortcodes: Shortcode[]) => void;
  showLines?: boolean;
}

export class Category extends React.Component<Props> {
  static defaultProps = {
    category: "",
    shortcodes: [],
    onChange: noop,
    showLines: false
  };

  handleChange = (data: SortData): void => {
    const { shortcodes, onChange } = this.props;

    onChange(data, shortcodes);
  };

  render(): ReactElement {
    const { category, children, showLines } = this.props;
    const className = classnames("brz-ed-sidebar__add-elements", {
      [`brz-ed-sidebar__add-elements--${category}`]: category
    });

    return (
      <Sortable
        type="addable"
        showLines={showLines}
        blindZone={sortableBlindZone}
        dragOffset={sortableDragOffset}
        onSort={this.handleChange}
      >
        <div className={className}>{children}</div>
      </Sortable>
    );
  }
}
