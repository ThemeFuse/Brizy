import React from "react";
import { setIn } from "timm";
import Editor from "visual/global/Editor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";

class GlobalBlock extends EditorComponent {
  static get componentId() {
    return "GlobalBlock";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = {};

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleComponentChange = (value, meta) => {
    if (meta.intent === "replace_all") {
      this.props.onChange(value, meta);
    } else {
      const store = getStore();
      const { globalBlocks = {} } = store.getState().globals.project;
      const { globalBlockId } = this.getDBValue();
      const updatedGlobalBlocks = setIn(
        globalBlocks,
        [globalBlockId, "value"],
        value
      );

      store.dispatch(updateGlobals("globalBlocks", updatedGlobalBlocks));
    }
  };

  renderForEdit(v) {
    const { globalBlockId } = v;
    const { globalBlocks } = getStore().getState().globals.project;
    const { type, value, ...otherData } = globalBlocks[globalBlockId];
    const Component = Editor.getComponent(type);
    const meta = {
      ...this.props.meta,
      globalBlockId
    };

    if (Component) {
      return (
        <Component
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

export default GlobalBlock;
