var _ = require("underscore"),
  React = require("react"),
  numberFormat = require("../metrics_format_helper").numberFormat,
  dateFormat = require("../metrics_format_helper").dateFormat,
  getTotalDescriptionByPeriod = require("../metrics_format_helper")
    .getTotalDescriptionByPeriod,
  getChartIntervalLabel = require("../metrics_format_helper")
    .getChartIntervalLabel,
  IntervalSelect = require("../basic/IntervalSelect"),
  TotalItem = require("../basic/TotalItem"),
  Table = require("../basic/Table"),
  LinearChart = require("../basic/LinearChart");

class Mobile extends React.Component {
  getChartData = () => {
    var period = this.props.period;

    var result = {
      labels: [],
      data: [[], []]
    };

    _.each(this.props.data, function(item) {
      // labels
      result.labels.push(
        getChartIntervalLabel(period, item.date).toUpperCase()
      );
      // desktop
      result.data[0].push(item.desktop);
      // mobile
      result.data[1].push(item.mobile);
    });

    return result;
  };

  getTableData = () => {
    var period = this.props.period;

    return _.map(this.props.data, function(item) {
      return {
        mobile: numberFormat(item.mobile),
        desktop: numberFormat(item.desktop),
        date: dateFormat(period, item.date)
      };
    });
  };

  getTableHead = () => {
    return [
      {
        title: "",
        dataKey: "date"
      },
      {
        title: "MOBILE",
        dataKey: "mobile"
      },
      {
        title: "DESKTOP",
        dataKey: "desktop"
      }
    ];
  };

  render() {
    var data = this.props.data;
    var description = getTotalDescriptionByPeriod(this.props.period);

    return (
      <div>
        <div className="brz-ed-popup-metrics-body">
          <div className="brz-ed-popup-metrics-chart">
            <LinearChart data={this.getChartData()} />
          </div>
          <div className="brz-ed-popup-metrics-total">
            <TotalItem
              title="DESKTOP:"
              sumKey="desktop"
              data={data}
              description={description}
              addClass="brz-ed-popup-metrics-total-item-blue"
            />
            <TotalItem
              title="MOBILE:"
              sumKey="mobile"
              data={data}
              description={description}
              addClass="brz-ed-popup-metrics-total-item-green"
            />
          </div>
          <div className="brz-ed-popup-metrics-table">
            <Table
              head={this.getTableHead()}
              data={this.getTableData()}
              addClass="brz-ed-popup-metrics-table-traffic"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Mobile;
