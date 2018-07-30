var _ = require("underscore"),
  Config = require("visual/global/Config"),
  React = require("react"),
  TreeView = require("../basic/TreeView");

var TABS = [
  {
    id: "domains",
    icon: "brz-ed-icon-settings-domains",
    title: "Domains",
    children: [
      {
        id: "list",
        title: "Domains List"
      },
      {
        id: "subdomain",
        title: "Subdomain"
      },
      {
        id: "external",
        title: "3rd Party Domain"
      }
      // {
      //   id: 'buy',
      //   title: 'Buy Domain'
      // },
    ]
  },
  {
    id: "advanced",
    icon: "brz-ed-icon-globe",
    title: "Advanced",
    children: [
      {
        id: "seo",
        title: "Search Engines"
      },
      {
        id: "social",
        title: "Social Meta"
      },
      {
        id: "styles_editor",
        title: "Styles Editor"
      },
      {
        id: "scripts_editor",
        title: "Code Injection"
      }
    ]
  }
];

class Handlers extends React.Component {
  static defaultProps = {
    active: "",
    onChange: _.noop
  };

  getIcon = className => {
    return <i className={className} />;
  };

  getTabs = () => {
    var tabsToOmit = {
      domains: !Config.get("editorViews")["overlays.domains"]
    };

    return _.reject(TABS, function(tab) {
      return (
        tabsToOmit[tab.id] ||
        (Config.get("editorOptions").isMultipage && tab.id === "seo")
      );
    });
  };

  render() {
    var Tabs = this.getTabs();
    return (
      <div>
        <TreeView
          data={Tabs}
          onChange={this.props.onChange}
          active={this.props.active}
          pre={this.getIcon}
        />
      </div>
    );
  }
}

export default Handlers;
