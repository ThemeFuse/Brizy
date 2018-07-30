var _ = require("underscore"),
  React = require("react"),
  Config = require("visual/global/Config");

class Subdomain extends React.Component {
  state = {
    title: this.props.list[this.props.InfDomain]["name"]
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  renameSubDomain = () => {
    this.props.sendRequest({
      type: "POST",
      url: "projects/{%projectId%}/domains.json",
      data: { type: "subdomain", name: this.state.title },
      key: "subdomain"
    });
  };

  render() {
    console.log("this.props", this.props);
    return (
      <div className="brz-ed-large-popup-content-domain-settingsOneDomain">
        <div>
          <button
            onClick={this.props.activePage.bind(null, "list")}
            className="brz-button btn btn-primary"
          >
            &lt;-- Back
          </button>
        </div>

        <div className="brz-ed-popup-form brz-ed-popup-domain-rename-form">
          <h4 className="brz-h4">RENAME SUBDOMAIN NAME:</h4>

          <form action="">
            <div className="form-inline clearfix">
              <div className="form-group">
                <input
                  pattern="/^[-a-z0-9]{3,20}$/"
                  onChange={this.handleChange}
                  value={this.state.title}
                  type="text"
                  className="brz-input form-control"
                />
              </div>
              <div className="form-group input-group-addon">
                <div>.{Config.get("hosts").origin}</div>
              </div>
              <div className="form-group input-group-btn">
                <button
                  type="button"
                  onClick={this.renameSubDomain}
                  className="brz-button brz-ed-btn brz-ed-btn-dark"
                >
                  Change
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Subdomain;
