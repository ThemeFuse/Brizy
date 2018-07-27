var React = require('react'),
    jQuery = require('jquery'),
    _ = require('underscore');

class AuthKey extends React.Component {
    state = {};

    render() {
        return (
            <div>
                <button onClick={this.props.activePage.bind(null, this.props.list[this.props.InfDomain]['type'])} className='brz-button btn btn-primary'>&lt;--
                    Back
                </button>
                <div>{this.props.data.authKey ? this.props.data.authKey['domain_auth_info'] : ""}</div>
            </div>
        );
    }
}

export default AuthKey;