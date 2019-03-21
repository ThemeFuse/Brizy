import React, { Component } from "react";
import Editor from "visual/global/Editor";
import List from "./List";
import Details from "./Details";

export default class Layouts extends Component {
  static shouldRender(props) {
    const templatesConfig = props.templatesConfig || Editor.getTemplates();

    return templatesConfig.templates;
  }

  state = {
    mode: "list",
    data: {}
  };

  handleChangeMode(mode, data) {
    this.setState({
      mode,
      data
    });
  }

  render() {
    const { mode, data } = this.state;

    return mode === "list" ? (
      <List
        {...this.props}
        data={data}
        onNext={data => {
          this.handleChangeMode("details", data);
        }}
      />
    ) : (
      <Details
        {...this.props}
        data={data}
        onBack={data => {
          this.handleChangeMode("list", data);
        }}
      />
    );
  }
}
