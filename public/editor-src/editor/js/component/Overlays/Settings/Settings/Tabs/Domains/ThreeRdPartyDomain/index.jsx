var React = require('react'),
    _ = require('underscore');

var tabs = {
    addDomain: require("./Tabs/AddDomain"),
    dnsSetting: require("./Tabs/DnsSetting")
};

class ThirdParty extends React.Component {
    state = {
        active_tab: "addDomain",
        activeDomain: {},
        cart: []
    };

    getActivePage = (active, activeDomain) => {
        this.setState({active_tab: active, activeDomain: activeDomain});
    };

    render() {
        var tab = tabs[this.state.active_tab];
        var props = _.pick(this.props, 'data');
        _.extend(props, {
            activePage: this.getActivePage,
            handleTabChange: this.props.onChange,
            activeDomain: this.state.activeDomain
        });
        return React.createElement(tab, props);
    }
}

export default ThirdParty;

