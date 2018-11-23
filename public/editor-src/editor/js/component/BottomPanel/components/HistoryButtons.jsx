import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { HistoryButtons } from "visual/redux/reducers/historyEnhancer";

class HistoryItems extends React.Component {
  renderHistoryItems({ canUndo, canRedo, triggerUndo, triggerRedo }) {
    const undoClassName = classnames("brz-li brz-ed-fixed-bottom-panel__item", {
      active: canUndo
    });
    const redoClassName = classnames("brz-li brz-ed-fixed-bottom-panel__item", {
      active: canRedo
    });

    return (
      <React.Fragment>
        <li
          className={undoClassName}
          title="Undo (CTRL+Z)"
          onClick={triggerUndo}
        >
          <EditorIcon icon="nc-undo" />
        </li>
        <li
          className={redoClassName}
          title="Redo (CTRL+Y)"
          onClick={triggerRedo}
        >
          <EditorIcon icon="nc-redo" />
        </li>
      </React.Fragment>
    );
  }

  render() {
    return (
      <HistoryButtons
        dispatch={this.props.dispatch}
        render={this.renderHistoryItems}
      />
    );
  }
}

const mapStateToProps = state => ({
  state: state
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryItems);
