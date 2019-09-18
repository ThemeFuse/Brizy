import React, { Component, Fragment } from "react";
import ScrollPane from "visual/component/ScrollPane";

export default class Drawer extends Component {
  static defaultProps = {
    headerText: ""
  };

  render() {
    const { headerText, renderExtraHeader, children, ...props } = this.props;

    return (
      <Fragment>
        <div className="brz-ed-sidebar__header">
          <h3 className="brz-h3 brz-ed-sidebar__header__title">{headerText}</h3>
          {typeof renderExtraHeader === "function" && renderExtraHeader()}
        </div>
        <div className="brz-ed-sidebar__main">
          {children && (
            <ScrollPane
              className="brz-ed-scroll--medium brz-ed-scroll--darker"
              style={{ height: "100%" }}
            >
              {React.cloneElement(children, props)}
            </ScrollPane>
          )}
        </div>
      </Fragment>
    );
  }
}
