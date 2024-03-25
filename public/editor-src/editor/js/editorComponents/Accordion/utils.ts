interface Config {
  duration: string | number;
  height: number;
  onFinish?: VoidFunction;
  onStart?: VoidFunction;
}

export const expand = (node: HTMLElement, config: Config): void => {
  const { height, duration, onFinish, onStart } = config;

  onStart?.();

  requestAnimationFrame(() => {
    const animation = node.animate(
      [
        { height: `${height}px`, offset: 0 },
        { height: 0, offset: 1 }
      ],
      {
        duration,
        iterations: 1,
        fill: "backwards"
      }
    );
    if (typeof onFinish === "function") {
      animation.onfinish = onFinish;
    }
  });
};

export const collapse = (node: HTMLElement, config: Config): void => {
  const { height, duration, onFinish, onStart } = config;

  onStart?.();

  requestAnimationFrame(() => {
    const animation = node.animate(
      [
        { height: 0, offset: 0 },
        { height: `${height}px`, offset: 1 }
      ],
      {
        duration,
        iterations: 1,
        fill: "backwards"
      }
    );
    if (typeof onFinish === "function") {
      animation.onfinish = onFinish;
    }
  });
};
