import { fromJS } from "immutable";
import React from "react";
import { connect } from "react-redux";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Editor from "visual/global/Editor";
import { updateGlobalBlock } from "visual/redux/actions2";
import {
  globalBlocksAssembled2Selector,
  pageSelector
} from "visual/redux/selectors";
import { canUseCondition } from "visual/utils/blocks";

class GlobalBlock extends EditorComponent {
  static get componentId() {
    return "GlobalBlock";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = {};

  optionalSCU(nextProps) {
    const props = this.props;

    // Override The EditorComponent.optionalSCU
    // removed props.dbValue !== nextProps.dbValue
    const _id = this.getId();
    const oldGlobalBlock = nextProps.globalBlocks[_id] ?? {};
    const newGlobalBlock = props.globalBlocks[_id] ?? {};
    const oldValue = fromJS(oldGlobalBlock.data?.value ?? {});
    const value = fromJS(newGlobalBlock.data?.value ?? {});
    const oldRules = fromJS(oldGlobalBlock.rules ?? {});
    const rules = fromJS(newGlobalBlock.rules ?? {});

    if (!value.equals(oldValue) || !rules.equals(oldRules)) {
      return true;
    }

    // check redux
    if (props.reduxState.fonts !== nextProps.reduxState.fonts) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (
      props.reduxState.project.data.font !==
      nextProps.reduxState.project.data.font
    ) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    // console.log("scu", this.constructor.componentId, false);
    return false;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleComponentChange = (value, meta) => {
    if (meta.intent === "replace_all") {
      this.props.onChange(value, meta);
    } else {
      const { globalBlocks } = this.props;
      const _id = this.getId();
      const globalBlock = globalBlocks[_id].data;
      const updatedGlobalBlock = {
        ...globalBlock,
        value
      };

      this.props.reduxDispatch(
        updateGlobalBlock({
          uid: _id,
          data: updatedGlobalBlock,
          meta: {
            ...meta,
            sourceBlockId: this.getId()
          }
        })
      );
    }
  };

  renderForEdit() {
    const _id = this.getId();
    const { globalBlocks, page } = this.props;

    // sometime users are delete global blocks from BD
    // but in pageData exist, in this case we need to check
    // if have some global block with id
    if (!globalBlocks[_id]) {
      return null;
    }

    // if all rules was removed in globalBlock - it still exists
    // into pageJson, but shouldn't be shown
    if (!canUseCondition(globalBlocks[_id], page)) {
      return null;
    }

    const { type, value, ...otherData } = globalBlocks[_id].data;

    if (type === "GlobalBlock") {
      throw new Error(`Global block not found ${_id}`);
    }

    const Component = Editor.getComponent(type);
    const meta = {
      ...this.props.meta,
      globalBlockId: _id
    };

    if (Component) {
      return (
        <Component
          {...this.props}
          {...otherData}
          _id={this.getId()}
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

  renderForView() {
    // In the preview, all global blocks are compiled separately, like simple blocks.
    // Here, we need to return only placeholders.
    const _id = this.getId();
    const { globalBlocks, page } = this.props;

    // sometime users are delete global blocks from BD
    // but in pageData exist, in this case we need to check
    // if have some global block with id
    if (!globalBlocks[_id]) {
      return null;
    }

    // if all rules was removed in globalBlock - it still exists
    // into pageJson, but shouldn't be shown
    if (!canUseCondition(globalBlocks[_id], page)) {
      return null;
    }

    const { type } = globalBlocks[_id].data;

    if (type === "GlobalBlock") {
      throw new Error(`Global block not found ${_id}`);
    }

    // We need to use a placeholder; our backend will
    // replace the placeholder with HTML from the database.
    // Compilation for every GlobalBlocks is inside a worker.

    return `{{ brizy_dc_global_block uid="${_id}" }}`;
  }
}

const mapStateToProps = (state) => ({
  globalBlocks: globalBlocksAssembled2Selector(state),
  page: pageSelector(state)
});

export default connect(mapStateToProps)(GlobalBlock);
