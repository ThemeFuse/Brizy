var React = require("react"),
  _ = require("underscore"),
  classnames = require("classnames"),
  WebAPIUtils = require("visual/helper/utils/WebAPIUtils");

class DNS extends React.Component {
  static defaultProps = {
    onChange: _.noop
  };

  state = {
    loading: true,
    dns: {}
  };

  componentDidMount() {
    this.getDNS();
  }

  getDNS = () => {
    WebAPIUtils.connectDomain(this.props.activeDomain["id"])
      .then(
        function(r) {
          this.setState({
            dns: r,
            loading: false
          });
        }.bind(this)
      )
      .catch(
        function(e) {
          this.setState({
            loading: false
          });
          console.log("connect Domains: failed to connect domains", e);
        }.bind(this)
      );

    this.setState({
      loading: true
    });
  };

  render() {
    var className = classnames("brz-ed-popup-metrics-cols", {
      loading: this.state.loading
    });
    return (
      <div className={className}>
        <div className="brz-ed-popup-back-btn">
          <button
            className="brz-button brz-ed-btn brz-ed-btn-dark-outline"
            onClick={this.props.handleTabChange.bind(null, "list")}
          >
            <i className="brz-ed-icon-arrow-save" /> Back
          </button>
        </div>

        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">
            DNS Settings for{" "}
            <span className="brz-span title-alt">{this.props.activeDomain["name"]}</span>
          </h3>
          <p className="brz-p">
            Here you can see DNS entries needed to connect your domain. Entries
            highlighted in red should be changed to correct data from required
            column. Log in to your domain provider to edit these settings. If
            you need help with changing DNS settings you can always contact your
            domain provider.
          </p>
        </div>

        <div className="brz-ed-popup-metrics-body">
          <div className="brz-ed-popup-domain-dns">
            <div className="brz-ed-popup-domain-dns-row brz-ed-popup-domain-dns-row-head">
              <div className="brz-ed-popup-domain-dns-cell">HOST</div>
              <div className="brz-ed-popup-domain-dns-cell">RECORD</div>
              <div className="brz-ed-popup-domain-dns-cell">REQUIRED</div>
              <div className="brz-ed-popup-domain-dns-cell">CURRENT</div>
            </div>
            {_.map(this.state.dns, function(item, index) {
              return (
                <div
                  key={"dns-row-" + index}
                  className="brz-ed-popup-domain-dns-row brz-ed-popup-domain-dns-row-body"
                >
                  <div className="brz-ed-popup-domain-dns-cell">
                    {item["required_data"]["host"]}
                  </div>
                  <div className="brz-ed-popup-domain-dns-cell">
                    {item["required_data"]["type"]}
                  </div>
                  <div className="brz-ed-popup-domain-dns-cell">
                    {item.code == 204 ? "" : item["required_data"]["target"]}
                  </div>
                  <div className="brz-ed-popup-domain-dns-cell">
                    <span
                      className={item.code == 200 ? "brz-span text-green" : "brz-span text-red"}
                    >
                      {item.code == 404
                        ? "Record not found"
                        : item["current_data"]["target"]}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="brz-ed-popup-domain-dns-row brz-ed-popup-domain-dns-row-foot">
              <div className="brz-ed-popup-domain-dns-cell">
                <button
                  className="brz-button brz-ed-btn brz-ed-btn-dark"
                  onClick={this.getDNS}
                >
                  REFRESH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DNS;
