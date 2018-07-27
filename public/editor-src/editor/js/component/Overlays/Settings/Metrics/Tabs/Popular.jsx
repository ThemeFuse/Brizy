var _ = require("underscore"),
  React = require("react"),
  numeral = require("numeral"),
  numberFormat = require("../metrics_format_helper").numberFormat,
  dateFormat = require("../metrics_format_helper").dateFormat,
  getTotalDescriptionByPeriod = require("../metrics_format_helper")
    .getTotalDescriptionByPeriod,
  IntervalSelect = require("../basic/IntervalSelect"),
  TotalItem = require("../basic/TotalItem"),
  Table = require("../basic/Table"),
  PieChart = require("../basic/PieChart");

class Popular extends React.Component {
  getChartData = () => {
    return _.map(this.getData(), function(item) {
      return {
        label: item.label,
        value: item.countVisits
      };
    });
  };

  getData = () => {
    return _.sortBy(this.props.data, "countVisits").reverse();
  };

  getPageLink = link => {
    return <a href="#" className="brz-a">{link}</a>;
  };

  getTableData = () => {
    var _this = this;
    return _.map(this.getData(), function(item) {
      return {
        count: numberFormat(item.countVisits),
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
        title: "PAGE VIEWED",
        dataKey: "page"
      }
    ];
  };

  render() {
    var period = this.props.period;
    var data = this.getData();

    return (
      <div>
        <div className="brz-ed-popup-metrics-body">
          <div className="brz-ed-popup-metrics-chart">
            <PieChart data={this.getChartData()} />
          </div>
          <div className="brz-ed-popup-metrics-total">
            <TotalItem
              title="TOTAL VIEWS:"
              sumKey="countVisits"
              data={data}
              description={getTotalDescriptionByPeriod(period)}
            />
          </div>
          <div className="brz-ed-popup-metrics-table">
            <Table
              head={this.getTableHead()}
              data={this.getTableData()}
              addClass="brz-ed-popup-metrics-table-popular"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Popular;
