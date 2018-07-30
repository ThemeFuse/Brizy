var _ = require("underscore"),
  React = require("react"),
  classnames = require("classnames"),
  Config = require("visual/global/Config"),
  WebAPIUtils = require("visual/helper/utils/WebAPIUtils");

var re = /^[-a-z0-9]+$/;

class SubDomain extends React.Component {
  state = {
    title: "",
    loading: true,
    status: {}
  };

  componentDidMount() {
    this.getSubDomain();
  }

  onChange = event => {
    this.setState({ title: event.target.value });
  };

  onSaveSubDomain = event => {
    event.preventDefault();
    if (!re.test(this.state.title)) {
      this.setState({
        status: {
          code: 400,
          data: {
            message: "Please match the requested format"
          }
        }
      });

      return;
    }

    var data = {
      type: "subdomain",
      name: this.state.title
    };

    WebAPIUtils.setDomains(data)
      .then(
        function(r) {
          this.setState({
            status: {
              code: 200,
              data: r
            },
            loading: false
          });
        }.bind(this)
      )
      .catch(
        function(e) {
          this.setState({
            status: {
              code: 400,
              data: JSON.parse(e)
            },
            loading: false
          });
        }.bind(this)
      );

    this.setState({
      status: {},
      loading: true
    });
  };

  getSubDomain = () => {
    var data = {
      type: "subdomain"
    };
    return WebAPIUtils.getDomains(data)
      .then(
        function(r) {
          if (_.isEmpty(r)) {
            throw JSON.stringify({
              message: "Failed to load subdomain"
            });
          }
          this.setState({
            title: r[0].name,
            loading: false
          });
        }.bind(this)
      )
      .catch(
        function(e) {
          this.setState({
            status: {
              code: 400,
              data: JSON.parse(e)
            },
            loading: false
          });
        }.bind(this)
      );
  };

  renderMessage = () => {
    if (_.isEmpty(this.state.status)) return false;
    var status = this.state.status;

    if (status.code == 200) {
      return (
        <div className="brz-ed-alert brz-ed-alert-success">
          <strong>Success:</strong> Your subdomain was changed successfully.
        </div>
      );
    }
    if (status.code == 400) {
      return (
        <div className="brz-ed-alert brz-ed-alert-error">
          <strong>Error:</strong>{" "}
          {status.data.message || status.data.error_description}
        </div>
      );
    }
    return null;
  };

  render() {
    var className = classnames("brz-ed-popup-metrics-cols", {
      loading: this.state.loading
    });
    return (
      <div className={className}>
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">SUBDOMAIN</h3>
          <p className="brz-p">This is your free subdomain for your BitBlox project.</p>
        </div>

        <div className="brz-ed-popup-metrics-cols-left brz-ed-popup-metrics-divider-vertical">
          <div className="brz-ed-popup-metrics-body">
            <form onSubmit={this.onSaveSubDomain}>
              <div className="brz-ed-popup-form brz-ed-popup-domain-rename-form">
                {this.renderMessage()}

                <h4 className="brz-h4">YOUR SUBDOMAIN NAME</h4>

                <div className="form-inline clearfix">
                  <div className="form-group">
                    <input
                      className="brz-input form-control"
                      type="text"
                      value={this.state.title}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group input-group-addon">
                    <div>.{Config.get("hosts").origin}</div>
                  </div>
                </div>

                <div className="form-group input-group-btn">
                  <button className="brz-button brz-ed-btn brz-ed-btn-dark">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="brz-ed-popup-metrics-cols-right">
          <div className="brz-ed-popup-metrics-body">
            <div className="brz-ed-popup-metrics-body-text">
              <div className="popup-icon-info">i</div>
              <p className="brz-p">
                Choose the name of your free subdomain hosted with BitBlox
                platform. This will be the address where visitors can view your
                website. You can change this to your own subdomain here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubDomain;
