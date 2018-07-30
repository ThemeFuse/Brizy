var _ = require("underscore"),
  React = require("react"),
  classnames = require("classnames"),
  Config = require("visual/global/Config"),
  AddDomain = require("./../../basic/addDomain"),
  WebAPIUtils = require("visual/helper/utils/WebAPIUtils");

class List extends React.Component {
  state = {
    loading: false
  };

  componentDidMount() {
    this.getList();
  };

  onChangePrimary = (domain, event) => {
    var key = _.indexOf(this.props.list, domain),
      list = this.props.list,
      data = {
        is_primary: 1
      };
    event.stopPropagation();

    WebAPIUtils.updateDomains(domain.id, data)
      .then(function (r) {
          if (r.code == 200) {
            var index, is_primary;
            is_primary = _.findWhere(this.props.list, {is_primary: true});
            if (is_primary) {
              index = _.lastIndexOf(this.props.list, is_primary);
              list[index]["is_primary"] = false;
            }
            list[key]["is_primary"] = !domain.is_primary;
            this.setState({
              loading: false
            });
            this.props.changeList(list);
          }
        }.bind(this)
      ).catch(function (e) {
      this.setState({
        loading: false
      });
      console.log("Update Domains: failed to update domains", e);
    }.bind(this));

    this.setState({
      loading: true
    });
  };

  onChangeTabDns = activeDomain => {
    this.props.activePage("dnsSetting", activeDomain);
  };

  onDisconnectDomain = domain => {
    WebAPIUtils.deleteDomains(domain.id)
      .then(function () {
          var newList = _.without(this.props.list, domain);
          this.setState({
            loading: false
          });
          this.props.changeList(newList);
        }.bind(this)
      ).catch(function (e) {
      this.setState({
        loading: false
      });
      console.log("Delete Domains: failed to delete domains", e);
    }.bind(this));

    this.setState({
      loading: true
    });
  };

  getList = () => {
    var data = {
      orderBy: "key"
    };

    WebAPIUtils.getDomains(data)
      .then(function (r) {
        this.setState({
          loading: false
        });
        this.props.changeList(r);
      }.bind(this))
      .catch(function (e) {
        console.log("Get Domains: failed to load domains", e);
      });

    this.setState({
      loading: true
    });
  };

  renderDisconnectButton = domain => {
    return domain.type != "subdomain" ? (
      <div className="domain-disconnect">
        <span className="brz-span separator">|</span>
        <a href="#" className="brz-a" onClick={this.onDisconnectDomain.bind(null, domain)}>Disconnect</a>
      </div>
    ) : null;
  };

  renderList = () => {
    var _this = this;
    var list = _.sortBy(this.props.list, function (index) {
      return index.type;
    });
    list = list.reverse();

    return _.map(list, function (item, index) {
      return (
        <div key={"domain-box-" + index}>
          <div className="brz-ed-popup-domain-box clearfix">
            <div className="brz-ed-popup-domain-box-description">
              <div className="brz-ed-popup-domain-box-name">
                {item.name + (item.type == "subdomain" ? "." + Config.get("hosts").origin
                  : "")}</div>
              <div className="brz-ed-popup-domain-box-meta">
                <span className="brz-span domain-type">{item.type}</span>
                {_this.renderSettings(item)}
                {_this.renderDisconnectButton(item)}
              </div>
            </div>

            <div className="brz-ed-popup-domain-box-status">
              {_this.renderStatus(item)}
            </div>
          </div>
          {item.type == "subdomain" ? (<div className="brz-ed-popup-metrics-divider-line"/>
          ) : null}
        </div>
      );
    });
  };

  renderSettings = domain => {
    return domain.type != "subdomain" ? (
      <span className="brz-span">
                <span className="brz-span separator">|</span>
                <span className="brz-span domain-prefix"/>
                <a href="#" className="brz-a" onClick={this.onChangeTabDns.bind(null, domain)}>DNS Settings</a>
            </span>) : null;
  };

  renderStatus = status => {

    if (status.is_primary) {
      return (
        <div className="brz-ed-ribbon brz-ed-ribbon-green">Primary Domain</div>
      );
    } else if (status.is_active) {
      return (
        <div className="brz-ed-btn brz-ed-btn-dark brz-ed-btn-sm" onClick={this.onChangePrimary.bind(this, status)}
        > MAKE PRIMARY
        </div>
      );
    } else {
      return (
        <div className="brz-ed-ribbon brz-ed-ribbon-red">NOT VERIFIED</div>
      );
    }
  };

  render() {
    var className = classnames("brz-ed-popup-metrics-cols", {
      loading: this.state.loading
    });
    return (
      <div className={className}>
        <div className="brz-ed-popup-metrics-cols-left brz-ed-popup-metrics-divider-vertical">
          <div className="brz-ed-popup-metrics-head">
            <h3 className="brz-h3">DOMAINS LIST</h3>
            <p className="brz-p">List of all domains associated with this project:</p>
          </div>
          <div className="brz-ed-popup-metrics-body">

            {this.renderList()}

          </div>
        </div>

        <AddDomain handleTabChange={this.props.handleTabChange}/>

      </div>
    );
  }
}

export default List;
