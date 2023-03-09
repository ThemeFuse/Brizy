import React, { Component } from "react";
import { Scrollbar } from "visual/component/Scrollbar";

export default class Drawer extends Component {
  static defaultProps = {
    headerText: ""
  };

  render() {
    const { headerText, renderExtraHeader, children, ...props } = this.props;

    return (
      <>
        <div className="brz-ed-sidebar__header">
          <h3 className="brz-h3 brz-ed-sidebar__header__title">{headerText}</h3>
          {typeof renderExtraHeader === "function" && renderExtraHeader()}
        </div>
        <div className="brz-ed-sidebar__main">
          {children && (
            <Scrollbar theme="dark">
              {React.cloneElement(children, props)}
            </Scrollbar>
          )}
        </div>
      </>
    );
  }
}
