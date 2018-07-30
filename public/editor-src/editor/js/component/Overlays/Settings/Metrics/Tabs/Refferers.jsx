var _ = require("underscore"),
  React = require("react"),
  numberFormat = require("../metrics_format_helper").numberFormat,
  getTotalDescriptionByPeriod = require("../metrics_format_helper")
    .getTotalDescriptionByPeriod,
  IntervalSelect = require("../basic/IntervalSelect"),
  TotalItem = require("../basic/TotalItem"),
  Table = require("../basic/Table"),
  PieChart = require("../basic/PieChart");

class Refferers extends React.Component {
  getChartData = () => {
    return _.map(this.getData(), function(item) {
      return {
        label: item.label,
        value: item.count
      };
    });
  };

  getData = () => {
    return _.sortBy(this.props.data, "count").reverse();
  };

  getPageLink = link => {
    return (
      <a href={"http://" + link} className="brz-a" target="_blank">
        {link}
      </a>
    );
  };

  getTableData = () => {
    var _this = this;

    return _.map(this.getData(), function(item) {
      return {
        count: numberFormat(item.count),
        page: _this.getPageLink(item.label)
      };
    });
  };

  getTableHead = () => {
    return [
      {
        title: "COUNT",
        dataKey: "count"
      },
      {
        title: "REFFERAL",
        dataKey: "page"
      }
    ];
  };

  render() {
    var description = getTotalDescriptionByPeriod(this.props.period);
    var data = this.props.data;

    return (
      <div>
        <div className="brz-ed-popup-metrics-body">
          <div className="brz-ed-popup-metrics-chart">
            <PieChart data={this.getChartData()} />
          </div>
          <div className="brz-ed-popup-metrics-total">
            <TotalItem
              title="VISITS:"
              sumKey="count"
              data={data}
              description={description}
              addClass="brz-ed-popup-metrics-total-item-blue"
            />
          </div>
          <div className="brz-ed-popup-metrics-table">
            <Table
              head={this.getTableHead()}
              data={this.getTableData()}
              addClass="brz-ed-popup-metrics-table-refferers"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Refferers;
