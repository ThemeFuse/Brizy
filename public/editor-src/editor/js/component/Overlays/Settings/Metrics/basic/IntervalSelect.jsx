var _ = require("underscore"),
  React = require("react"),
  Select = require("visual/component/controls/Select"),
  SelectItem = require("visual/component/controls/Select/SelectItem");

class IntervalSelect extends React.Component {
  static defaultProps = {
    onChange: _.noop
  };

  state = {
    defaultValue: null
  };

  componentWillMount() {
    if (this.props.selected) {
      this.onChange(this.props.selected);
    }
  }

  onChange = value => {
    this.setState({
      defaultValue: value
    });

    this.props.onChange(value);
  };

  render() {
    return (
      <Select
        className="brz-control__select--light"
        defaultValue={this.state.defaultValue}
        itemHeight="45"
        maxItems="3"
        onChange={this.onChange}
      >
        <SelectItem key="day" value="day">
          Days
        </SelectItem>
        <SelectItem key="week" value="week">
          Weeks
        </SelectItem>
        <SelectItem key="month" value="month">
          Month
        </SelectItem>
      </Select>
    );
  }
}

export default IntervalSelect;
