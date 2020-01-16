import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactList from "react-list";
import ScrollPane from "visual/component/ScrollPane";

export default class SmartGrid extends Component {
  static defaultProps = {
    height: 400
  };

  constructor(props) {
    super(props);

    this.scrollParentGetter = this.scrollParentGetter.bind(this);
  }

  scrollParentGetter() {
    // if we add this.refScroll to ScrollPane - it works wrong.
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(this).children[0];
  }

  render() {
    return (
      <ScrollPane
        style={{ height: this.props.height, overflow: "hidden" }}
        className="brz-ed-scroll--medium brz-ed-scroll--new-dark brz-ed-scroll__popup"
      >
        <ReactList
          {...this.props}
          scrollParentGetter={this.scrollParentGetter}
        />
      </ScrollPane>
    );
  }
}
