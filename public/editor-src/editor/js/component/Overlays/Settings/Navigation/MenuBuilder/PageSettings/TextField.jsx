var React = require('react');
var ReactDOM = require('react-dom');

class TextField extends React.Component {
    handleChange = () => {
        this.props.onChange(ReactDOM.findDOMNode(this).value);
    };

    render() {
        return (
            <input className="brz-input" value={this.props.value} onChange={this.handleChange} type="text" />
        );
    }
}

export default TextField;
