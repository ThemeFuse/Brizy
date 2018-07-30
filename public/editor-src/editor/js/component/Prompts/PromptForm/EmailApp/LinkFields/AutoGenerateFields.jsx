import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Select from "visual/component/controls/Select";
import SelectItem from "visual/component/controls/Select/SelectItem";
import { getFields, isMaxFields, substrString } from "../utils";

class AutoGenerateFields extends Component {
  static defaultProps = {
    title: "",
    list: [],
    appFields: [],
    onChange: _.noop,
    restrictions: null
  };

  renderSelect(linked, id) {
    return (
      <Select
        defaultValue={linked}
        onChange={itemLinked => {
          this.props.onChange(id, itemLinked);
        }}
        className="brz-control__select--light"
        maxItems="6"
        itemHeight="30"
      >
        {this.renderOptions(linked)}
      </Select>
    );
  }

  renderOptions(active) {
    const { appFields, list, restrictions } = this.props;
    const busyFields = _.pluck(appFields, "linked");
    let newFields = list.filter(item => {
      return busyFields.indexOf(item.slug) === -1 || item.slug === active;
    });

    const allBusyFields =
      list.length +
      (appFields.length - _.without(busyFields, "_auto_generate").length);

    if (
      !(
        isMaxFields(allBusyFields, restrictions) &&
        (!active || active !== "_auto_generate")
      )
    ) {
      newFields.unshift({
        name: "Auto Generate",
        required: false,
        slug: "_auto_generate"
      });
    }

    return newFields.map(({ required, name, slug }) => {
      const isRequired = required ? <strong>*</strong> : "";
      const title = substrString(name);

      return (
        <SelectItem key={slug} value={slug}>
          <span className="brz-span">{title}</span>
          {isRequired}
        </SelectItem>
      );
    });
  }

  render() {
    const { title, appFields, scrollHeight } = this.props;
    const items = appFields.map(({ title, linked, id }) => {
      return (
        <div key={id} className="brz-ed-popup-apps-row brz-ed-popup-apps-body">
          <div className="brz-ed-popup-apps-col">{title}</div>
          <div className="brz-ed-popup-apps-col">
            {this.renderSelect(linked, id)}
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
}

export default AutoGenerateFields;
