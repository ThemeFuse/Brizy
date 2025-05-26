import { Remote, wrap } from "comlink";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Page } from "visual/types/Page";
import type { Project } from "visual/types/Project";
import { uuid } from "visual/utils/uuid";
import { _Worker } from "visual/utils/worker";
import type { Compiler, Core } from "..";
import type { Static } from "../bootstrap/types";

type ChunkTask = {
  config: ConfigCommon;
  page: Page;
  project: Project;
  onDone: (r: Static) => void;
  onError: (e: Error) => void;
};

interface Config {
  workerUrl: string;
  workers?: number;
}

const initWorker = (url: string): Worker => {
  const Worker = _Worker.getInstance();
  return new Worker(url);
};

class WorkerPool {
  static instance: WorkerPool;

  static async getInstance(config: Config): Promise<WorkerPool> {
    return new Promise((res, rej) => {
      if (WorkerPool.instance) {
        res(WorkerPool.instance);
      } else {
        const created = () => {
          res(WorkerPool.instance);
        };

        WorkerPool.instance = new WorkerPool(config, created, rej);
      }
    });
  }

  config: Config;
  pendingTasks: Map<string, ChunkTask> = new Map();
  processingTasks: Set<string> = new Set();
  compilers: Map<number, { busy: boolean; compiler: Remote<Core> }> = new Map();

  constructor(
    config: Config,
    onDone: () => void,
    onError: (e: unknown) => void
  ) {
    const {
      workerUrl,
      workers = Math.max(2, navigator.hardwareConcurrency) || 2
    } = config;

    this.config = { workerUrl, workers };

    for (let i = 0; i < workers; i++) {
      (async () => {
        try {
          const Compiler = wrap<Compiler>(initWorker(workerUrl));
          const compiler = await new Compiler();
          this.compilers.set(i, { busy: false, compiler });

          if (workers === this.compilers.size) {
            onDone();
          }
        } catch (e) {
          onError(e);
        }
      })();
    }
  }

  public process(
    chunk: Omit<ChunkTask, "onDone" | "onError">
  ): Promise<Static> {
    return new Promise((onDone, onError) => {
      const uid = uuid();
      this.pendingTasks.set(uid, { ...chunk, onDone, onError });
      this.processNextBatch();
    });
  }

  private processNextBatch() {
    const pendingTasks: Array<string> = [];

    for (const [taskId] of this.pendingTasks) {
      if (!this.processingTasks.has(taskId)) {
        pendingTasks.push(taskId);
      }
    }

    if (pendingTasks.length > 0) {
      for (const taskId of pendingTasks) {
        this.processTask(taskId);
      }
    }
  }

  private processTask(taskId: string) {
    const task = this.pendingTasks.get(taskId);

    // When the task is invalid, exit early
    if (!task) {
      return;
    }

    const compilers = this.compilers;

    for (const [compilerId, worker] of compilers) {
      const inProgess = this.processingTasks.has(taskId);

      if (inProgess) {
        break;
      }

      if (!worker.busy) {
        this.compilers.set(compilerId, { ...worker, busy: true });
        this.processingTasks.add(taskId);

        worker.compiler
          .compile(JSON.stringify(task))
          .then((data) => {
            task.onDone(data);
          })
          .catch((error: Error) => {
            if (process.env["NODE_NEV"] === "development") {
              console.error(`Error processing task:`, error);
            }
            task.onError(error);
          })
          .finally(() => {
            this.processingTasks.delete(taskId);
            this.pendingTasks.delete(taskId);
            this.compilers.set(compilerId, { ...worker, busy: false });

            if (this.pendingTasks.size > 0) {
              this.processNextBatch();
            }
          });
      }
    }
  }
}

export { WorkerPool };
