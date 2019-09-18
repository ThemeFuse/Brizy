import React from "react";
import _ from "underscore";
import ReactDOM from "react-dom";
import jQuery from "jquery";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import classnames from "classnames";
import defaultValue from "./defaultValue.json";

class Counter extends EditorComponent {
  static get componentId() {
    return "Counter";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    this.updateCounter();
  }

  componentDidUpdate(prevProps) {
    const countDownKeys = ["start", "end", "duration"];
    const oldValue = _.pick(prevProps.dbValue, ...countDownKeys);
    const newValue = _.pick(this.props.dbValue, ...countDownKeys);

    if (!_.isEqual(oldValue, newValue)) {
      this.updateCounter();
    }
  }

  updateCounter = _.debounce(() => {
    const { start, end, duration } = this.getValue();
    const $node = jQuery(ReactDOM.findDOMNode(this));
    jQuery({ countNum: Number(start) }).animate(
      {
        countNum: Number(end)
      },
      {
        duration: Number(duration * 1000),
        queue: false,
        easing: "linear",

        step: function() {
          $node.text(Math.floor(this.countNum));
        },

        complete: function() {
          $node.text(this.countNum);
        }
      }
    );
  }, 1000);

  renderForEdit(v, vs, vd) {
    const { start, end, duration } = v;

    const className = classnames(
      "brz-counter",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div
            className={className}
            data-start={start}
            data-end={end}
            data-duration={duration}
          >
            {start}
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Counter;
