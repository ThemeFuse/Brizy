var _ = require('underscore'),
    React = require('react'),
    ReactDOM = require('react-dom');

class CodeMirrorWrapper extends React.Component {
    static defaultProps = function() {
        onChange: _.noop
    }();

    componentDidMount() {
        var editor = CodeMirror.fromTextArea(ReactDOM.findDOMNode(this), {
            extraKeys: {
                "Ctrl-Space": 'autocomplete'
            },
            lineNumbers: true,
            indentUnit: 4,
            viewportMargin: 10
        });

        editor.doc.cm.on('change', function(cm) {
            this.props.onChange(cm.doc.getValue());
        }.bind(this));
    }

    render() {
        return <textarea className="brz-textarea" readOnly defaultValue={this.props.value} />;
    }
}

export default CodeMirrorWrapper;
