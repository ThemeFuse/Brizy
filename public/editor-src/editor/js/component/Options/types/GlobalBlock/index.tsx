import classnames from "classnames";
import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { noop } from "underscore";
import { getOptions } from "visual/component/ConditionsComponent";
import SwitchControl from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Prompts from "visual/component/Prompts";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import {
  ActionMakeGlobalBlockToPopup,
  ActionMakeGlobalToNormalBlock,
  ActionMakeNormalToGlobalBlock,
  ActionMakePopupToGlobalBlock,
  makeGlobalBlockToPopup,
  makeGlobalToNormalBlock,
  makeNormalToGlobalBlock,
  makePopupToGlobalBlock
} from "visual/redux/actions2";
import {
  blocksDataSelector,
  extraFontStylesSelector,
  globalBlocksAssembled2Selector,
  pageBlocksNoRefsSelector,
  pageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlock, Screenshot } from "visual/types";
import { createGlobalBlock, pendingRequest } from "visual/utils/api";
import { changeRule, isPopup } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { getBlockData, setIds } from "visual/utils/models";
import { uuid } from "visual/utils/uuid";
import { PortalLoading } from "./PortalLoading";
import {
  GlobalBlockMapDispatch,
  GlobalBlockMapProps,
  GlobalBlockProps
} from "./types";
import { createScreenshot, getBlocType } from "./utils";

const getOpenedPopupId = (): string => {
  let id = "";

  new Map([...SectionPopupInstances, ...SectionPopup2Instances]).forEach(
    (popup) => {
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
    page: undefined,
    value: {
      _id: "",
      parentId: undefined
    },
    makeNormalToGlobalBlock: noop,
    makeGlobalToNormalBlock: noop,
    makePopupToGlobalBlock: noop,
    makeGlobalBlockToPopup: noop
  };

  mounted = false;
  switchKey = uuid(4);

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

  openPromptCondition(type: "block" | "popup"): void {
    Prompts.open({
      prompt: "conditions",
      mode: "single",
      props: {
        options: getOptions(type, this.props.value._id)
      }
    });
  }

  handleChange = async (checked: boolean): Promise<void> => {
    const {
      blockType,
      extraFontStyles,
      pageBlocks,
      page,
      makeNormalToGlobalBlock,
      makeGlobalToNormalBlock,
      makePopupToGlobalBlock,
      makeGlobalBlockToPopup,
      value: { _id, parentId }
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
          type: getBlocType(blockType)
        };

        if (screenshot) {
          meta._thumbnailSrc = screenshot._thumbnailSrc;
          meta._thumbnailWidth = screenshot._thumbnailWidth;
          meta._thumbnailHeight = screenshot._thumbnailHeight;
          meta._thumbnailTime = screenshot._thumbnailTime;
        }

        if (Object.prototype.hasOwnProperty.call(blockData, "deleted")) {
          blockData.deleted = false;
        }

        let globalBlock: GlobalBlock = {
          meta,
          status: "draft",
          data: blockData,
          rules: [],
          position: { align: "bottom", top: 0, bottom: 0 }
        };

        if (!isPopup(blockData) && page) {
          globalBlock = changeRule(globalBlock, true, page);
        }

        await createGlobalBlock(globalBlock)
          .then((r): void => {
            if (r && r.data) {
              PortalLoading.close(loading);

              switch (blockType) {
                case "popup":
                case "externalPopup": {
                  const popupId = blockType === "popup" && getOpenedPopupId();

                  makePopupToGlobalBlock(globalBlock);
                  popupId && openPopupById(popupId);

                  if (blockType === "externalPopup") {
                    this.openPromptCondition("popup");
                  }
                  break;
                }
                case "normal": {
                  makeNormalToGlobalBlock(globalBlock);
                  this.openPromptCondition("block");
                  break;
                }
              }
            } else {
              throw r;
            }
          })
          .catch((e: unknown): void => {
            PortalLoading.close(loading);

            this.switchKey = uuid(4);
            this.mounted && this.forceUpdate();

            switch (blockType) {
              case "popup":
              case "externalPopup": {
                ToastNotification.error(t("Could not Create Global Popup"));
                break;
              }
              case "normal": {
                ToastNotification.error(t("Could not Create Global Block"));
                break;
              }
            }

            console.error(e);
          });
      }
    } else {
      await pendingRequest();

      if (this.isGlobalBlock()) {
        const block: Block = setIds(this.props.blocksData[_id]);

        PortalLoading.close(loading);

        const data = {
          block,
          fromBlockId: _id
        };

        switch (blockType) {
          case "popup": {
            const popupId = getOpenedPopupId();

            parentId && makeGlobalBlockToPopup({ ...data, parentId });
            popupId && openPopupById(popupId);
            break;
          }
          case "normal":
          case "externalPopup": {
            makeGlobalToNormalBlock(data);
            break;
          }
        }
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
  blocksData: blocksDataSelector(state),
  page: pageSelector(state)
});

const mapDispatchToProps = (
  dispatch: Dispatch<
    | ActionMakeGlobalToNormalBlock
    | ActionMakeNormalToGlobalBlock
    | ActionMakePopupToGlobalBlock
    | ActionMakeGlobalBlockToPopup
  >
): GlobalBlockMapDispatch => ({
  makeNormalToGlobalBlock: (globalBlock): ActionMakeNormalToGlobalBlock =>
    dispatch(makeNormalToGlobalBlock(globalBlock)),

  makeGlobalToNormalBlock: (data): ActionMakeGlobalToNormalBlock =>
    dispatch(makeGlobalToNormalBlock(data)),

  makePopupToGlobalBlock: (globalBlock): ActionMakePopupToGlobalBlock =>
    dispatch(makePopupToGlobalBlock(globalBlock)),

  makeGlobalBlockToPopup: (data): ActionMakeGlobalBlockToPopup =>
    dispatch(makeGlobalBlockToPopup(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionTypeGlobalBlock);
