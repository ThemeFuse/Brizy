var React = require("react");

class CheckBox extends React.Component {
  static defaultProps = {
    disabled: false
  };

  state = {
    checked: this.props.checked,
    disabled: this.props.disabled
  };

  componentWillReceiveProps(nextProps) {
    var newState = {};
    if (this.state.checked !== nextProps.checked) {
      newState.checked = nextProps.checked;
    }
    if (this.state.disabled !== nextProps.disabled) {
      newState.disabled = nextProps.disabled;
    }
    this.setState(newState);
  }

  handleChange = () => {
    if (this.state.disabled) {
      return;
    }
    var checked = !this.state.checked;
    this.setState({
      checked: checked
    });
    this.props.onChange(checked);
  };

  render() {
    var className = "brz-ed-large-popup-navigation-field-checkbox";

    className += this.state.checked ? " checked" : "";
    className += this.state.disabled ? " disabled" : "";

    return (
      <div className={className} onClick={this.handleChange}>
        <i />
        <span className="brz-span label">{this.props.label}</span>
      </div>
    );
  }
}

export default CheckBox;
