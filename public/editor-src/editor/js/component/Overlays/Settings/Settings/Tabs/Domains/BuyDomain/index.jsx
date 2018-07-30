var React = require('react'),
    _ = require('underscore');

var tabs = {
    listCartDomain: require("./Tabs/ListDomain"),
    userInf: require("./Tabs/UserInf")
};

class Add extends React.Component {
    state = {
        active_tab: "listCartDomain",
        cart: []
    };

    activePage = (active) => {
        this.setState({active_tab: active});
    };

    changeCart = (item) => {
        var cart = this.state.cart;
        if (_.findWhere(this.state.cart, item)) {
            cart = _.reject(this.state.cart, function (num) {
                return num.domain == item.domain
            });
        } else {
            cart.push(item);
        }
        this.setState({cart: cart});
    };

    removeInCart = (item) => {
        var cart = _.without(this.state.cart, item);
        this.setState({cart: cart});
    };

    render() {
        var tab = tabs[this.state.active_tab];
        var props = _.pick(this.props, 'data');
        _.extend(props, {
            activePage: this.activePage,
            cart: this.state.cart,
            changeCart: this.changeCart,
            removeInCart: this.removeInCart
        });
        return (
            <div>
                {React.createElement(tab, props)}
            </div>
        );
    }
}

export default Add;
