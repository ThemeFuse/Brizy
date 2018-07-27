var React = require("react"),
  classnames = require("classnames"),
  WebAPIUtils = require("visual/helper/utils/WebAPIUtils");

var re = /^(?:[-a-z0-9]+\.)+[a-z]{2,30}$/;

class AddDomain extends React.Component {
  state = {
    title: "",
    error: null,
    loading: false
  };

  onChange = event => {
    this.setState({ title: event.target.value });
  };

  onSaveDomain = event => {
    event.preventDefault();
    if (!re.test(this.state.title)) {
      this.setState({
        error: {
          message: "Please match the requested format"
        }
      });

      return;
    }

    var data = {
      type: "external",
      name: this.state.title
    };

    WebAPIUtils.setDomains(data)
      .then(
        function(r) {
          this.setState(
            {
              loading: false
            },
            function() {
              this.props.activePage("dnsSetting", r);
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(
        function(e) {
          this.setState({
            error: JSON.parse(e),
            loading: false
          });
        }.bind(this)
      );

    this.setState({
      error: null,
      loading: true
    });
  };

  getError = () => {
    var error = this.state.error;
    if (error) {
      return (
        <div className="brz-ed-alert brz-ed-alert-error">
          <strong>Error:</strong> {error.message}
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
          <h3 className="brz-h3">USE 3RD PARTY DOMAIN</h3>
          <p className="brz-p">
            Connect your own domain, that you’ve already purchased from a 3rd
            party provider.
          </p>
        </div>

        <div className="brz-ed-popup-metrics-cols-left brz-ed-popup-metrics-divider-vertical">
          <div className="brz-ed-popup-metrics-body">
            <div className="brz-ed-popup-form brz-ed-popup-add-domain-form">
              {this.getError()}

              <form onSubmit={this.onSaveDomain}>
                <div className="form-group">
                  <label className="brz-label" htmlFor="domain-name">Domain Name</label>
                  <input
                    className="brz-input form-control"
                    id="domain-name"
                    type="text"
                    placeholder="my-example.com"
                    value={this.state.title}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-submit">
                  <button className="brz-button brz-ed-btn brz-ed-btn-dark">
                    CONNECT DOMAIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="brz-ed-popup-metrics-cols-right">
          <div className="brz-ed-popup-metrics-body">
            <div className="brz-ed-popup-metrics-body-text">
              <div className="popup-icon-info">i</div>
              <p className="brz-p">
                Here you can connect your already purchased domain, which will
                overwrite the free subdomain you are currently using. Follow the
                steps to make the switch in no time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDomain;
