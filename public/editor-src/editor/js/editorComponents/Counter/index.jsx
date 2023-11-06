import classnames from "classnames";
import jQuery from "jquery";
import React from "react";
import _ from "underscore";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { roundTo } from "visual/utils/math";
import { Wrapper } from "../tools/Wrapper";
import { Chart } from "./Chart";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleChart, styleNumber } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

const resizerTransformValue = (v) => {
  const {
    width,
    tabletWidth,
    mobileWidth,
    widthSuffix,
    tabletWidthSuffix,
    mobileWidthSuffix,
    ...rest
  } = v;

  return {
    size: width,
    tabletSize: tabletWidth,
    mobileSize: mobileWidth,
    sizeSuffix: widthSuffix,
    tabletSizeSuffix: tabletWidthSuffix,
    mobileSizeSuffix: mobileWidthSuffix,
    ...rest
  };
};
const resizerTransformPatch = (patch) => {
  if (patch.size) {
    patch.width = patch.size;
    delete patch.size;
  }

  if (patch.tabletSize) {
    patch.tabletWidth = patch.tabletSize;
    delete patch.tabletSize;
  }

  if (patch.mobileSize) {
    patch.mobileWidth = patch.mobileSize;
    delete patch.mobileSize;
  }

  return patch;
};

class Counter extends EditorComponent {
  static get componentId() {
    return "Counter";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = (patch) => this.patchValue(patch);

  state = {
    final: 0
  };

  componentDidMount() {
    this.initCounter();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dbValue.start !== this.props.dbValue.start ||
      prevProps.dbValue.startPopulation !==
        this.props.dbValue.startPopulation ||
      prevProps.dbValue.end !== this.props.dbValue.end ||
      prevProps.dbValue.endPopulation !== this.props.dbValue.endPopulation ||
      prevProps.dbValue.duration !== this.props.dbValue.duration
    ) {
      this.initCounter();
    }
  }

  initCounter = _.debounce(() => {
    const { duration, start, end, type } = this.getValue();

    const isSimple = type === "simple";

    const endNumber = Number(end);
    const _end = isSimple ? endNumber : Math.max(0, Math.min(100, endNumber));

    const step = (final) => {
      this.state.final !== final && this.setState({ final });
    };

    this.lastAnimation && this.lastAnimation.stop(true, true);
    // remove number
    this.lastAnimation = jQuery({ countNum: Number(start) }).animate(
      { countNum: _end },
      {
        duration: duration * 1000,
        easing: "linear",
        step: function () {
          step(roundTo(this.countNum, 2));
        },
        complete: function () {
          step(_end);
        }
      }
    );
  }, 1000);

  renderForEdit(v, vs, vd) {
    const { final } = this.state;
    const { type, start, end, duration, separator } = v;
    const isSimple = type === "simple";

    const prefixLabel = isSimple ? v.prefixLabel : v.prefixLabelRadial;
    const suffixLabel = isSimple ? v.suffixLabel : v.suffixLabelRadial;

    const resizerRestrictions = {
      size: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletSize: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileSize: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };

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

    const formatNumber = function (number) {
      var splitNum;
      number = number.toFixed(0);
      splitNum = number.split(".");
      splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return splitNum.join("-");
    };

    const renderText = (
      <div className={classNameNumber}>
        {prefixLabel && <span>{`${prefixLabel} `}</span>}
        <span className="brz-counter-numbers">{formatNumber(final)}</span>
        {suffixLabel && <span>{` ${suffixLabel}`}</span>}
      </div>
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: {
                ...makeDataAttr({ name: "start", value: start }),
                ...makeDataAttr({ name: "end", value: end }),
                ...makeDataAttr({ name: "duration", value: duration }),
                ...makeDataAttr({ name: "separator", value: separator }),
                ...makeDataAttr({ name: "type", value: type })
              }
            })}
          >
            {type !== "simple" ? (
              <BoxResizer
                keepAspectRatio
                points={resizerPoints}
                restrictions={resizerRestrictions}
                meta={this.props.meta}
                value={resizerTransformValue(v)}
                onChange={(patch) =>
                  this.handleResizerChange(resizerTransformPatch(patch))
                }
              >
                <Chart
                  className={classNameChart}
                  type={type}
                  strokeW={v.strokeWidth}
                />
                {renderText}
              </BoxResizer>
            ) : (
              renderText
            )}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Counter;
