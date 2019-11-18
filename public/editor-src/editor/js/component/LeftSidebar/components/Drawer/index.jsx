import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";

export default class Drawer extends Component {
  static defaultProps = {
    headerText: ""
  };

  renderThumbs = ({ style, ...props }) => (
    <div
      {...props}
      style={{
        ...style,
        borderRadius: "inherit",
        backgroundColor: "#3f4652"
      }}
    />
  );

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
            <Scrollbars
              renderThumbHorizontal={this.renderThumbs}
              renderThumbVertical={this.renderThumbs}
            >
              {React.cloneElement(children, props)}
            </Scrollbars>
          )}
        </div>
      </>
    );
  }
}
