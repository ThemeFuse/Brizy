import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import Config from "visual/global/Config";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

class WPTemplate extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    currentTemplate: PropTypes.string
  };

  static defaultProps = {
    label: "",
    className: "",
    currentTemplate: ""
  };

  handleTemplateChange = template => {
    const win = window.parent || window;
    const { changeTemplate } = Config.get("urls");

    win.location.href = `${changeTemplate}&template=${template}`;
  };

  renderOptions() {
    const { templates } = Config.get("wp");

    return templates.map((template, index) => (
      <SelectItem key={index} value={template.id}>
        {template.title}
      </SelectItem>
    ));
  }

  render() {
    const { label, className: _className, currentTemplate } = this.props;
    const className = classnames(
      "brz-ed-sidebar-bottom__option brz-ed-sidebar__wp-template",
      _className
    );

    return (
      <div className={className}>
        {label && <div className="brz-ed-option__label">{label}</div>}
        <Select
          defaultValue={currentTemplate}
          className="brz-control__select--dark"
          maxItems="6"
          itemHeight="30"
          onChange={this.handleTemplateChange}
        >
          {this.renderOptions()}
        </Select>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTemplate: state.page.template
});

export default connect(mapStateToProps, null)(WPTemplate);
