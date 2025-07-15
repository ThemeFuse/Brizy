import { Store, createStore } from "visual/redux/store";
import { Queue } from "../Queue";
import { QueueWorker } from "../QueueWorker";

const fakePromise = () => {
  return new Promise((res) => {
    setTimeout(res, 100);
  });
};

describe("QueueWorker", () => {
  let queue: Queue<string>;
  let worker: QueueWorker<string>;
  let mockStore: Store;

  beforeEach(() => {
    jest.clearAllMocks();

    queue = new Queue<string>();

    mockStore = createStore();

    worker = new QueueWorker<string>(queue, 2, 100);
  });

  afterEach(() => {
    worker.stop();
    jest.useRealTimers();
  });

  test("should report not running status when initialized", () => {
    const status = worker.getStatus();
    expect(status.isRunning).toBe(false);
    expect(status.activeTaskCount).toBe(0);
    expect(status.concurrencyLimit).toBe(2);
    expect(status.pendingTaskCount).toBe(0);
    expect(status.checkInterval).toBe(100);
  });

  test("should report running status after start", () => {
    worker.start(mockStore);
    const status = worker.getStatus();
    expect(status.isRunning).toBe(true);
  });

  test("should process tasks after start", async () => {
    const taskFn = jest
      .fn()
      .mockImplementation(() => Promise.resolve("result"));
    queue.add("task1", taskFn);

    worker.start(mockStore);

    await worker.waitAllTask();
    expect(taskFn).toHaveBeenCalled();
  });

  test("should stop worker and report not running status", () => {
    worker.start(mockStore);
    expect(worker.getStatus().isRunning).toBe(true);

    worker.stop();

    expect(worker.getStatus().isRunning).toBe(false);
  });

  test("should process multiple tasks up to concurrency limit", async () => {
    let resolve1: (value: string) => void;

    const task1 = jest.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolve1 = resolve;
        })
    );
    const task2 = jest.fn().mockImplementation(fakePromise);
    const task3 = jest.fn().mockImplementation(fakePromise);

    queue.add("task1", task1);
    queue.add("task2", task2);
    queue.add("task3", task3);

    worker.start(mockStore);

    expect(task1).toHaveBeenCalled();
    expect(task2).toHaveBeenCalled();
    expect(task3).not.toHaveBeenCalled();

    // @ts-expect-error: Variable resolve1 is used before being assigned.
    resolve1("result1");
    await fakePromise();

    expect(task3).toHaveBeenCalled();

    await worker.waitAllTask();

    expect(queue.getAll().length).toBe(0);
  });

  test("should wait for current tasks when stopping with waitForCurrent=true", async () => {
    jest.useFakeTimers();

    let resolveTask: (value: string) => void;
    const taskFn = jest.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveTask = resolve;
        })
    );

    queue.add("task1", taskFn);

    worker.start(mockStore);

    await Promise.resolve();

    expect(taskFn).toHaveBeenCalled();

    const stopPromise = worker.stop(true);

    expect(worker.getStatus().isRunning).toBe(false);

    // @ts-expect-error: Variable resolveTask is used before being assigned.
    resolveTask?.("result");
    await Promise.resolve();

    await stopPromise;

    jest.runOnlyPendingTimers();
    await Promise.resolve();

    expect(queue.getAll().length).toBe(0);
  });

  test("should handle regular stop without waiting", async () => {
    jest.useFakeTimers();

    let resolveTask: (value: string) => void;
    const taskFn = jest.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveTask = resolve;
        })
    );

    queue.add("task1", taskFn);

    worker.start(mockStore);

    await Promise.resolve();

    expect(taskFn).toHaveBeenCalled();

    const result = worker.stop();

    expect(result).toBeUndefined();

    expect(worker.getStatus().isRunning).toBe(false);

    // @ts-expect-error: Variable resolveTask is used before being assigned.
    resolveTask("result");
    await Promise.resolve();
  });

  test("should report accurate status with pending tasks", async () => {
    jest.useFakeTimers();

    const task1 = jest
      .fn()
      .mockImplementation(() => Promise.resolve("result1"));
    const task2 = jest
      .fn()
      .mockImplementation(() => Promise.resolve("result2"));
    const task3 = jest
      .fn()
      .mockImplementation(() => Promise.resolve("result3"));

    queue.add("task1", task1);
    queue.add("task2", task2);
    queue.add("task3", task3);

    worker.start(mockStore);

    jest.runOnlyPendingTimers();
    await Promise.resolve();

    const status = worker.getStatus();

    expect(status.isRunning).toBe(true);
    expect(status.concurrencyLimit).toBe(2);
    expect(status.checkInterval).toBe(100);
  });

  test("should handle task failure gracefully", async () => {
    jest.useFakeTimers();

    const errorTask = jest
      .fn()
      .mockImplementation(() => Promise.reject("Task failed"));

    queue.add("errorTask", errorTask);

    worker.start(mockStore);

    await worker.waitAllTask();

    expect(queue.get("errorTask")).toBe(undefined);

    expect(worker.getStatus().isRunning).toBe(true);
  });
});
