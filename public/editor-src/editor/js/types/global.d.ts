// Our own jquery plugins
interface JQuery {
  parallax(p: unknown): void;
  backgroundVideo(b: unknown, c?: unknown): void;
}

declare namespace NodeJS {
  interface Global {
    IS_EDITOR: boolean;
  }
}
