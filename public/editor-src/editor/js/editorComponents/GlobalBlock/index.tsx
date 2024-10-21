import React from "react";
import { fromJS } from "immutable";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";
import Editor from "visual/global/Editor";
import { updateGlobalBlock } from "visual/redux/actions2";
import { canUseCondition } from "visual/utils/blocks";
import { Value, Props } from "./types";
import { connector } from "./connector";

class GlobalBlock extends EditorComponent<Value, Props> {
  static get componentId(): "GlobalBlock" {
    return "GlobalBlock";
  }

  static defaultValue = {};

  optionalSCU(nextProps: Props) {
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
    if (props.fonts !== nextProps.fonts) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    if (props.defaultFont !== nextProps.defaultFont) {
      // console.log("scu", this.constructor.componentId, "project", true);
      return true;
    }

    // console.log("scu", this.constructor.componentId, false);
    return false;
  }

  shouldComponentUpdate(nextProps: Props) {
    return this.optionalSCU(nextProps);
  }

  handleComponentChange = (value: Value | null, meta: OnChangeMeta<Value>) => {
    if (meta?.intent === "replace_all") {
      this.props.onChange(value, meta);
    } else {
      const { globalBlocks } = this.props;
      const _id = this.getId();
      const globalBlock = globalBlocks[_id].data;
      const updatedGlobalBlock = {
        ...globalBlock,
        value
      };

      this.props.dispatch(
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
        // @ts-expect-error: Types of property component are incompatible.
        <Component
          {...this.props}
          {...otherData}
          _id={_id}
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
        // @ts-expect-error: Types of property component are incompatible.
        <NotFoundComponent
          {...this.props}
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

export default connector(GlobalBlock);
