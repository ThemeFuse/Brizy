import React from "react";
import ScrollPane from "visual/component/ScrollPane";

export default class Drawer extends React.Component {
  static defaultProps = {
    headerText: ""
  };

  renderHeader = () => {
    return (
      <div className="brz-ed-sidebar__header" key="header">
        <h3 className="brz-h3 brz-ed-sidebar__header__title">
          {this.props.headerText}
        </h3>
      </div>
    );
  };

  renderContent = () => {
    return (
      <div className="brz-ed-sidebar__main" key="main">
        {this.props.children && (
          <ScrollPane
            className="brz-ed-scroll-pane brz-ed-scroll--medium brz-ed-scroll--darker"
            style={{ height: `100%` }}
          >
            {this.props.children}
          </ScrollPane>
        )}
      </div>
    );
  };

  renderFooter = () => {
    return (
      <div className="brz-ed-sidebar__footer">
        <a href="#" className="brz-a brz-ed-sidebar__btn">
          Preview
        </a>
        <a href="#" className="brz-a brz-ed-sidebar__btn brz-ed-sidebar__btn--active">
          Save
        </a>
      </div>
    );
  };

  render() {
    return [this.renderHeader(), this.renderContent()];
  }
}
