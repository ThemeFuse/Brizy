import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactList from "react-list";
import ScrollPane from "visual/component/ScrollPane";

export default class extends Component {
  constructor(props) {
    super(props);

    this.scrollParentGetter = this.scrollParentGetter.bind(this);
  }
  scrollParentGetter() {
    // if we add this.refScroll to ScrollPane - it works wrong.
    return ReactDOM.findDOMNode(this).children[0];
  }
  render() {
    return (
      <ScrollPane
        style={{ height: 400, overflow: "hidden" }}
        className="brz-ed-scroll-pane brz-ed-scroll__popup"
      >
        <ReactList
          {...this.props}
          scrollParentGetter={this.scrollParentGetter}
        />
      </ScrollPane>
    );
  }
}
