import React, { Component, ReactElement } from "react";
import classnames from "classnames";
import { noop } from "underscore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import SwitchControl from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { pendingRequest, createGlobalBlock } from "visual/utils/api";
import { getCurrentRule } from "visual/utils/blocks";
import {
  blocksDataSelector,
  pageBlocksNoRefsSelector,
  globalBlocksAssembled2Selector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import {
  makeNormalToGlobalBlock,
  makeGlobalToNormalBlock,
  makePopupToGlobalBlock,
  makeGlobalBlockToPopup,
  updateBlocks,
  ActionUpdateBlocks
} from "visual/redux/actions2";
import { setIds } from "visual/utils/models";
import { isPopup } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import { createScreenshot, getBlockData } from "./utils";
import { PortalLoading } from "./PortalLoading";
import {
  APIGlobalBlockData,
  GlobalBlockMapDispatch,
  GlobalBlockMapProps,
  GlobalBlockProps
} from "./types";
import { ReduxState } from "visual/redux/types";
import {
  ActionMakeGlobalToNormalBlock,
  ActionMakeNormalToGlobalBlock,
  ActionMakePopupToGlobalBlock,
  ActionMakeGlobalBlockToPopup
} from "visual/redux/actions2";
import { Screenshot, GlobalBlock, Block } from "visual/types";

const getOpenedPopupId = (): string => {
  let id = "";

  new Map([...SectionPopupInstances, ...SectionPopup2Instances]).forEach(
    popup => {
      if (popup.state.isOpened) {
        id = popup.instanceKey;
      }
    }
  );

  return id;
};

const openPopupById = (id: string): void => {
  const popup = new Map([
    ...SectionPopupInstances,
    ...SectionPopup2Instances
  ]).get(id);

  popup && popup.open();
};

class OptionTypeGlobalBlock extends Component<GlobalBlockProps> {
  static defaultProps: GlobalBlockProps = {
    blockType: "normal",
    className: "",
    label: "",
    display: "inline",
    attr: {},
    helper: false,
    helperContent: "",
    extraFontStyles: [],
    pageBlocks: [],
    blocksData: {},
    globalBlocks: {},
    value: {
      _id: ""
    },
    makeNormalToGlobalBlock: noop,
    makeGlobalToNormalBlock: noop,
    makePopupToGlobalBlock: noop,
    makeGlobalBlockToPopup: noop,
    updateBlocks: noop
  };

  mounted = false;
  switchKey = Math.random();

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  isGlobalBlock = (): boolean => {
    const {
      value: { _id },
      globalBlocks
    } = this.props;
    const globalBlocksIds = Object.keys(globalBlocks);

    return globalBlocksIds.includes(_id);
  };

  handleChange = async (checked: boolean): Promise<void> => {
    const {
      blockType,
      extraFontStyles,
      pageBlocks,
      makeNormalToGlobalBlock,
      makeGlobalToNormalBlock,
      makePopupToGlobalBlock,
      makeGlobalBlockToPopup,
      value: { _id }
    } = this.props;

    // if '_id' starts from number - document.getElementById(_id) will throw an error.
    // Because while they are valid in the HTML5 spec,
    // they are not valid in CSS, which is what "query selector" means.
    // document.querySelector(`id=['${_id}']`) - was added for that case
    const node: HTMLElement | null = document.querySelector(`[id='${_id}']`);
    const loading = PortalLoading.render(node);
    const blockData = getBlockData(pageBlocks, _id);

    if (checked) {
      if (node && blockData) {
        const screenshot: Screenshot | undefined = await createScreenshot(node);
        const meta: GlobalBlock["meta"] = {
          extraFontStyles,
          type: blockType
        };

        if (screenshot) {
          meta._thumbnailSrc = screenshot._thumbnailSrc;
          meta._thumbnailWidth = screenshot._thumbnailWidth;
          meta._thumbnailHeight = screenshot._thumbnailHeight;
          meta._thumbnailTime = screenshot._thumbnailTime;
        }

        const currentRule = getCurrentRule();

        const globalBlock: GlobalBlock = {
          meta,
          status: "draft",
          data: blockData,
          rules: !isPopup(blockData)
            ? [
                {
                  type: 1,
                  appliedFor: currentRule.group,
                  entityType: currentRule.type,
                  entityValues: [currentRule.id]
                }
              ]
            : [],
          position: null,
          dataVersion: 1
        };

        await createGlobalBlock(globalBlock)
          .then((r: void | APIGlobalBlockData): void => {
            if (r && r.data) {
              PortalLoading.close(loading);
              const popupId = blockType === "popup" && getOpenedPopupId();

              blockType === "popup"
                ? makePopupToGlobalBlock(globalBlock)
                : makeNormalToGlobalBlock(globalBlock);

              popupId && openPopupById(popupId);
            } else {
              throw r;
            }
          })
          .catch((e: unknown): void => {
            PortalLoading.close(loading);

            this.switchKey = Math.random();
            this.mounted && this.forceUpdate();

            if (blockType === "popup") {
              ToastNotification.error(t("Could not Create Global Popup"));
            } else {
              ToastNotification.error(t("Could not Create Global Block"));
            }
            console.error(e);
          });
      }
    } else {
      await pendingRequest();

      if (this.isGlobalBlock()) {
        const block: Block = setIds(this.props.blocksData[_id]);

        const popupId = blockType === "popup" && getOpenedPopupId();

        PortalLoading.close(loading);

        const data = {
          block,
          fromBlockId: _id
        };
        blockType === "popup"
          ? makeGlobalBlockToPopup(data)
          : makeGlobalToNormalBlock(data);

        popupId && openPopupById(popupId);
      }
    }
  };

  renderLabel(): ReactElement {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label brz-ed-option__switch__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        )}
      </div>
    );
  }

  render(): ReactElement {
    const {
      label,
      display,
      helper,
      attr = {},
      className: _className
    } = this.props;
    const className = classnames(
      "brz-ed-option__global-block",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {(label || helper) && this.renderLabel()}
        <SwitchControl
          key={this.switchKey}
          defaultValue={this.isGlobalBlock()}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): GlobalBlockMapProps => ({
  extraFontStyles: extraFontStylesSelector(state),
  pageBlocks: pageBlocksNoRefsSelector(state),
  globalBlocks: globalBlocksAssembled2Selector(state),
  blocksData: blocksDataSelector(state)
});

const mapDispatchToProps = (
  dispatch: Dispatch<
    | ActionMakeGlobalToNormalBlock
    | ActionMakeNormalToGlobalBlock
    | ActionMakePopupToGlobalBlock
    | ActionMakeGlobalBlockToPopup
    | ActionUpdateBlocks
  >
): GlobalBlockMapDispatch => ({
  makeNormalToGlobalBlock: (globalBlock): ActionMakeNormalToGlobalBlock =>
    dispatch(makeNormalToGlobalBlock(globalBlock)),

  makeGlobalToNormalBlock: (data): ActionMakeGlobalToNormalBlock =>
    dispatch(makeGlobalToNormalBlock(data)),

  makePopupToGlobalBlock: (globalBlock): ActionMakePopupToGlobalBlock =>
    dispatch(makePopupToGlobalBlock(globalBlock)),

  makeGlobalBlockToPopup: (data): ActionMakeGlobalBlockToPopup =>
    dispatch(makeGlobalBlockToPopup(data)),

  updateBlocks: (page): ActionUpdateBlocks => dispatch(updateBlocks(page))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionTypeGlobalBlock);
