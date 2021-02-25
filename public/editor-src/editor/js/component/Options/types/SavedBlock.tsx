import React, { Component, HTMLAttributes } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import EditorIcon from "visual/component/EditorIcon";
import {
  pageDataNoRefsSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { ToastNotification } from "visual/component/Notifications";
import { createBlockScreenshot, createSavedBlock } from "visual/utils/api";
import { findDeep } from "visual/utils/object";
import { uuid } from "visual/utils/uuid";
import { t } from "visual/utils/i18n";
import { Block, SavedBlock } from "visual/types";
import { ReduxState } from "visual/redux/types";
import { getWhiteLabel } from "visual/utils/whiteLabel";

type SavedBlockMapStateToProps = {
  isAuthorized: boolean;
  pageBlocks: {
    items: Array<Block>;
  };
  extraFontStyles: ReduxState["extraFontStyles"];
};

type SavedBlockProps = SavedBlockMapStateToProps & {
  className: string;
  attr: HTMLAttributes<object>;
  icon: string;
  title: string;
  tooltipContent: string;
  blockType: "normal" | "popup";
  value: { blockId: string };
  isAuthorized: boolean;
};

type SavedBlockState = {
  loading: boolean;
  active: boolean;
};

const hasBlock = ({ value }: Block, id: string): boolean => {
  return !!value && value._id === id;
};

class OptionTypeSavedBlock extends Component<SavedBlockProps, SavedBlockState> {
  static defaultProps: SavedBlockProps = {
    className: "",
    attr: {},
    icon: "nc-circle-add",
    title: "Add",
    tooltipContent: "",
    blockType: "normal",
    value: {
      blockId: ""
    },
    pageBlocks: {
      items: []
    },
    extraFontStyles: [],
    isAuthorized: false
  };

  state: SavedBlockState = {
    loading: false,
    active: false
  };

  mounted = false;

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  getBlock(): Block | undefined | null {
    const {
      blockType,
      pageBlocks: { items: pageItems },
      value: { blockId }
    } = this.props;
    let block;

    if (blockType === "normal") {
      block = pageItems.find((block: Block) => hasBlock(block, blockId));
    } else {
      block = findDeep(pageItems, (obj: Block) => hasBlock(obj, blockId)).obj;
    }

    return block;
  }

  handleCreateSaveBlock = async (): Promise<void> => {
    const {
      blockType,
      extraFontStyles,
      value: { blockId }
    } = this.props;
    const meta: SavedBlock["meta"] = {
      extraFontStyles,
      type: blockType
    };
    const data = this.getBlock();

    if (!data) {
      const error =
        blockType === "normal"
          ? t("Could not Create Saved Block")
          : t("Could not Create Saved Popup");
      ToastNotification.error(error);

      if (this.mounted && this.state.loading) {
        this.setState({ loading: false });
      }

      return;
    }

    const screenshotsSupported: boolean = await browserSupports();

    if (screenshotsSupported) {
      // getElementById instead of querySelector was used deliberately
      // because querySelector(`#{id}`) throws when using ids that start with a number
      const node: HTMLElement | null = document.getElementById(blockId);

      if (node) {
        const { src, width, height } = await makeNodeScreenshot(node);
        const { id } = await createBlockScreenshot({
          base64: src,
          blockType: "saved"
        });

        meta._thumbnailSrc = id;
        meta._thumbnailWidth = width;
        meta._thumbnailHeight = height;
        meta._thumbnailTime = Date.now();
      }
    }

    await createSavedBlock({
      data,
      meta,
      uid: uuid(),
      dataVersion: 1
    }).catch(err => {
      if (blockType === "normal") {
        ToastNotification.error(t("Could not Create Saved Block"));
      } else {
        ToastNotification.error(t("Could not Create Saved Popup"));
      }

      console.error(err);
    });

    if (this.mounted) {
      this.setState({ loading: false });
    }
  };

  handleClick = async (): Promise<void> => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    const hasWhiteLabel = getWhiteLabel();

    if (hasWhiteLabel || this.props.isAuthorized) {
      await this.handleCreateSaveBlock();
    } else {
      const data: PromptsProps = {
        mode: "stack",
        prompt: "authorization",
        props: {
          onClose: this.handleCreateSaveBlock,
          onSkip: this.handleCreateSaveBlock,
          onSuccess: this.handleCreateSaveBlock
        }
      };
      Prompts.open(data);
    }
  };

  renderTooltip(): React.ReactElement | boolean {
    const { tooltipContent } = this.props;
    const { loading, active } = this.state;
    const className = classnames("brz-ed-toolbar__item__tooltip", {
      "brz-ed-animated brz-ed-animated--fadeIn active": active
    });

    return !loading && <div className={className}>{tooltipContent}</div>;
  }

  render(): React.ReactElement {
    const {
      attr,
      icon,
      title,
      tooltipContent,
      className: _className
    } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-ed-option__button",
      _className,
      attr.className
    );

    return (
      <div
        {...attr}
        className={className}
        title={title}
        onClick={this.handleClick}
      >
        {tooltipContent && this.renderTooltip()}
        {loading ? (
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        ) : (
          <EditorIcon
            icon={icon}
            className="brz-ed-animated brz-ed-animated--fadeIn"
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): SavedBlockMapStateToProps => ({
  isAuthorized:
    state.authorized === "connected" || state.authorized === "pending",
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  pageBlocks: pageDataNoRefsSelector(state),
  extraFontStyles: extraFontStylesSelector(state)
});

export default connect(mapStateToProps)(OptionTypeSavedBlock);
