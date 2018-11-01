import React from "react";
import _ from "underscore";
import jQuery from "jquery";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";
import { getTime, getServerTimestamp, formatDate } from "./utils";
import getLanguage from "./languages";
import BoxResizer from "visual/component-new/BoxResizer";

const resizerPoints = ["centerLeft", "centerRight"];

class Countdown extends EditorComponent {
  static get componentId() {
    return "Countdown";
  }

  static defaultValue = defaultValue;

  constructor(props) {
    super(props);

    const v = this.getValue();
    const language = getLanguage(v.language);

    this.endDate = this.getEndDate();

    this.state = {
      days: {
        title: language.whichLabels(0)[3],
        amount: 0
      },
      hours: {
        title: language.whichLabels(0)[4],
        amount: 0
      },
      minutes: {
        title: language.whichLabels(0)[5],
        amount: 0
      },
      seconds: {
        title: language.whichLabels(0)[6],
        amount: 0
      }
    };
  }

  componentDidMount() {
    const v = this.getValue();

    if (!v.date) {
      const current = new Date(getServerTimestamp());
      const after30days = new Date(current.setDate(current.getDate() + 30));

      this.patchValue({ date: formatDate(after30days, "d/m/Y") });
    }

    this.initPlugin({
      onTick: remaining => {
        this.setState(remaining);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const countDownKeys = ["date", "hours", "minutes", "timeZone", "language"];
    const oldDbValue = _.pick(prevProps.dbValue, ...countDownKeys);
    const newDbValue = _.pick(this.props.dbValue, ...countDownKeys);

    if (!_.isEqual(oldDbValue, newDbValue)) {
      this.endDate = this.getEndDate();
      this.initPlugin();
    }
  }

  componentWillUnmount() {
    jQuery(this.countdown).countdown("destroy");
  }

  getEndDate() {
    const { date, hours, minutes } = this.getValue();

    const newDate = date.split("/");
    const convertedDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    return getTime(formatDate(convertedDate, "m/d/Y"), hours, minutes);
  }

  initPlugin(options = null) {
    const { timeZone, language } = this.getValue();

    const timeZoneOffset = -timeZone * 60 * 1000;
    const currentLanguage = getLanguage(language);
    const serverTimeStamp = getServerTimestamp();

    jQuery(this.countdown).countdown({
      now: serverTimeStamp,
      endDate: this.endDate,
      timeZoneOffset: timeZoneOffset,
      tickInterval: 1000,
      language: currentLanguage,
      ...options
    });
  }

  renderPart(name) {
    const className = classnames(
      "brz-countdown__item",
      `brz-countdown__${name}`
    );

    return (
      <div className={className}>
        <div className="brz-countdown__number">
          {this.state[name]["amount"]}
        </div>
        <div className="brz-countdown__label">{this.state[name]["title"]}</div>
      </div>
    );
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { timeZone, language } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div
          ref={el => {
            this.countdown = el;
          }}
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          data-end={this.endDate}
          data-timezone={timeZone}
          data-language={language}
        >
          <BoxResizer
            points={resizerPoints}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            {this.renderPart("days")}
            {this.renderPart("hours")}
            {this.renderPart("minutes")}
            {this.renderPart("seconds")}
          </BoxResizer>
        </div>
      </Toolbar>
    );
  }
}

export default Countdown;
