import React, { JSX, memo, useEffect, useRef } from "react";
import { useStore } from "react-redux";
import { useConfig } from "visual/providers/ConfigProvider";
import { Queue } from "visual/utils/queue/Queue";
import { QueueWorker } from "visual/utils/queue/QueueWorker";
import { Props } from "./types";
import { addQueueDebounced } from "./utils";

// process 5 blocks in parallel
const CONCURRENCY_LIMIT = 5;

const _FlushDom = (props: Props): JSX.Element => {
  const { blocks } = props;
  const store = useStore();
  const config = useConfig();
  const queue = useRef(new Queue());
  const queueWorker = useRef(new QueueWorker(queue.current, CONCURRENCY_LIMIT));
  // const { mode } = useEditorMode();

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

    blocks.forEach((block) => {
      const blockId = block.value._id ?? "";
      addQueueDebounced.set(blockId, queueTask, [block], store, config);
    });

    // if (blocks.length === 1) {
    //   const block = blocks[0];
    //   const blockId = block.value._id ?? "";
    //   addQueueDebounced.set(blockId, queueTask, blocks, store, config);
    //   return;
    // }

    // // When multiple blocks are selected, generate a unique ID for the batch
    // const id = blocks.map((b) => b.value._id).join("");
    // addQueueDebounced.set(id, queueTask, blocks, store, config);
  }, [blocks, store, config]);

  return <></>;
};

export const FlushDom = memo(_FlushDom);
export type { Props };
