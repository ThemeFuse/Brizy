import React from "react";
import jQuery from "jquery";
import classnames from "classnames";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style, styleChart, styleNumber } from "./styles";
import { roundTo } from "visual/utils/math";
import { css } from "visual/utils/cssStyle";

import defaultValue from "./defaultValue.json";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

import { Chart } from "./Chart";

class Counter extends EditorComponent {
  static get componentId() {
    return "Counter";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  state = {
    final: 0
  };

  componentDidMount() {
    this.initCounter();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dbValue.start !== this.props.dbValue.start ||
      prevProps.dbValue.end !== this.props.dbValue.end ||
      prevProps.dbValue.duration !== this.props.dbValue.duration
    ) {
      this.initCounter();
    }
  }

  initCounter = _.debounce(() => {
    const { duration, start, end } = this.getValue();

    const step = final => {
      this.state.final !== final && this.setState({ final });
    };

    this.lastAnimation && this.lastAnimation.stop(true, true);
    // remove number
    this.lastAnimation = jQuery({ countNum: Number(start) }).animate(
      { countNum: Number(end) },
      {
        duration: duration * 1000,
        easing: "linear",
        step: function() {
          step(roundTo(this.countNum, 2));
        },
        complete: function() {
          step(Number(end));
        }
      }
    );
  }, 1000);

  renderForEdit(v, vs, vd) {
    const { final } = this.state;
    const { type, start, end, duration } = v;

    const className = classnames(
      "brz-counter",
      `brz-counter-${type}`,
      css(
        `${this.constructor.componentId}-counter`,
        `${this.getId()}-counter`,
        style(v, vs, vd)
      )
    );

    const classNameNumber = classnames(
      "brz-counter-figures",
      css(
        `${this.constructor.componentId}-number`,
        `${this.getId()}-number`,
        styleNumber(v, vs, vd)
      )
    );

    const classNameChart = classnames(
      `brz-counter-chart-${type}`,
      css(
        `${this.constructor.componentId}-count`,
        `${this.getId()}-count`,
        styleChart({ ...v, end: final }, vs, vd)
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div
            className={className}
            data-start={start}
            data-end={end}
            data-duration={duration}
          >
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {type !== "simple" && (
                <Chart
                  className={classNameChart}
                  type={type}
                  strokeW={v.strokeWidth}
                />
              )}
            </BoxResizer>
            <div className={classNameNumber}>
              <span className="brz-counter-numbers">{parseInt(final)}</span>
              {type !== "simple" && <span>%</span>}
            </div>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Counter;
