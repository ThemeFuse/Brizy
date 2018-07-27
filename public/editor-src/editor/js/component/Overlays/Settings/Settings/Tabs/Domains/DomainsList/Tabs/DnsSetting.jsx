var React = require('react'),
  DNS = require('./../../basic/getDNS');

class DnsSetting extends React.Component {
  render() {
      return (
        <DNS activeDomain={this.props.activeDomain}
             handleTabChange={this.props.activePage}
        />
      );
  }
}

export default DnsSetting;
