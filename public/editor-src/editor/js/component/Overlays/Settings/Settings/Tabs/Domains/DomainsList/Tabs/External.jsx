var React = require("react"),
  DNS = require("./../../basic/getDNS"),
  _ = require("underscore");

class external extends React.Component {
  state = {
    InfDomain: this.props.list[this.props.InfDomain]
  };

  connectDisconectDomain = () => {
    var _this = this,
      InfOneDomain = this.state.InfDomain,
      list = this.props.list;
    var method = InfOneDomain["is_active"] ? "DELETE" : "PUT";
    var url = InfOneDomain["is_active"]
      ? "projects/{%projectId%}/domains/" + InfOneDomain["id"] + ".json"
      : "projects/{%projectId%}/domains/" +
        InfOneDomain["id"] +
        "/connect.json";
    this.props.sendRequest({
      type: method,
      url: url,
      data: {},
      callbackSuccess: function(data) {
        var is_active = _.findWhere(_this.props.list, {
          id: InfOneDomain["id"]
        });
        var index = _.lastIndexOf(_this.props.list, is_active);
        if (InfOneDomain["is_active"]) {
          list.splice(index, 1);
          _this.props.activePage("list");
          _this.props.changeList(list);
        } else {
          console.log("data", data);
        }
      }
    });
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

  showDns = data => {
    this.props.sendRequest({
      type: "PUT",
      url:
        "projects/{%projectId%}/domains/" +
        this.state.InfDomain["id"] +
        "/connect.json",
      data: {},
      key: "dns"
    });
    this.props.activePage("dnsSetting");
  };

  useWWWprefix = event => {
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
            onClick={this.showDns}
            className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default"
          >
            DNS Settings
          </button>
        </div>
        <div>
          <button className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default">
            Add Email
          </button>
        </div>
        <div>
          {data["is_primary"] ? (
            ""
          ) : (
            <button
              onClick={this.connectDisconectDomain}
              className="brz-button brz-ed-large-popup-content-domain-settingsOneDomain-button btn btn-default"
            >
              {data["is_active"] ? "Disconnect Domain" : "Connect Domain"}
            </button>
          )}
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
      </div>
    );
  }
}

export default external;
