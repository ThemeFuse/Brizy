import React, { Component } from "react";
import * as TwitterApi from "react-twitter-embed";

class Twitter extends Component {
  static defaultProps = {
    type: "",
    data: {}
  };

  renderForEdit() {
    const { type, data } = this.props;
    const twitterKey = {
      embed: "TwitterTimelineEmbed",
      followButton: "TwitterFollowButton",
      mentionButton: "TwitterMentionButton"
    };
    const Component = TwitterApi[twitterKey[type]];

    return <Component key={JSON.stringify(data)} {...data} />;
  }

  renderForView() {
    const { data } = this.props;

    return <a {...data} />;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default Twitter;
