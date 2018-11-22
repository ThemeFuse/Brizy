import React from "react";
import _ from "underscore";
import ReactDOM from "react-dom";
import jQuery from "jquery";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
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

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.hoverColorPalette && `${_v.hoverColorPalette}__hoverColor`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { start, end, duration } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          data-start={start}
          data-end={end}
          data-duration={duration}
        >
          {start}
        </div>
      </Toolbar>
    );
  }
}

export default Counter;
