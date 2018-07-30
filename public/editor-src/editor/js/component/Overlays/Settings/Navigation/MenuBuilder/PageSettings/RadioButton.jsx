var React = require("react");

class RadioButton extends React.Component {
  handleChange = () => {
    if (!this.props.checked) {
      this.props.onChange();
    }
  };

  render() {
    var className =
      "brz-ed-large-popup-navigation-field-radio" +
      (this.props.checked ? " checked" : "");

    return (
      <div className={className} onClick={this.handleChange}>
        <i />
        <span className="brz-span label">{this.props.label}</span>
      </div>
    );
  }
}

export default RadioButton;
