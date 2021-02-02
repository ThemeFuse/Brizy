interface Config {
  duration: string;
  height: number;
}

export const expend = (node: HTMLElement, config: Config): void => {
  const { height, duration } = config;
  node.animate(
    [
      { height: `${height}px`, offset: 0 },
      { height: 0, offset: 1 }
    ],
    {
      duration,
      iterations: 1,
      fill: "forwards" // ensures item stays open at end of animation
    }
  );
};

export const collapse = (node: HTMLElement, config: Config): void => {
  const { height, duration } = config;
  node.animate(
    [
      { height: 0, offset: 0 },
      { height: `${height}px`, offset: 1 },
      { height: "auto" }
    ],
    {
      duration,
      iterations: 1,
      fill: "forwards" // ensures item stays open at end of animation
    }
  );
};
