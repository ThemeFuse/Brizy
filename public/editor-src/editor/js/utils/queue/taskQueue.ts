interface Options {
  interval: number; // default is 1000s
}

export type Task<T extends Array<unknown>> = {
  id: number;
  priority: number;
  cb: (...args: T) => Promise<void>;
  cbArgs?: T;
};

type Queue<T extends Array<unknown>> = {
  _options: {
    interval: number;
  };
  _running: boolean;
  _looping: boolean;
  _tasks: Array<Task<T>>;

  _process(): void;
  _loop(): void;

  taskPriorities: {
    IMMEDIATE: number;
    HIGH: number;
    NORMAL: number;
  };
  enqueue(t: Array<Task<T>>): void;
  start(): void;
  stop(): void;
};

export function makeTaskQueue<T extends Array<unknown>>(
  options?: Options
): Queue<T> {
  return {
    taskPriorities: {
      IMMEDIATE: 0,
      HIGH: 1,
      NORMAL: 2
    },

    _options: {
      interval: 1000,
      ...options
    },

    _running: true,

    _looping: false,

    _tasks: [],

    enqueue(tasks) {
      const currentTaskIds = this._tasks.reduce(
        (acc, task) => {
          acc[task.id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );

      tasks.forEach((task) => {
        if (!currentTaskIds[task.id]) {
          this._tasks.push(task);
        } else {
          const index = this._tasks.findIndex((t) => t.id === task.id);
          this._tasks[index] = task;
        }
      });

      this._tasks.sort((a, b) => a.priority - b.priority);

      this._process();
    },

    start() {
      this._running = true;
      this._process();
    },

    stop() {
      this._running = false;
    },

    _process() {
      if (this._tasks.length === 0) {
        return;
      }

      // find IMMEDIATE tasks and run them instantly
      this._tasks.forEach((task) => {
        if (task.priority === this.taskPriorities.IMMEDIATE) {
          // @ts-expect-error: Argument of type T | never[] is not assignable to parameter of type T
          task.cb(...(task.cbArgs || []));
        }
      });

      // remove all IMMEDIATE tasks after they were run
      this._tasks = this._tasks.filter(
        (task) => task.priority !== this.taskPriorities.IMMEDIATE
      );

      if (!this._looping) {
        this._loop();
      }
    },

    _loop() {
      this._looping = true;

      setTimeout(async () => {
        if (this._running && this._tasks.length > 0) {
          const task = this._tasks.shift();

          try {
            // @ts-expect-error: 'enqueueAgain' implicitly has return type 'any'
            const enqueueAgain = () => (enqueueAgain.called = true);

            // @ts-expect-error: 'enqueueAgain' not assigned to T
            await task?.cb(...(task.cbArgs || []), enqueueAgain);

            // @ts-expect-error: 'called' does not exist on type '() => any'.
            if (enqueueAgain.called && task) {
              this._tasks.push(task);
            }
          } catch (e) {
            // not sure how to deal with this yet
            // maybe add some retry mechanism later
            if (process.env.NODE_ENV === "development") {
              /* eslint-disable no-console */
              console.error("screenshot error", e);
              /* eslint-enabled no-console */
            }
          }

          if (this._tasks.length > 0) {
            this._loop();
          } else {
            this._looping = false;
          }
        } else {
          this._looping = false;
        }
      }, this._options.interval);
    }
  };
}
