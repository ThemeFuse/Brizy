var _ = require("underscore"),
  React = require("react");

function arrToggle(arr, value) {
  var index = arr.indexOf(value);
  var newArray = _.clone(arr);
  if (index === -1) {
    newArray.push(value);
  } else {
    newArray.splice(index, 1);
  }
  return newArray;
}

function getActiveTreeNodes(list, active) {
  var res = [];
  _.each(list, function(node) {
    var activeChildren = getActiveTreeNodes(node.children, active);
    if (node.id === active || activeChildren.length) {
      res.push(node.id);
    }
    res = _.union(res, activeChildren);
  });
  return res;
}

class TreeView extends React.Component {
  static defaultProps = {
    data: [],
    active: "",
    onChange: _.noop,
    pre: _.noop
  };

  constructor(props) {
    super(props);
    const { data, active } = props;

    this.state = {
      opened: [],
      active: active ? getActiveTreeNodes(data, active) : []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.setState({
        active: getActiveTreeNodes(nextProps.data, nextProps.active)
      });
    }
  }

  getNode = (depth, node) => {
    var icon;
    if (node.icon) {
      icon = this.props.pre(node.icon);
    }

    var className = [
      "brz-li brz-ed-popup-tabs-item",
      this.isActive(node.id) ? "brz-ed-popup-tabs-item-active" : ""
    ].join(" ");

    var children;
    if (node.children) {
      children = this.getTree(node.children, depth + 1);
    }

    return (
      <li className={className} key={"tab-item-" + node.id}>
        <div
          className={"brz-ed-popup-tabs-item-button"}
          onClick={this.handleChange.bind(null, node)}
        >
          {icon}
          <span className="brz-span">{node.title}</span>
        </div>
        {children}
      </li>
    );
  };

  getTree = (list, depth) => {
    var items = _.map(list, this.getNode.bind(null, depth));

    var className = [
      "brz-ul brz-ed-popup-tabs",
      "brz-ed-popup-tabs-depth-" + depth
    ].join(" ");

    return <ul className={className}>{items}</ul>;
  };

  handleChange = node => {
    var active = node.id;
    if (node.children) {
      this.toggleFolder(node.id);
      active = node.children[0].id;
    } else {
      this.setState({
        active: getActiveTreeNodes(this.props.data, node.id)
      });
    }
    this.props.onChange(active);
  };

  isActive = id => {
    return this.state.active.indexOf(id) !== -1;
  };

  isOpen = id => {
    return this.state.opened.indexOf(id) !== -1;
  };

  toggleFolder = id => {
    var newState = {
      opened: arrToggle(this.state.opened, id)
    };
    this.setState(newState);
  };

  render() {
    return this.getTree(this.props.data, 0);
  }
}

export default TreeView;
