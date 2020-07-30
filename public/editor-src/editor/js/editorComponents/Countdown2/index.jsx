import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import _ from "underscore";
import jQuery from "jquery";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import {
  style,
  styleItems,
  styleNumber,
  styleTitle,
  styleMessage
} from "./styles";
import { css } from "visual/utils/cssStyle";
import { getTime, formatDate } from "./utils";
import BoxResizer from "visual/component/BoxResizer";
import { capitalize } from "visual/utils/string";
import { Wrapper } from "../tools/Wrapper";

// lib
import "./lib/jquery.countdown.js";

const resizerPoints = ["centerLeft", "centerRight"];

class Countdown2 extends EditorComponent {
  static get componentId() {
    return "Countdown2";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleTextChange = (propertyName, value) => {
    this.patchValue({ [propertyName]: value });
  };

  endDate = this.getEndDate();

  days = React.createRef();
  hours = React.createRef();
  minutes = React.createRef();
  seconds = React.createRef();

  componentDidMount() {
    const v = this.getValue();

    if (!v.date) {
      const current = new Date();
      const after30days = new Date(current.setDate(current.getDate() + 30));

      this.patchValue({ date: formatDate(after30days, "d/m/Y") });
    }

    const leftPadWith0 = function(number) {
      return ("0" + number).slice(-2);
    };

    this.initPlugin({
      onTick: ({ days, hours, minutes, seconds }) => {
        const newV = this.getValue();
        if (newV.showDays === "on") {
          this.days.current.innerText = days;
        }
        if (newV.showHours === "on") {
          this.hours.current.innerText = leftPadWith0(hours);
        }
        if (newV.showMinutes === "on") {
          this.minutes.current.innerText = leftPadWith0(minutes);
        }
        if (newV.showSeconds === "on") {
          this.seconds.current.innerText = leftPadWith0(seconds);
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    const countDownKeys = ["date", "hours", "minutes", "timeZone"];
    const oldDbValue = _.pick(prevProps.dbValue, ...countDownKeys);
    const newDbValue = _.pick(this.props.dbValue, ...countDownKeys);

    if (!_.isEqual(oldDbValue, newDbValue)) {
      this.endDate = this.getEndDate();
      this.initPlugin();
    }
  }

  componentWillUnmount() {
    jQuery(this.countdown).countdown2("destroy");
  }

  getEndDate() {
    const { date, hours, minutes } = this.getValue();

    const newDate = date.split("/");
    const convertedDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    return getTime(formatDate(convertedDate, "m/d/Y"), hours, minutes);
  }

  initPlugin(options = null) {
    const { timeZone } = this.getValue();

    const timeZoneOffset = timeZone * 60 * 1000;

    jQuery(this.countdown).countdown2({
      now: Date.now(),
      endDate: this.endDate,
      timeZoneOffset: timeZoneOffset,
      tickInterval: 1000,
      ...options
    });
  }

  renderParts() {
    const v = this.getValue();
    const list = ["days", "hours", "minutes", "seconds"];

    const content = list
      .filter(type => {
        const propertyName = `show${capitalize(type)}`;

        return v[propertyName] === "on";
      })
      .map((type, index, types) => {
        const separator =
          v.style === "style3" && index !== types.length - 1 ? (
            <span key="separator" className="brz-countdown2-separator">
              :
            </span>
          ) : null;
        return [this.renderPart(type), separator];
      });

    return <div className="brz-countdown2-parts">{content}</div>;
  }

  renderPart(name) {
    const v = this.getValue();
    const vs = this.getStylesValue();
    const vd = this.getDefaultValue();

    const className = classnames(
      "brz-countdown2__item",
      `brz-countdown2__${name}`,
      {
        "brz-countdown2_custom":
          v.bgColorOpacity === 0 && v.borderColorOpacity === 0
      },
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleItems(v, vs, vd)
      )
    );
    const classNameNumber = classnames(
      "brz-countdown2__number",
      css(
        `${this.constructor.componentId}-number`,
        `${this.getId()}-number`,
        styleNumber(v, vs, vd)
      )
    );
    const classNameTitle = classnames(
      "brz-countdown2__label",
      css(
        `${this.constructor.componentId}-title`,
        `${this.getId()}-title`,
        styleTitle(v, vs, vd)
      )
    );

    const propertyName = `${name}Label`;
    return (
      <div key={name} className={className}>
        <div ref={this[name]} className={classNameNumber}>
          00
        </div>
        <div className={classNameTitle}>
          <TextEditor
            value={v[propertyName]}
            onChange={this.handleTextChange.bind(null, propertyName)}
          />
        </div>
      </div>
    );
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-countdown2",
      { "brz-countdown2-style1": v.style === "style1" },
      { "brz-countdown2-style2": v.style === "style2" },
      { "brz-countdown2-style3": v.style === "style3" },
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        style(v, vs, vd)
      )
    );
    const classNameMessage = classnames(
      "brz-countdown2-message",
      css(
        `${this.constructor.componentId}-message`,
        `${this.getId()}-message`,
        styleMessage(v, vs, vd)
      )
    );

    const { timeZone, linkType, messageText, messageRedirect, actions } = v;

    const resizerRestrictions = {
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: className,
              attributes: {
                "data-end": this.endDate,
                "data-timezone": timeZone,
                "data-link-type": linkType,
                "data-redirect": messageRedirect,
                "data-message": messageText,
                "data-action": actions,
                ref: el => {
                  this.countdown = el;
                }
              }
            })}
          >
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
              restrictions={resizerRestrictions}
            >
              {this.renderParts()}
              {actions === "showMessage" && (
                <div className={classNameMessage}>{messageText}</div>
              )}
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Countdown2;
