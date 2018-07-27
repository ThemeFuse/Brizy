import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";

class CustomFields extends Component {
  static defaultProps = {
    title: "",
    appFields: [],
    onChange: _.noop
  };

  handleChange = (id, e) => {
    this.props.onChange(id, e.target.value);
  };

  renderForBrizySite() {
    const { title, appFields, scrollHeight } = this.props;

    const items = appFields.map(({ title, linked, id }, index) => {
      const value = linked === "_auto_generate" ? title : linked;

      return (
        <div key={id} className="brz-ed-popup-apps-row brz-ed-popup-apps-body">
          <div className="brz-ed-popup-apps-col">{title}</div>
          <div className="brz-ed-popup-apps-col">
            <input
              className="brz-input brz-ed-form-control"
              required
              type="text"
              value={value}
              onChange={e => {
                this.handleChange(id, e);
              }}
            />
          </div>
        </div>
      );
    });

    return (
      <div className="brz-ed-popup-apps brz-ed-popup-app-form-fields brz-ed-form-row">
        <div className="brz-ed-popup-apps-row brz-ed-popup-apps-head">
          <div className="brz-ed-popup-apps-col">FORM FIELDS</div>
          <div className="brz-ed-popup-apps-col">{title} FIELDS</div>
        </div>
        <ScrollPane
          className="brz-ed-scroll-pane brz-ed-scroll-pane-form-list"
          style={{ maxHeight: scrollHeight }}
        >
          {items}
        </ScrollPane>
      </div>
    );
  }

  renderForWordpress() {
    const {
      title,
      appFields: { emailTo, subject }
    } = this.props;

    return (
      <div className="brz-ed-popup-apps brz-ed-popup-app-form-fields brz-ed-form-row">
        <div className="brz-ed-popup-apps-row brz-ed-popup-apps-head">
          <div className="brz-ed-popup-apps-col">Options</div>
          <div className="brz-ed-popup-apps-col">{title} Options</div>
        </div>
        <div className="brz-ed-popup-apps-row brz-ed-popup-apps-body">
          <div className="brz-ed-popup-apps-col">Email To</div>
          <div className="brz-ed-popup-apps-col">
            <input
              className="brz-input brz-ed-form-control"
              required
              type="text"
              value={emailTo ? emailTo : ""}
              required
              onChange={e => {
                this.handleChange("emailTo", e);
              }}
            />
          </div>
        </div>
        <div className="brz-ed-popup-apps-row brz-ed-popup-apps-body">
          <div className="brz-ed-popup-apps-col">Subject Message</div>
          <div className="brz-ed-popup-apps-col">
            <input
              className="brz-input brz-ed-form-control"
              type="text"
              value={subject ? subject : ""}
              required
              onChange={e => {
                this.handleChange("subject", e);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.props.app === "wordpress"
      ? this.renderForWordpress()
      : this.renderForBrizySite();
  }
}

export default CustomFields;
