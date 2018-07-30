var React = require('react'),
    _ = require('underscore'),
    WebAPIUtils = require('visual/helper/utils/WebAPIUtils');

var tabs = {
    list: require("./Tabs/List"),
    dnsSetting: require("./Tabs/DnsSetting"),
    authKey: require("./Tabs/AuthKey"),
    userInf: require("./Tabs/UserInf"),
    external: require("./Tabs/External"),
    interior: require("./Tabs/Interior"),
    subdomain: require("./Tabs/Subdomain")
};

class Built extends React.Component {
    state = {
        active_tab: "list",
        activeDomain: {},
        list: [],
        InfDomain: {},
        userInf : {}
    };

    onChangeList = (list) => {
        this.setState({list: list});
    };

    getActivePage = (active, activeDomain) => {
        this.setState({active_tab: active, activeDomain: activeDomain});
    };

    render() {
        var tab = tabs[this.state.active_tab];
        var props = _.pick(this.props, 'data');
        _.extend(props, {
            activePage: this.getActivePage,
            changeList: this.onChangeList,
            handleTabChange: this.props.onChange,
            list: this.state.list,
            activeDomain: this.state.activeDomain
        });
        return React.createElement(tab, props);
    }
}

export default Built;

