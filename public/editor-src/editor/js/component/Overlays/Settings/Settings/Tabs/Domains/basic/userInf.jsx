var React = require('react'),
    _ = require('underscore');

class UserData extends React.Component {
    render() {
        return <form>
            <div>First Name</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'first_name')} value={this.props.data.first_name}/>
            </div>
            <div>Last Name</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'last_name')} value={this.props.data.last_name}/>
            </div>
            <div>Org name</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'org_name')} value={this.props.data.org_name}/>
            </div>
            <div>Email</div>
            <div>
                <input className="brz-input form-control" pattern="^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$" type='text' required  onChange={this.props.handleChange.bind(null, 'email')} value={this.props.data.email}/>
            </div>
            <div>Phone</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'phone')} value={this.props.data.phone}/>
            </div>
            <div>Address 1</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'address1')} value={this.props.data.address1}/>
            </div>
            <div>Address 2</div>
            <div>
                <input className="brz-input form-control" type='text'  onChange={this.props.handleChange.bind(null, 'address2')} value={this.props.data.address2}/>
            </div>
            <div>Address 3</div>
            <div>
                <input className="brz-input form-control" type='text'  onChange={this.props.handleChange.bind(null, 'address3')} value={this.props.data.address3}/>
            </div>
            <div>City</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'city')} value={this.props.data.city}/>
            </div>
            <div>State</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'state')} value={this.props.data.state}/>
            </div>
            <div>Country</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'country')} value={this.props.data.country}/>
            </div>
            <div>Postal code</div>
            <div>
                <input className="brz-input form-control" type='text' required  onChange={this.props.handleChange.bind(null, 'postal_code')} value={this.props.data.postal_code}/>
            </div>
            <div>Fax</div>
            <div>
                <input className="brz-input form-control" type='text'  onChange={this.props.handleChange.bind(null, 'fax')} value={this.props.data.fax}/>
            </div>
            <div>
                <button className="brz-button" onClick = {this.props.onSave}>Save</button>
            </div>
        </form>
    }
}


export default UserData;
