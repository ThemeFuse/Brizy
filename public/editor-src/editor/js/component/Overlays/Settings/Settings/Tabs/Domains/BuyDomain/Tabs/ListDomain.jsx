var React = require("react"),
  _ = require("underscore");

var prefixesList = ["com", "net", "org", "biz"];

class SearchDomain extends React.Component {
  state = {
    domainTitle: "",
    selectedPrefix: ""
  };

  getListDomain = () => {
    this.props.sendRequest({
      type: "GET",
      url: "domains/" + this.state.domainTitle + "/search.json",
      data: { tld: this.state.selectedPrefix },
      key: "listCartDomain"
    });
  };

  changeDomainTitle = event => {
    this.setState({ domainTitle: event.target.value });
  };

  changePrefix = event => {
    this.setState({ selectedPrefix: event.target.value });
  };

  showCart = () => {
    return !_.isEmpty(this.props.cart) ? (
      <Cart
        activePage={this.props.activePage}
        removeInCart={this.props.removeInCart}
        cart={this.props.cart}
      />
    ) : null;
  };

  showListMenu = () => {
    return this.props.data.listCartDomain ? (
      <ListDomain
        onChange={this.props.changeCart}
        cart={this.props.cart}
        data={this.props.data.listCartDomain}
      />
    ) : null;
  };

  render() {
    var options = _.map(prefixesList, function(index) {
      return <option value={index}>{index}</option>;
    });

    return (
      <div className="brz-ed-popup-metrics-cols">
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">BUY DOMAIN</h3>
          <p className="brz-p">
            Find your new domain name. It will be associated with your website.
          </p>
        </div>

        <div className="brz-ed-popup-metrics-cols-left brz-ed-popup-metrics-divider-vertical">
          <div className="brz-ed-popup-metrics-body">
            <div className="brz-ed-popup-form brz-ed-popup-domain-rename-form">
              <h4 className="brz-h4">DOMAIN NAME:</h4>

              <form onSubmit={this.getListDomain}>
                <div className="form-inline clearfix">
                  <div className="form-group">
                    <input
                      onChange={this.changeDomainTitle}
                      value={this.state.domainTitle}
                      pattern="^(?:[-A-Za-z0-9.])+$"
                      placeholder="example-domain.com"
                      type="text"
                      className="brz-input form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={this.state.selectedPrefix}
                      onChange={this.changePrefix}
                      className="form-control"
                    >
                      <option value="">All</option>
                      {options}
                    </select>
                  </div>
                </div>
                <div className="form-group input-group-btn">
                  <button type="submit" className="brz-button brz-ed-btn brz-ed-btn-dark">
                    CHECK AVAILIBILITY
                  </button>
                </div>
              </form>
            </div>

            {this.showListMenu()}
          </div>
        </div>

        <div className="brz-ed-popup-metrics-cols-right">
          <div className="brz-ed-popup-metrics-head">
            <h3 className="brz-h3">CART</h3>
            <p className="brz-p">This is your shopping cart:</p>
          </div>

          <div className="brz-ed-popup-metrics-body">{this.showCart()}</div>
        </div>
      </div>
    );
  }
}

class ListDomain extends React.Component {
  render() {
    var _this = this;
    return (
      <div className="brz-ed-popup-domain-search-list">
        <h4 className="brz-h4">Search results:</h4>
        {_.map(this.props.data, function(index) {
          return (
            <div
              className={
                "brz-ed-popup-domain-search-item clearfix " + index.status
              }
            >
              <div className="brz-ed-popup-domain-search-name">
                {index.domain}
              </div>
              <div className="brz-ed-popup-domain-search-status">
                {index.status == "available" ? (
                  <div
                    className="brz-ed-popup-domain-search-manage"
                    onClick={_this.props.onChange.bind(null, index)}
                  >
                    {_.findWhere(_this.props.cart, index) ? (
                      <span className="brz-span brz-ed-btn brz-ed-btn-dark brz-ed-btn-sm brz-ed-btn-full">
                        REMOVE
                      </span>
                    ) : (
                      <span className="brz-span brz-ed-btn brz-ed-btn-green brz-ed-btn-sm brz-ed-btn-full">
                        ADD
                      </span>
                    )}
                  </div>
                ) : (
                  index.status
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

class Cart extends React.Component {
  render() {
    var _this = this;
    return (
      <div>
        <div>
          {_.map(this.props.cart, function(index) {
            return (
              <div>
                <div>{index.domain}</div>
                <div onClick={_this.props.removeInCart.bind(null, index)}>
                  X
                </div>
              </div>
            );
          })}
        </div>
        <div className="save-domain">
          {!_.isEmpty(this.props.cart) ? (
            <button
              onClick={this.props.activePage.bind(null, "userInf")}
              className="brz-button brz-ed-btn brz-ed-btn-teal"
            >
              Save
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default SearchDomain;
