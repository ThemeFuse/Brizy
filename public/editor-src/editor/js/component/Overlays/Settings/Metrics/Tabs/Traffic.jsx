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

class Traffic extends React.Component {
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
      // visits
      result.data[0].push(item.visits);
      // pageViews
      result.data[1].push(item.pageView);
    });

    return result;
  };

  getTableData = () => {
    var period = this.props.period;

    return _.map(this.props.data, function(item) {
      return {
        visits: numberFormat(item.visits),
        pageView: numberFormat(item.pageView),
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
        title: "VISITS",
        dataKey: "visits"
      },
      {
        title: "PAGE VIEWS",
        dataKey: "pageView"
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
            <LinearChart data={this.getChartData()} />
          </div>
          <div className="brz-ed-popup-metrics-total">
            <TotalItem
              title="VISITS:"
              sumKey="visits"
              data={data}
              description={description}
              addClass="brz-ed-popup-metrics-total-item-blue"
            />
            <TotalItem
              title="PAGE VIEWS:"
              sumKey="pageView"
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

export default Traffic;
