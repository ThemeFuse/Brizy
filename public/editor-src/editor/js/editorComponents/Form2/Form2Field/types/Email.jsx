import React from "react";
import TextField from "./common/TextField";

export default class Email extends TextField {
  static get componentType() {
    return "Email";
  }

  static pattern =
    // eslint-disable-next-line no-useless-escape, quotes
    '^(([^<>\\(\\)\\[\\]\\\\.,;:\\s@"]+(\\.[^<>\\(\\)\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';

  renderForView(v) {
    const { attr } = v;

    return <input {...attr} maxLength="255" className={this.getClassName(v)} />;
  }
}
