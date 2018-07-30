var React = require('react');

class TextArea extends React.Component {
    handleChange = (event) => {
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <textarea className="brz-textarea" onChange={this.handleChange} value={this.props.value} />
        );
    }
}

export default TextArea;