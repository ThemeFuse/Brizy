import React, { type JSX, memo, useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useConfig } from "visual/providers/ConfigProvider";
import { useStyleProvider } from "visual/providers/StyleProvider";
import { initializeBlocksHtml, updateSymbolsCSS } from "visual/redux/actions2";
import { symbolsSelector } from "visual/redux/selectors";
import type { SymbolCSS } from "visual/types/Symbols";
import { Queue } from "visual/utils/queue/Queue";
import { QueueWorker } from "visual/utils/queue/QueueWorker";
import type { Props } from "./types";
import { addQueue, addQueueDebounced } from "./utils";

// process 5 blocks in parallel
const CONCURRENCY_LIMIT = 5;

const _FlushDom = (props: Props): JSX.Element => {
  const { blocks } = props;
  const store = useStore();
  const config = useConfig();
  const queue = useRef(new Queue());
  const queueWorker = useRef(new QueueWorker(queue.current, CONCURRENCY_LIMIT));

  const dispatch = useDispatch();
  const symbols = useSelector(symbolsSelector);
  const { sheet } = useStyleProvider();
  const cssOrdered = sheet.getCSSOrdered();
  // const { mode } = useEditorMode();

  useEffect(() => {
    const symbolsCSS = cssOrdered.symbol.reduce((acc, curr) => {
      const symbol = symbols.classes.find(
        (s) => s.className === curr.className
      );
      if (symbol) {
        acc[symbol.uid] = {
          css: curr.cssText
        };
      }

      return acc;
    }, {} as SymbolCSS);

    dispatch(updateSymbolsCSS(symbolsCSS));
  }, [cssOrdered.symbol, symbols, dispatch]);

  useEffect(() => {
    if (blocks.length === 0) {
      dispatch(initializeBlocksHtml());
      return;
    }

    addQueue(queue.current, blocks, store, config);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We need only to run this effect once
  }, []);

  useEffect(() => {
    const worker = queueWorker.current;
    worker.start(store);

    return () => {
      worker.stop();
    };
  }, [store]);

  useEffect(() => {
    if (blocks.length === 0) {
      return;
    }

    const queueTask = queue.current;

    // When multiple blocks are selected, generate a unique ID for the batch
    const id = blocks.map((b) => b.value._id).join("");
    addQueueDebounced.set(id, queueTask, blocks, store, config);
  }, [blocks, store, config]);

  return <></>;
};

export const FlushDom = memo(_FlushDom);
export type { Props };
