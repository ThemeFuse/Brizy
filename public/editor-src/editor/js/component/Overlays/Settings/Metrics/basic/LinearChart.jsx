var _ = require("underscore"),
  React = require("react"),
  Chart = require("chart.js"),
  ReactDOM = require("react-dom");

var COLORS = ["#219dd0", "#a0b751"]; //ec0016 ec00b7
var FILL_COLORS = ["rgba(33,157,208, 0.15)", "rgba(160,183,81, 0.15)"]; //ec0016 ec00b7
//var COLORS = ['#219dd0', '#a0b751'];

var options = {
  datasetFill: true,
  bezierCurve: true,
  pointDotRadius: 4,
  datasetStrokeWidth: 2,
  pointDotStrokeWidth: 1,
  scaleFontColor: "#9ea9b1",
  tooltipFillColor: "rgba(3,8,15,0.9)",
  tooltipTitleFontColor: "#cccfd1",
  tooltipFontColor: "#a6a8aa",
  tooltipTitleFontSize: 12,
  tooltipFontSize: 12,
  scaleShowVerticalLines: false
};

// global
var chart;

class LineChart extends React.Component {
  static defaultProps = {
    width: 730,
    height: 300
  };

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillUnmount() {
    chart.destroy();
  }

  updateChart = () => {
    var ctx = jQuery(ReactDOM.findDOMNode(this))
      .children()
      .get(0)
      .getContext("2d");
    var data = this.props.data;

    var datasets = _.map(data.data, function(item, index) {
      return {
        pointColor: COLORS[index],
        strokeColor: COLORS[index],
        pointStrokeColor: "#fff",
        pointHighlightStroke: COLORS[index],
        pointHighlightFill: "#fff",
        fillColor: FILL_COLORS[index],
        data: item
      };
    });

    if (chart) {
      chart.clear();
      chart.destroy();
    }
    // hack. remake
    if (
      jQuery(ReactDOM.findDOMNode(this))
        .closest(".brz-ed-large-popup-body.active")
        .get(0)
    ) {
      chart = new Chart(ctx).Line(
        {
          labels: data.labels,
          datasets: datasets
        },
        options
      );
    }
  };

  render() {
    return (
      <div>
        <canvas
          ref={el => {
            this.canvas = el;
          }}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

export default LineChart;
