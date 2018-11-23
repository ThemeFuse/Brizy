import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export default class PopulationInput extends React.Component {
  handleClear = () => this.props.onChange("");

  render() {
    return (
      <div className="brz-ed-option__input-container">
        <input
          className="brz-input brz-ed-control__input"
          value={this.props.value}
          disabled={true}
        />
        <EditorIcon icon="nc-circle-remove" onClick={this.handleClear} />
      </div>
    );
  }
}
