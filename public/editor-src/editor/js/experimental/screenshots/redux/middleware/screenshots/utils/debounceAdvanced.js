export function debounceAdvanced({
  fn,
  wait = 1000,
  memoizeArgs = [],
  onFirstCall = () => {},
  onAfterFnCall = () => {}
}) {
  let memoizedArgs;
  let tid;
  let onFirstCallCalled = false;

  return (...args) => {
    if (!onFirstCallCalled) {
      onFirstCall();
      onFirstCallCalled = true;
    }

    if (tid) {
      clearTimeout(tid);
    }

    if (memoizeArgs && !memoizedArgs) {
      memoizedArgs = memoizeArgs.reduce((acc, index) => {
        acc[index] = args[index];
        return acc;
      }, {});
    }

    tid = setTimeout(() => {
      const finalArgs = args.map((arg, index) =>
        memoizedArgs[index] ? memoizedArgs[index] : arg
      );

      tid = undefined;
      memoizedArgs = undefined;
      onFirstCallCalled = false;

      fn(...finalArgs);
      onAfterFnCall({ fnArgs: finalArgs });
    }, wait);
  };
}
