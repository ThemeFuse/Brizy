import React from "react";
import { connect } from "react-redux";
import Editor from "visual/global/Editor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { canUseConditionInPage } from "visual/utils/blocks";
import {
  pageSelector,
  blocksDataSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { updateGlobalBlock } from "visual/redux/actions2";

class GlobalBlock extends EditorComponent {
  static get componentId() {
    return "GlobalBlock";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = {};

  shouldComponentUpdate(nextProps) {
    const _id = this.getId();
    // const { globalBlockId } = this.getDBValue();
    // we check the reference equality on value and not on the
    // whole object because of the way globalBlocksAssembled2Selector works
    // in that the objects may be different even if the value did not change
    const globalBlockChanged =
      nextProps.blocksData[_id].value !== this.props.blocksData[_id].value;

    return globalBlockChanged || this.optionalSCU(nextProps);
  }

  handleComponentChange = (value, meta) => {
    if (meta.intent === "replace_all") {
      this.props.onChange(value, meta);
    } else {
      const { blocksData } = this.props;
      // const { globalBlockId } = this.getDBValue();
      const _id = this.getId();
      const globalBlock = blocksData[_id];
      const updatedGlobalBlock = {
        ...globalBlock,
        value
      };

      this.props.reduxDispatch(
        updateGlobalBlock({
          id: _id,
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
    const { blocksData, globalBlocks, page } = this.props;

    // if all rules was removed in globalBlock - it still exists
    // into pageJson, but shouldn't be shown
    if (!canUseConditionInPage(globalBlocks[_id], page)) {
      return null;
    }

    // const { globalBlockId } = v;
    const { type, value, ...otherData } = blocksData[_id];

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
  blocksData: blocksDataSelector(state),
  globalBlocks: globalBlocksSelector(state),
  page: pageSelector(state)
});

export default connect(mapStateToProps)(GlobalBlock);
