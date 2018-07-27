import React from "react";
import _ from "underscore";
import UIState from "visual/global/UIState";
import Icon from "./PromptIcon";
// import Share from "./PromptShare";
// import Popup from "./PromptPopup";
import Blocks from "./PromptBlocks";
import Form from "./PromptForm";
import { CSSTransition } from "react-transition-group";

class Prompts extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    UIState.addChangeListener("prompt", this.onUIStateChange);
  }

  componentWillUnmount() {
    UIState.removeChangeListener("prompt", this.onUIStateChange);
  }

  onUIStateChange = data => {
    if (data) {
      this.open(data);
    } else {
      this.close();
    }
  };

  close = () => {
    this.setState({
      data: null
    });
  };

  open = data => {
    this.setState({ data });
  };

  render() {
    let content = null;
    const { data } = this.state;
    const showPrompt = Boolean(data && data.prompt);

    if (showPrompt) {
      const props = _.omit(data, "prompt");

      switch (data.prompt) {
        case "icon":
          content = <Icon {...props} onClose={this.close} />;
          break;
        case "form-integrations":
          content = <Form {...props} onClose={this.close} />;
          break;
        case "share":
          content = <Share {...props} onClose={this.close} />;
          break;
        case "popup":
          content = <Popup {...props} onClose={this.close} />;
          break;
        case "blocks":
          content = <Blocks {...props} onClose={this.close} />;
          break;
      }
    }

    return (
      <CSSTransition in={showPrompt} classNames="brz-ed-fade" timeout={150}>
        <div>{content}</div>
      </CSSTransition>
    );
  }
}

export default Prompts;
