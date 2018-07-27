var React = require('react'),
    jQuery = require('jquery'),
    UserData = require('./../../basic/userInf'),
    _ = require('underscore');

class UserInf extends React.Component {
    state = this.props.userInf;

    handleChange = (name, e) => {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    };

    saveUserInf = () => {
        var key, data = {},i = 0, _this = this;
        data = _.pick(this.state,"first_name","last_name","org_name","email","phone","address1","address2","address3","city","state","country","postal_code","fax");
        _.each(this.props.cart, function (index) {
            key = "domain[" + i + "]";
            data[key] = index.domain;
            i++;
        });

        this.props.sendRequest({
            type: "PUT",
            url: "projects/{%projectId%}/domains/" + this.props.list[this.props.InfDomain]['id'] + "/contacts/owner.json",
            data: data,
            callbackSuccess: function (data) {
                _this.setState({response: data});
            }
        });
    };

    statusDomains = () => {
        var data = this.state.response;
        if (data) {
            return <div className={"domain-response " + (data.code == 200 ? "success" : "error")}>{data.domain}</div>
        } else {
            return null;
        }

    };

    render() {
        return (
            <div>
                <button onClick={this.props.activePage.bind(null, this.props.list[this.props.InfDomain]['type'])} className='brz-button btn btn-primary'>&lt;--
                    Back
                </button>
                <UserData onSave={this.saveUserInf} handleChange={this.handleChange} data={this.state} />
                {this.statusDomains()}
            </div>
        );
    }
}

export default UserInf;
