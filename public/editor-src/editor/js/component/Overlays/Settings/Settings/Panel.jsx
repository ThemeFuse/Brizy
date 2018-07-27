var React = require("react");

var PANELS = {
  buy: require("./Tabs/Domains/BuyDomain"),
  external: require("./Tabs/Domains/ThreeRdPartyDomain"),
  list: require("./Tabs/Domains/DomainsList"),
  subdomain: require("./Tabs/Domains/SubDomain"),
  styles_editor: require("./Tabs/Advanced/StylesEditor"),
  scripts_editor: require("./Tabs/Advanced/ScriptsEditor"),
  seo: require("./Tabs/Advanced/Seo"),
  social: require("./Tabs/Advanced/Social")
};

class TabPanel extends React.Component {
  render() {
    var tab = PANELS[this.props.active];
    var props = {
      onChange: this.props.onChange
    };

    return (
      <div className="brz-ed-popup-metrics-tab-panel">
        {React.createElement(tab, props)}
      </div>
    );
  }
}

export default TabPanel;
