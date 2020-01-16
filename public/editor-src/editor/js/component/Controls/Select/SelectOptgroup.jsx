import React, { Component } from "react";

class SelectOptgroup extends Component {
  static defaultProps = {
    title: "",
    active: "",
    items: []
  };

  render() {
    const { title, items, children } = this.props;

    return (
      <div title={title} className="brz-control__select-optgroup">
        <div className="brz-control__select-optgroup-label">{children}</div>
        {items}
      </div>
    );
  }
}

export default SelectOptgroup;
