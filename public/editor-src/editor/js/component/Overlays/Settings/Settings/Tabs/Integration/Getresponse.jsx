var React = require('react'),
  Config = require('visual/global/Config'),
  EmailApp = require('./basic/EmailApp');

class GetResponse extends React.Component {
  getUrl = () => {
    return Config.get('urls').integration + '/getresponse/auth/login/project/';
  };

  render() {
    return (
      <EmailApp
        app={this.props.app}
        title="Get Response"
        description="Subscribers will automatically be synced to your Get Response list."
        url={this.getUrl()}
        onChange={this.props.onChange}
      />
    );
  }
}

export default GetResponse;
