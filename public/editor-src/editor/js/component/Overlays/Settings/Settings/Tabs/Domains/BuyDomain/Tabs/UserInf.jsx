var React = require('react'),
    UserData = require('./../../basic/userInf'),
    _ = require('underscore');

class UserInf extends React.Component {
    state = {
        response: [],
        first_name: "User Name",
        last_name: "Last Name",
        org_name: "Org Name",
        email: "testUser@sadsd.ru",
        phone: "123456789",
        address1: "Adress1",
        address2: "Adress2",
        address3: "Adress3",
        city: "City",
        state: "State",
        country: "MD",
        postal_code: "2312",
        fax: ""
    };

    handleChange = (name, e) => {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    };

    saveUserInf = () => {
        var _this = this,key, data = {},i = 0;
        data = _.pick(this.state,"first_name","last_name","org_name","email","phone","address1","address2","address3","city","state","country","postal_code","fax");
        _.each(this.props.cart, function (index) {
            key = "domain[" + i + "]";
            data[key] = index.domain;
            i++;
        });

        this.props.sendRequest({
            type: "POST",
            url: "projects/{%projectId%}/domains/purchases.json",
            data: data,
            key: "userInf",
            callbackSuccess: function (data) {
                _this.setState({response: data});
            }
        });
    };

    statusDomains = () => {
        return _.map(this.state.response, function (item) {
            return <div className={"domain-response " + (item.code == 200 ? "success" : "error")}>{item.domain}</div>
        });
    };

    render() {
        return <div>
            <button onClick = {this.props.activePage.bind(null, "listCartDomain")}
                    className='brz-button btn btn-primary'>&lt;-- Back</button>
            <UserData onSave={this.saveUserInf}
                      handleChange={this.handleChange}
                      data={this.state} />
            {this.statusDomains()}
        </div>
    }
}


export default UserInf;
