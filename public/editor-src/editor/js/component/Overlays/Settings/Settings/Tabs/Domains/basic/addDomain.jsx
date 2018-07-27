var React = require("react"),
  jQuery = require("jquery"),
  _ = require("underscore");

class addDomain extends React.Component {
  render() {
    return (
      <div className="brz-ed-popup-metrics-cols-right">
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">ADD DOMAIN</h3>
          <p className="brz-p">Connect a new domain:</p>
        </div>

        <div className="brz-ed-popup-metrics-body">
          <div className="brz-ed-popup-metrics-body-text">
            This is the domains list for your BitBlox website. here you can add,
            remove and set primary domains.
          </div>
          <button
            onClick={this.props.handleTabChange.bind(null, "external")}
            type="button"
            className="brz-button brz-ed-btn brz-ed-btn-teal brz-ed-btn-full"
          >
            Connect 3rd Party Domain
          </button>
        </div>
      </div>
    );
  }
}

export default addDomain;
