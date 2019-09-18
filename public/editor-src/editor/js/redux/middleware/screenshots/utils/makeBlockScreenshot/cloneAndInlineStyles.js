export async function cloneAndInlineStyles(node) {
  const original = node;
  const cloned = node.cloneNode(true);

  const rafScheduler = new RafScheduler({
    tasks: splitIntoTasks(cloned, original),
    taskCb: processTask,
    msPerFrame: 10
  });
  await rafScheduler.schedule();

  return cloned;
}

function splitIntoTasks(clone, original, tasks = []) {
  const originalStyle = window.getComputedStyle(original);

  tasks.push({
    clone,
    originalStyle
  });

  if (!(original instanceof HTMLIFrameElement)) {
    for (let i = 0; i < clone.children.length; i++) {
      splitIntoTasks(clone.children[i], original.children[i], tasks);
    }
  }

  return tasks;
}

function processTask(task) {
  const { clone, originalStyle } = task;

  if (originalStyle.cssText) {
    clone.style.cssText = originalStyle.cssText;
  } else {
    for (let i = 0; i < originalStyle.length; i++) {
      const name = originalStyle[i];

      clone.style.setProperty(
        name,
        originalStyle.getPropertyValue(name),
        originalStyle.getPropertyPriority(name)
      );
    }
  }
}

class RafScheduler {
  constructor({ tasks, taskCb, msPerFrame }) {
    this._tasks = tasks;
    this._taskCb = taskCb;
    this._msPerFrame = msPerFrame;

    this._process = this._process.bind(this);
  }

  schedule() {
    this._currentTaskIndex = 0;

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      requestAnimationFrame(this._process);
    });
  }

  _process(taskStartTime) {
    do {
      this._taskCb(this._tasks[this._currentTaskIndex]);

      if (this._currentTaskIndex === this._tasks.length - 1) {
        requestAnimationFrame(this._resolve);
        return;
      } else {
        this._currentTaskIndex++;
      }
    } while (performance.now() - taskStartTime < this._msPerFrame);

    requestAnimationFrame(this._process);
  }
}
