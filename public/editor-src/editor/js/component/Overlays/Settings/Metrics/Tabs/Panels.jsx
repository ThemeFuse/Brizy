var _ = require("underscore"),
  React = require("react"),
  getDataApi = require("../metrics_request_helper"),
  IntervalSelect = require("../basic/IntervalSelect");

var tabs = {
  traffic: require("./Traffic"),
  mobile: require("./Mobile"),
  refferers: require("./Refferers"),
  popular: require("./Popular"),
  search: require("./Search")
};

class TabPanel extends React.Component {
  state = {
    period: "day",
    data: null,
    isLoading: true
  };

  componentDidMount() {
    this.makeRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.makeRequest(nextProps.active);
    }
  }

  getLoading = () => {
    if (this.state.isLoading) {
      return (
        <div className="brz-ed-popup-metrics-loading">
          <span className="brz-span">Loading...</span>
        </div>
      );
    }
    return null;
  };

  handleChangePeriod = value => {
    if (this.state.period !== value) {
      this.setState(
        {
          period: value,
          data: null
        },
        this.makeRequest
      );
    }
  };

  makeRequest = active => {
    var _this = this;

    if (!this.state.isLoading) {
      this.setState({
        isLoading: true,
        data: null
      });
    }
    getDataApi({
      method: active || this.props.active,
      period: this.state.period,
      success: function(data) {
        _this.setState({
          isLoading: false,
          data: data
        });
      },
      error: function(data) {
        //console.error("error", data);
        _this.setState({
          isLoading: false,
          data: []
        });
      }
    });
  };

  showContent = () => {
    var tab = tabs[this.props.active];
    var props = _.chain(this.state)
      .pick("period", "data")
      .value();
    return _.isArray(this.state.data) && this.state.data.length == 0 ? (
      <div className="brz-ed-popup-metrics-body">
        <div className="brz-ed-alert brz-ed-alert-error">
          <strong>
            There is no data for selected period, try to change period.
          </strong>
        </div>
      </div>
    ) : (
      React.createElement(tab, props)
    );
  };

  render() {
    var title = _.findWhere(this.props.tabsData, { id: this.props.active })
      .title;
    return (
      <div className="brz-ed-popup-metrics-tab-panel">
        <div className="brz-ed-popup-metrics-head">
          <IntervalSelect
            onChange={this.handleChangePeriod}
            selected={this.state.period}
          />
          <h3 className="brz-h3">{title}</h3>
        </div>
        {!this.state.isLoading ? this.showContent() : ""}
        {this.getLoading()}
      </div>
    );
  }
}

export default TabPanel;
