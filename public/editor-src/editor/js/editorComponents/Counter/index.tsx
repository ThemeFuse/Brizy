import classnames from "classnames";
import { debounce } from "es-toolkit";
import jQuery from "jquery";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ElementPatch, ElementProps } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import {
  formatNumber,
  getBoxResizerParams
} from "visual/editorComponents/Counter/utils";
import EditorComponent, {
  Props as PrevProps
} from "visual/editorComponents/EditorComponent";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { roundTo } from "visual/utils/math";
import { attachRefs } from "visual/utils/react";
import * as Str from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";
import { Wrapper } from "../tools/Wrapper";
import { Chart } from "./Components/Chart";
import { Text } from "./Components/Text";
import { resizerTransformPatch, resizerTransformValue } from "./converters";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as sidebarConfig from "./sidebar";
import { style, styleChart, styleNumber } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Value } from "./types";
import { State, StyleType } from "./types";

class Counter extends EditorComponent<Value, ElementProps, State> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  lastAnimation: MValue<JQuery<{ countNum: number }>> = undefined;
  state = {
    final: 0
  };
  initCounter: VoidFunction = debounce(() => {
    const { duration, start, end, type } = this.getValue();

    const isSimple = type === StyleType.Simple;

    const endNumber = Number(end);
    const _end = isSimple ? endNumber : Math.max(0, Math.min(100, endNumber));

    const step = (final: number): void => {
      if (this.state.final !== final) {
        this.setState({ final });
      }
    };

    if (this.lastAnimation) {
      this.lastAnimation.stop(true, true);
    }

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

  static get componentId(): ElementTypes.Counter {
    return ElementTypes.Counter;
  }

  handleResizerChange = (patch: ElementPatch<Value>): void =>
    this.patchValue(patch);

  componentDidMount(): void {
    this.initCounter();
  }

  componentDidUpdate(prevProps: PrevProps<Value, ElementProps>): void {
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

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { final } = this.state;
    const { meta } = this.props;
    const { type, start, end, duration, separator, strokeWidth } = v;

    const isSimple = type === StyleType.Simple;

    const prefixLabel = isSimple ? v.prefixLabel : v.prefixLabelRadial;
    const suffixLabel = isSimple ? v.suffixLabel : v.suffixLabelRadial;

    const { points, restrictions } = getBoxResizerParams();

    const className = classnames(
      "brz-counter",
      `brz-counter-${type}`,
      this.css(
        `${this.getComponentId()}-counter`,
        `${this.getId()}-counter`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const classNameNumber = classnames(
      "brz-counter-figures",
      this.css(
        `${this.getComponentId()}-number`,
        `${this.getId()}-number`,
        styleNumber({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const classNameChart = classnames(
      `brz-counter-chart-${type}`,
      this.css(
        `${this.getComponentId()}-count`,
        `${this.getId()}-count`,
        styleChart({
          v: { ...v, end: final },
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const text = formatNumber(final, separator);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef, ...rest }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  attributes: {
                    ...makeDataAttr({ name: "start", value: start }),
                    ...makeDataAttr({ name: "end", value: end }),
                    ...makeDataAttr({ name: "duration", value: duration }),
                    ...makeDataAttr({ name: "separator", value: separator }),
                    ...makeDataAttr({ name: "type", value: type })
                  },
                  ...rest,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                {type !== StyleType.Simple ? (
                  <BoxResizer
                    keepAspectRatio
                    points={points}
                    restrictions={restrictions}
                    meta={meta}
                    value={resizerTransformValue(v)}
                    onChange={(patch: Partial<Value>) =>
                      this.handleResizerChange(resizerTransformPatch(patch))
                    }
                  >
                    <Chart
                      className={classNameChart}
                      type={type}
                      strokeW={strokeWidth}
                    />
                    <Text
                      className={classNameNumber}
                      prefixClassName="brz-counter-figures--prefix"
                      suffixClassName="brz-counter-figures--suffix"
                      prefix={prefixLabel}
                      suffix={suffixLabel}
                    >
                      {text}
                    </Text>
                  </BoxResizer>
                ) : (
                  <Text
                    className={classNameNumber}
                    prefixClassName="brz-counter-figures--prefix"
                    suffixClassName="brz-counter-figures--suffix"
                    prefix={Str.read(prefixLabel)}
                    suffix={Str.read(suffixLabel)}
                  >
                    {text}
                  </Text>
                )}
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default withMigrations(Counter, migrations);
