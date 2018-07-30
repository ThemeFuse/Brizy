var _ = require("underscore"),
  React = require("react"),
  jQuery = require("jquery"),
  numeral = require("numeral"),
  Chart = require("chart.js");

var COLORS = [
  "#62bcd9",
  "#8e7fd1",
  "#b1f9d8",
  "#79a5bd",
  "#d89ce1",
  "#dd9747",
  "#e7d26e",
  "#9cd6e2"
];
var COLORS_H = [
  "#56b0d2",
  "#7a6cc9",
  "#a3f8d1",
  "#6996b1",
  "#d18bdc",
  "#d8843e",
  "#e2ca60",
  "#8bcfdd"
];

var options = {
  segmentShowStroke: false,
  legendTemplate: [
    "<ul class='brz-ul'>",
    "<% var total = 0; for (var i=0; i<segments.length; i++){ total += segments[i].value; } %>",
    "<% for (var i=0; i<segments.length; i++){%>",
    '<li class="brz-li" style="border-left-color: <%=segments[i].fillColor%>">',
    '<strong class="value" data-value="<%=100 * segments[i].value / total%>">0,0%</strong>',
    '<span class="brz-span"><a href="http://<%=segments[i].label%>" class="brz-a" target="_blank"><%=segments[i].label%></a></span>',
    "</li>",
    "<%}%>",
    "</ul>"
  ].join(""),
  animationEasing: "easeOutSine"
};

// global
var chart;

class PieChart extends React.Component {
  static defaultProps = {
    width: 250,
    height: 250
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
    var ctx = this.canvas.getContext("2d");
    var data = this.props.data;

    var collected_data;
    if (data.length > 8) {
      collected_data = data.slice(0, 7);
      collected_data.push({
        label: "Others",
        value: _.reduce(
          data.slice(7),
          function(memo, item) {
            return memo + item.value;
          },
          0
        )
      });
    } else {
      collected_data = data;
    }

    var data_chart = _.map(collected_data, function(v, i) {
      return {
        color: COLORS[i],
        highlight: COLORS_H[i],
        value: v.value,
        label: v.label
      };
    });

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx).Pie(data_chart, options);

    jQuery(this.legend)
      .html(chart.generateLegend())
      .find(".value")
      .each(function() {
        var num = Number($(this).data("value"));
        if (num) {
          $(this).text(numeral(num).format("0,0.00") + "%");
        }
      });
  };

  render() {
    return (
      <div className="brz-ed-popup-metrics-pie-chart">
        <div className="brz-ed-popup-metrics-pie-chart-left">
          <canvas
            ref={el => {
              this.canvas = el;
            }}
            width={this.props.width}
            height={this.props.height}
          />
        </div>
        <div
          className="brz-ed-popup-metrics-pie-chart-legend"
          ref={el => {
            this.legend = el;
          }}
        />
      </div>
    );
  }
}

export default PieChart;
