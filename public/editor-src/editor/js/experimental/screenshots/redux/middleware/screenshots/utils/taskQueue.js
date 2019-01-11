export function makeTaskQueue(options) {
  return {
    taskPriorities: {
      IMMEDIATE: 0,
      NORMAL: 1
    },

    _options: {
      interval: 1000,
      ...options
    },

    _running: true,

    _looping: false,

    _tasks: [],

    enqueue(tasks) {
      const currentTaskIds = this._tasks.reduce((acc, task) => {
        acc[task.id] = true;
        return acc;
      }, {});

      tasks.forEach(task => {
        if (!currentTaskIds[task.id]) {
          this._tasks.push(task);
        } else {
          const index = this._tasks.findIndex(t => t.id === task.id);
          this._tasks[index] = task;
        }
      });

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
      this._tasks.forEach(task => {
        if (task.priority === this.taskPriorities.IMMEDIATE) {
          task.cb();
        }
      });

      // remove all IMMEDIATE tasks after they were run
      this._tasks = this._tasks.filter(
        task => task.priority !== this.taskPriorities.IMMEDIATE
      );

      if (!this._looping) {
        this._loop();
      }
    },

    _loop() {
      this._looping = true;

      setTimeout(async () => {
        if (this._running && this._tasks.length > 0) {
          const task = this._tasks[0];

          try {
            await task.cb();
            this._tasks.shift();
          } catch (e) {
            // not sure how to deal with this yet
            // maybe add some retry mechanism later
            this._tasks.shift();
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
