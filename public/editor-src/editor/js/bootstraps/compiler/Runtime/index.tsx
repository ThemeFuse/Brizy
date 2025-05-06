import { differenceWith, isEqual } from "es-toolkit";
import React, { Component, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import {
  blocksHtmlSelector,
  globalPopupsInPageSelector,
  pageBlocksDataSelector,
  pageDataDraftBlocksSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { FlushDom } from "./FlushDom";
import { ContextType, OwnProps, StateProps } from "./types";

const mapState = (state: ReduxState): StateProps => ({
  page: pageDataDraftBlocksSelector(state),
  getBlockData: (c) => pageBlocksDataSelector(state, c),
  getGlobalPopups: (c) => globalPopupsInPageSelector(state, c),
  blocksHTML: blocksHtmlSelector(state).blocks
});

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector> & OwnProps;

class _RuntimeCompiler extends Component<
  Props,
  Record<string, unknown>,
  ContextType
> {
  changedBlocks: Array<Block> = [];
  static contextType = ConfigContext;
  declare context: ContextType;

  constructor(props: Props, context: ContextType) {
    super(props);
    const config = context?.getConfig();

    if (!config) {
      return;
    }

    const { getBlockData, getGlobalPopups, blocksHTML } = props;
    const blockData = getBlockData(config);
    const popups = getGlobalPopups(config).map((f) => f.data);

    blockData.forEach((block) => {
      const id = block.value._id;

      if (!blocksHTML[id]) {
        this.changedBlocks.push(block);
      }
    });

    popups.forEach((popup) => {
      const id = popup.value._id;

      if (!blocksHTML[id]) {
        this.changedBlocks.push(popup);
      }
    });
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const config = this.context?.getConfig();

    if (!config) {
      return false;
    }

    const { getBlockData, getGlobalPopups } = this.props;

    const blocks = differenceWith(
      nextProps.getBlockData(config),
      getBlockData(config),
      isEqual
    );
    const popups = differenceWith(
      nextProps.getGlobalPopups(config).map((f) => f.data),
      getGlobalPopups(config).map((f) => f.data),
      isEqual
    );

    this.changedBlocks = [...blocks, ...popups];

    if (this.changedBlocks.length > 0) {
      return true;
    }

    return false;
  }

  getBlocks(): Array<Block> {
    return this.changedBlocks;
  }

  render(): ReactElement {
    return <FlushDom blocks={this.getBlocks()} />;
  }
}

const RuntimeCompiler = connector(_RuntimeCompiler);

export { RuntimeCompiler };
