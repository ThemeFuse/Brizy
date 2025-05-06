type Task<T> = (t: string) => Promise<T>;

export class Queue<T> {
  private tasks: Map<string, Task<T>> = new Map();
  private processingTasks: Set<string> = new Set();

  add(id: string, task: Task<T>) {
    this.tasks.set(id, task);
  }

  delete(id: string) {
    this.tasks.delete(id);
    this.processingTasks.delete(id);
  }

  get(id: string): Task<T> | undefined {
    return this.tasks.get(id);
  }

  getProcessingTasks(): Set<string> {
    return this.processingTasks;
  }

  addProcessingTask(id: string) {
    this.processingTasks.add(id);
  }

  removeProcessingTask(id: string) {
    this.processingTasks.delete(id);
  }

  getAll(): Task<T>[] {
    return Array.from(this.tasks.values());
  }
}
