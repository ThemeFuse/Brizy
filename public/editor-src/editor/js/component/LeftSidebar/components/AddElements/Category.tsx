import classnames from "classnames";
import React, { ReactElement } from "react";
import _ from "underscore";
import Sortable from "visual/component/Sortable";
import Config from "visual/global/Config";
import { Shortcode } from "visual/types";
import { isStory } from "visual/utils/models";
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
  onChange: (data: SortData, shortcodes: Shortcode[]) => void;
}

export class Category extends React.Component<Props> {
  static defaultProps = {
    category: "",
    shortcodes: [],
    onChange: _.noop
  };

  handleChange = (data: SortData): void => {
    const { shortcodes, onChange } = this.props;

    onChange(data, shortcodes);
  };

  render(): ReactElement {
    const { category, children } = this.props;
    const className = classnames("brz-ed-sidebar__add-elements", {
      [`brz-ed-sidebar__add-elements--${category}`]: category
    });

    return (
      <Sortable
        type="addable"
        showLines={!isStory(Config.getAll())}
        blindZone={sortableBlindZone}
        dragOffset={sortableDragOffset}
        onSort={this.handleChange}
      >
        <div className={className}>{children}</div>
      </Sortable>
    );
  }
}
