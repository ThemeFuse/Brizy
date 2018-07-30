var _ = require('underscore'),
	React = require('react'),
	TreeView = require('../../basic/TreeView');

class Handlers extends React.Component {
    static defaultProps = {
        onChange: function() {}
    };

    getIcon = (className) => {
		return <i className={className} />;
	};

    render() {
		return <TreeView data={this.props.tabsData} onChange={this.props.onChange}
						 active={this.props.active} pre={this.getIcon} />;
	}
}

export default Handlers;
