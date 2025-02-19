import { noop } from "es-toolkit";
import React, { Component } from "react";

export default class Grid extends Component {
  static defaultProps = {
    apps: [],
    render: noop
  };

  render() {
    const { apps, render } = this.props;

    return (
      <div className="brz-ed-popup-integrations__apps brz-d-xs-flex brz-flex-xs-wrap">
        {apps.map((app, index) => render(app, index))}
      </div>
    );
  }
}
