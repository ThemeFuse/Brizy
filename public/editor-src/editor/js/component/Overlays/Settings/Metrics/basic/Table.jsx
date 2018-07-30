var _ = require("underscore"),
  React = require("react"),
  numeral = require("numeral");

class Table extends React.Component {
  static defaultProps = {
    head: function() {},
    data: function() {},
    addClass: ""
  };

  getBody = () => {
    var keys = _.pluck(this.props.head, "dataKey");

    return _.map(this.props.data, function(row) {
      return (
        <tr>
          {_.map(keys, function(key) {
            return <td>{row[key]}</td>;
          })}
        </tr>
      );
    });
  };

  getHead = () => {
    var items = _.map(this.props.head, function(item) {
      return item.title ? <th>{item.title}</th> : <th>&nbsp;</th>;
    });

    return <tr>{items}</tr>;
  };

  render() {
    return (
      <table className={"brz-ed-popup-metrics-sheet " + this.props.addClass}>
        <thead>{this.getHead()}</thead>
        <tbody>{this.getBody()}</tbody>
      </table>
    );
  }
}

export default Table;
