import { Str } from "@brizy/readers";
import { createDebounceById } from "../createDebounceById";

describe("createDebounceById", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should call the function after the specified delay", async () => {
    const mockFn = jest.fn().mockReturnValue("result");
    const debounce = createDebounceById(mockFn, 100);

    const promise = debounce.set("id-1", "arg1", "arg2");

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    const result = await promise;

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    expect(result).toBe("result");
  });

  test("should reset the timer when called multiple times with the same ID", async () => {
    const mockFn = jest.fn().mockReturnValue("result");
    const debounce = createDebounceById(mockFn, 100);

    debounce.set("id-1", "call1");
    jest.advanceTimersByTime(50);

    const promise = debounce.set("id-1", "call2");
    jest.advanceTimersByTime(50);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);

    const result = await promise;

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("call2");
    expect(result).toBe("result");
  });

  test("should handle multiple IDs independently", async () => {
    const mockFn = jest.fn().mockImplementation((arg) => `processed-${arg}`);
    const debounce = createDebounceById(mockFn, 100);

    const promise1 = debounce.set("id-1", "first");
    const promise2 = debounce.set("id-2", "second");

    jest.advanceTimersByTime(100);

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, "first");
    expect(mockFn).toHaveBeenNthCalledWith(2, "second");
    expect(result1).toBe("processed-first");
    expect(result2).toBe("processed-second");
  });

  test("should cancel pending calls when cancel is called", async () => {
    const mockFn = jest.fn();
    const debounce = createDebounceById(mockFn, 100);

    debounce.set("id-1", "arg1");
    debounce.cancel("id-1");

    jest.advanceTimersByTime(200);

    expect(mockFn).not.toHaveBeenCalled();
  });

  test("should only cancel the specified ID", async () => {
    const mockFn = jest.fn();
    const debounce = createDebounceById(mockFn, 100);

    debounce.set("id-1", "arg1");
    debounce.set("id-2", "arg2");
    debounce.cancel("id-1");

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg2");
  });

  test("should handle multiple calls with the same ID", async () => {
    const mockFn = jest.fn();
    const debounce = createDebounceById(mockFn, 50);

    debounce.set("id-1", "call1");
    debounce.set("id-1", "call2");
    debounce.set("id-1", "call3");

    jest.advanceTimersByTime(50);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("call3");
  });

  test("should handle errors in the debounced function", async () => {
    const mockFn = jest.fn(() => {
      return Promise.reject("Test error");
    });
    const debounce = createDebounceById(mockFn, 100);

    const promise = debounce.set("id-1");

    jest.advanceTimersByTime(100);

    try {
      await promise;
      fail("Promise should have been rejected");
    } catch (e) {
      if (Str.read(e)) {
        expect(e).toBe("Test error");
      } else {
        fail("Invalid tests on promise.reject");
      }
    }

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("should do nothing when canceling an ID that does not exist", () => {
    const mockFn = jest.fn();
    const debounce = createDebounceById(mockFn, 100);

    expect(() => debounce.cancel("non-existent-id")).not.toThrow();
  });

  test("should clean up timeouts after execution", async () => {
    const mockFn = jest.fn();
    const debounce = createDebounceById(mockFn, 100);

    const promise = debounce.set("id-1", "arg1");
    jest.advanceTimersByTime(100);
    await promise;

    debounce.cancel("id-1");

    const promise2 = debounce.set("id-1", "arg2");
    jest.advanceTimersByTime(100);
    await promise2;

    // Assert
    expect(mockFn).toHaveBeenNthCalledWith(1, "arg1");
    expect(mockFn).toHaveBeenNthCalledWith(2, "arg2");
  });
});
