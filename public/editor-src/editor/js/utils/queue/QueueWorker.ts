import { updateBlockHtmlStats } from "visual/redux/actions2";
import { Store } from "visual/redux/store";
import { Queue } from "./Queue";

export class QueueWorker<T> {
  private queue: Queue<T>;
  private isRunning = false;
  private store: Store | undefined;
  private concurrencyLimit: number;
  private processingPromises: Map<string, Promise<T | Error>> = new Map();
  private checkInterval: number;
  private intervalId?: NodeJS.Timeout;

  constructor(queue: Queue<T>, concurrencyLimit = 3, checkInterval = 500) {
    this.queue = queue;
    this.concurrencyLimit = concurrencyLimit;
    this.checkInterval = checkInterval;
  }

  public start(store: Store): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.store = store;

    // Process tasks immediately
    this.processNextBatch();

    // Set up interval to check for new tasks regularly
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.processNextBatch();
      }
    }, this.checkInterval);
  }

  public stop(waitForCurrent = false): Promise<void> | void {
    this.isRunning = false;

    // Clear the check interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (waitForCurrent && this.processingPromises.size > 0) {
      return Promise.all(this.processingPromises.values()).then(() => {
        // eslint-disable-next-line no-console
        console.log("All tasks completed");
      });
    }
  }

  private processNextBatch(): void {
    if (!this.isRunning) {
      return;
    }

    const availableSlots = this.concurrencyLimit - this.processingPromises.size;

    if (availableSlots <= 0) {
      return;
    }

    const pendingTasks: string[] = [];
    for (const taskId of this.queue["tasks"].keys()) {
      if (!this.queue.getProcessingTasks().has(taskId)) {
        pendingTasks.push(taskId);
      }
    }

    const tasksToProcess = pendingTasks.slice(0, availableSlots);

    if (tasksToProcess.length > 0) {
      for (const taskId of tasksToProcess) {
        this.processTask(taskId);
      }
    }
  }

  private processTask(taskId: string): void {
    const taskFn = this.queue.get(taskId);
    const { dispatch } = this.store ?? {};

    if (!taskFn || !dispatch) return;

    dispatch(updateBlockHtmlStats(this.queue.getProcessingTasks().size + 1));
    this.queue.addProcessingTask(taskId);

    const processPromise = taskFn(taskId)
      .then((result: T) => {
        dispatch(
          updateBlockHtmlStats(this.queue.getProcessingTasks().size - 1)
        );
        this.queue.removeProcessingTask(taskId);
        return result;
      })
      .catch((error: Error) => {
        dispatch(
          updateBlockHtmlStats(this.queue.getProcessingTasks().size - 1)
        );

        if (process.env["NODE_NEV"] === "development") {
          console.error(`Error processing task ${taskId}:`, error);
        }
        this.queue.removeProcessingTask(taskId);
        return error;
      })
      .finally(() => {
        this.processingPromises.delete(taskId);
        this.queue.delete(taskId);

        if (
          this.isRunning &&
          this.processingPromises.size < this.concurrencyLimit
        ) {
          this.processNextBatch();
        }
      });

    this.processingPromises.set(taskId, processPromise);
  }

  public async waitAllTask() {
    return Promise.all(this.processingPromises.values());
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      activeTaskCount: this.processingPromises.size,
      concurrencyLimit: this.concurrencyLimit,
      pendingTaskCount: this.queue["tasks"].size - this.processingPromises.size,
      checkInterval: this.checkInterval
    };
  }
}
