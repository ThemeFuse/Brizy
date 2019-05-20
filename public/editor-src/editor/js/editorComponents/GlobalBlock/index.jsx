import React from "react";
import { connect } from "react-redux";
import Editor from "visual/global/Editor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { globalBlocksSelector } from "visual/redux/selectors";
import { updateGlobalBlock } from "visual/redux/actions";

class GlobalBlock extends EditorComponent {
  static get componentId() {
    return "GlobalBlock";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = {};

  shouldComponentUpdate(nextProps) {
    const { globalBlockId } = this.getDBValue();
    const globalBlockChanged =
      nextProps.globalBlocks[globalBlockId] !==
      this.props.globalBlocks[globalBlockId];

    return globalBlockChanged || this.optionalSCU(nextProps);
  }

  handleComponentChange = (value, meta) => {
    if (meta.intent === "replace_all") {
      this.props.onChange(value, meta);
    } else {
      const { globalBlockId } = this.getDBValue();
      const globalBlock = globalBlocksSelector(this.props.reduxState)[
        globalBlockId
      ];
      const updatedGlobalBlock = {
        ...globalBlock,
        value
      };

      this.props.reduxDispatch(
        updateGlobalBlock({
          id: globalBlockId,
          data: updatedGlobalBlock,
          meta: {
            ...meta,
            sourceBlockId: this.getId()
          }
        })
      );
    }
  };

  renderForEdit(v) {
    const { globalBlockId } = v;
    const { globalBlocks } = this.props;
    const { type, value, ...otherData } = globalBlocks[globalBlockId];
    const Component = Editor.getComponent(type);
    const meta = {
      ...this.props.meta,
      globalBlockId
    };

    if (Component) {
      return (
        <Component
          {...this.props}
          {...otherData}
          _id={this.getId()}
          path={this.getPath()}
          meta={meta}
          dbValue={value}
          toolbarExtend={this.props.toolbarExtend}
          reduxState={this.getReduxState()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={this.handleComponentChange}
        />
      );
    } else {
      const NotFoundComponent = Editor.getNotFoundComponent();

      return (
        <NotFoundComponent
          path={this.getPath()}
          meta={meta}
          dbValue={value}
          toolbarExtend={this.props.toolbarExtend}
          reduxState={this.getReduxState()}
          reduxDispatch={this.getReduxDispatch()}
          onChange={this.handleComponentChange}
          componentId={type}
        />
      );
    }
  }
}

const mapStateToProps = state => ({
  globalBlocks: globalBlocksSelector(state)
});

export default connect(mapStateToProps)(GlobalBlock);
