import React from "react";
import Disqus from "disqus-react";
import Facebook from "../Facebook";
import WPComments from "./WPComments";

class Comments extends React.Component {
  static defaultProps = {
    type: "",
    appId: "",
    data: {}
  };

  renderForEdit() {
    const { appId, type, data } = this.props;

    return type === "facebook" ? (
      <Facebook appId={appId} type="Comments" data={data} />
    ) : type === "disqus" && data.shortname === "" ? (
      <p className="brz-disqus-no-data">Add the required data</p>
    ) : type === "disqus" ? (
      <Disqus.DiscussionEmbed {...data} />
    ) : (
      <WPComments {...data} />
    );
  }

  renderForView() {
    const { appId, type, data } = this.props;

    return type === "facebook" ? (
      <Facebook appId={appId} type="Comments" data={data} />
    ) : type === "disqus" ? (
      <div id="disqus_thread" {...data}></div>
    ) : (
      <WPComments {...data} />
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default Comments;
