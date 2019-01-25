import React, { Component } from "react";
import _ from "underscore";

class Apps extends Component {
  static defaultProps = {
    apps: [],
    render: _.noop
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
export default Apps;
