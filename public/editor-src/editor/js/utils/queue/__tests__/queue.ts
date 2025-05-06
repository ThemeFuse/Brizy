import { Queue } from "../Queue";

describe("Queue", () => {
  let queue: Queue<string>;

  beforeEach(() => {
    queue = new Queue<string>();
  });

  describe("add", () => {
    test("should add a task to the queue", () => {
      const taskFn = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result"));
      queue.add("task1", taskFn);

      const retrievedTask = queue.get("task1");
      expect(retrievedTask).toBe(taskFn);
    });

    test("should overwrite existing task with same id", () => {
      const taskFn1 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result1"));
      const taskFn2 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result2"));

      queue.add("task1", taskFn1);
      queue.add("task1", taskFn2);

      const retrievedTask = queue.get("task1");
      expect(retrievedTask).toBe(taskFn2);
      expect(retrievedTask).not.toBe(taskFn1);
    });
  });

  describe("delete", () => {
    test("should remove a task from the queue", () => {
      const taskFn = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result"));
      queue.add("task1", taskFn);

      expect(queue.get("task1")).toBeDefined();

      queue.delete("task1");

      expect(queue.get("task1")).toBeUndefined();
    });

    test("should remove a task from processing tasks if it exists there", () => {
      const taskFn = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result"));
      queue.add("task1", taskFn);
      queue.addProcessingTask("task1");

      expect(queue.getProcessingTasks().has("task1")).toBe(true);

      queue.delete("task1");

      expect(queue.getProcessingTasks().has("task1")).toBe(false);
    });

    test("should not throw error when deleting non-existent task", () => {
      expect(() => queue.delete("nonexistent")).not.toThrow();
    });
  });

  describe("get", () => {
    test("should retrieve task by id", () => {
      const taskFn = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result"));
      queue.add("task1", taskFn);

      const retrievedTask = queue.get("task1");
      expect(retrievedTask).toBe(taskFn);
    });

    test("should return undefined for non-existent task id", () => {
      const retrievedTask = queue.get("nonexistent");
      expect(retrievedTask).toBeUndefined();
    });
  });

  describe("getProcessingTasks", () => {
    test("should return empty set initially", () => {
      const processingTasks = queue.getProcessingTasks();
      expect(processingTasks).toBeInstanceOf(Set);
      expect(processingTasks.size).toBe(0);
    });

    test("should return set with processing tasks", () => {
      queue.addProcessingTask("task1");
      queue.addProcessingTask("task2");

      const processingTasks = queue.getProcessingTasks();
      expect(processingTasks.size).toBe(2);
      expect(processingTasks.has("task1")).toBe(true);
      expect(processingTasks.has("task2")).toBe(true);
    });
  });

  describe("addProcessingTask", () => {
    test("should add task id to processing tasks", () => {
      queue.addProcessingTask("task1");

      const processingTasks = queue.getProcessingTasks();
      expect(processingTasks.has("task1")).toBe(true);
    });

    test("should not duplicate task ids in processing tasks", () => {
      queue.addProcessingTask("task1");
      queue.addProcessingTask("task1");

      const processingTasks = queue.getProcessingTasks();
      expect(processingTasks.size).toBe(1);
    });

    test("should add processing task even if task doesnt exist in tasks map", () => {
      queue.addProcessingTask("task1");

      const processingTasks = queue.getProcessingTasks();
      expect(processingTasks.has("task1")).toBe(true);
    });
  });

  describe("removeProcessingTask", () => {
    test("should remove task id from processing tasks", () => {
      queue.addProcessingTask("task1");
      expect(queue.getProcessingTasks().has("task1")).toBe(true);

      queue.removeProcessingTask("task1");
      expect(queue.getProcessingTasks().has("task1")).toBe(false);
    });

    test("should not throw error when removing non-existent processing task", () => {
      expect(() => queue.removeProcessingTask("nonexistent")).not.toThrow();
    });
  });

  describe("getAll", () => {
    test("should return empty array for empty queue", () => {
      const allTasks = queue.getAll();
      expect(allTasks).toEqual([]);
    });

    test("should return array of all task functions", () => {
      const taskFn1 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result1"));
      const taskFn2 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result2"));

      queue.add("task1", taskFn1);
      queue.add("task2", taskFn2);

      const allTasks = queue.getAll();
      expect(allTasks).toHaveLength(2);
      expect(allTasks).toContain(taskFn1);
      expect(allTasks).toContain(taskFn2);
    });

    test("should return array of task functions without their ids", () => {
      const taskFn1 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result1"));
      const taskFn2 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result2"));

      queue.add("task1", taskFn1);
      queue.add("task2", taskFn2);

      const allTasks = queue.getAll();

      expect(allTasks).toEqual([taskFn1, taskFn2]);
    });
  });

  describe("integration between methods", () => {
    test("tasks can be added, processed, and removed", () => {
      const taskFn1 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result1"));
      const taskFn2 = jest
        .fn()
        .mockImplementation(() => Promise.resolve("result2"));
      queue.add("task1", taskFn1);
      queue.add("task2", taskFn2);

      queue.addProcessingTask("task1");
      expect(queue.getProcessingTasks().has("task1")).toBe(true);

      const task = queue.get("task1");
      expect(task).toBeDefined();

      if (task) {
        task("task1").then((result) => {
          expect(result).toBe("result1");
        });
      }

      queue.removeProcessingTask("task1");
      expect(queue.getProcessingTasks().has("task1")).toBe(false);

      queue.delete("task1");
      expect(queue.get("task1")).toBeUndefined();

      expect(queue.get("task2")).toBe(taskFn2);
    });
  });
});
