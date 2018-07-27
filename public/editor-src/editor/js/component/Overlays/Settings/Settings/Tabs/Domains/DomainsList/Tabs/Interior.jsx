var React = require("react"),
  _ = require("underscore");

class interior extends React.Component {
  state = {
    InfDomain: this.props.list[this.props.InfDomain],
    activeTypeUser: "owner"
  };

  getAuthKey = () => {
    this.props.sendRequest({
      type: "GET",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        "/authcode.json",
      data: {},
      key: "authKey"
    });
    this.props.activePage("authKey");
  };

  changeLock = () => {
    var _this = this,
      InfOneDomain = this.state.InfDomain,
      list = this.props.list;
    var lock_state = InfOneDomain["lock_state"] ? 0 : 1;
    this.props.sendRequest({
      type: "PUT",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        ".json",
      data: { lock_state: lock_state },
      callbackSuccess: function(data) {
        if (data.code == 200) {
          list[_this.props.InfDomain]["lock_state"] = !InfOneDomain[
            "lock_state"
          ];
          _this.props.changeList(list);
        }
      }
    });
  };

  changeWhois = () => {
    var _this = this,
      InfOneDomain = this.state.InfDomain,
      list = this.props.list;
    var whois = InfOneDomain["whois"] ? 0 : 1;
    this.props.sendRequest({
      type: "PUT",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        ".json",
      data: { whois: whois },
      callbackSuccess: function(data) {
        if (data.code == 200) {
          list[_this.props.InfDomain]["whois"] = !InfOneDomain["whois"];
          _this.props.changeList(list);
        }
      }
    });
  };

  editUser = () => {
    var _this = this;
    this.props.sendRequest({
      type: "GET",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        "/contacts/" +
        this.state.activeTypeUser +
        ".json",
      data: {},
      callbackSuccess: function(data) {
        _this.props.changeUserInf(data);
      }
    });
    //this.props.activePage("userInf");
  };

  makePrimary = () => {
    var _this = this,
      InfOneDomain = this.state.InfDomain,
      list = this.props.list;
    this.props.sendRequest({
      type: "PUT",
      url: "projects/{%projectId%}/domains/" + InfOneDomain["id"] + ".json",
      data: { is_primary: 1 },
      callbackSuccess: function(data) {
        if (data.code == 200) {
          var is_primary = _.findWhere(_this.props.list, { is_primary: true });
          var index = _.lastIndexOf(_this.props.list, is_primary);
          list[index]["is_primary"] = false;
          list[_this.props.InfDomain]["is_primary"] = !InfOneDomain.is_primary;
          _this.props.changeList(list);
        }
      }
    });
  };

  useWWWprefix = () => {
    var _this = this,
      InfOneDomain = this.state.InfDomain,
      list = this.props.list;
    var www_prefix = InfOneDomain["www_prefix"] ? 0 : 1;
    this.props.sendRequest({
      type: "PUT",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        ".json",
      data: { www_prefix: www_prefix },
      callbackSuccess: function(data) {
        if (data.code == 200) {
          list[_this.props.InfDomain]["www_prefix"] = !InfOneDomain[
            "www_prefix"
          ];
          _this.props.changeList(list);
        }
      }
    });
  };

  render() {
    var data = this.state.InfDomain;

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
        {data["is_primary"] || !data["is_active"] ? (
          ""
        ) : (
          <button
            onClick={this.makePrimary}
            className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default"
          >
            Make Primary
          </button>
        )}
        <div>
          <button
            onClick={this.editUser}
            className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default"
          >
            Edit Users
          </button>
        </div>
        <div>
          <button className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default">
            Add Email
          </button>
        </div>
        <div>
          <button
            onClick={this.getAuthKey}
            className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default"
          >
            GET transfer key
          </button>
        </div>
        <div>
          <input
            className="brz-input"
            checked={data["www_prefix"] ? "checked" : ""}
            onChange={this.useWWWprefix}
            type="checkbox"
          />
          <span className="brz-span">Use www prefix</span>
        </div>
        <div>
          <input
            className="brz-input"
            checked={data["whois"] ? "checked" : ""}
            onChange={this.changeWhois}
            type="checkbox"
          />
          <span className="brz-span">Whois Pivacy</span>
        </div>
        <div>
          <input
            className="brz-input"
            checked={data["lock_state"] ? "checked" : ""}
            onChange={this.changeLock}
            type="checkbox"
          />
          <span className="brz-span">Lock domain</span>
        </div>
      </div>
    );
  }
}

export default interior;
