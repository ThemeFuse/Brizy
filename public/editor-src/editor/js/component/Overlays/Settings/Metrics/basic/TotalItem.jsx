var _ = require("underscore"),
  React = require("react"),
  numberFormat = require("../metrics_format_helper").numberFormat;

class TotalItem extends React.Component {
  static defaultProps = {
    addClass: ""
  };

  getTotalNumber = () => {
    var sum = _.chain(this.props.data)
      .pluck(this.props.sumKey)
      .filter(function(num) {
        return typeof num === "number";
      })
      .reduce(function(memo, num) {
        return memo + num;
      }, 0)
      .value();

    return numberFormat(sum);
  };

  render() {
    var props = this.props;
    return (
      <div className={"brz-ed-popup-metrics-total-item " + props.addClass}>
        <h4 className="brz-h4">{props.title}</h4>
        <h3 className="brz-h3">{this.getTotalNumber(props.count)}</h3>
        <p className="brz-p">{props.description}</p>
      </div>
    );
  }
}

export default TotalItem;
