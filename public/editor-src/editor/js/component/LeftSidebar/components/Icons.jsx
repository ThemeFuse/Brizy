import React from "react";

export default class SidebarIcons extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <ul className="brz-ul">{this.props.children}</ul>
      </div>
    );
  }
}
