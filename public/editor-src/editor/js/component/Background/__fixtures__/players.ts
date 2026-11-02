// Stand-ins for the three things the background-video plugin talks to: the YouTube IFrame API,
// Vimeo's postMessage protocol and the browser's own <video>. They record calls in the order they
// arrive, because order is the part of this plugin most likely to change by accident.

// The IFrame API calls this global once its script has loaded; both this plugin and
// `editorComponents/Video/export.js` install and chain it. It moves into the rewritten loader
// module in the last step of the ticket.
declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export type Call = [string, ...unknown[]];

export interface FakeYoutube {
  players: FakeYoutubePlayer[];
  calls: Call[];
  /** What the IFrame API itself calls once the script has loaded. */
  ready: () => void;
  scripts: () => HTMLScriptElement[];
}

export class FakeYoutubePlayer {
  readonly element: Element;
  readonly config: YoutubePlayerConfig;

  private readonly calls: Call[];

  constructor(element: Element, config: YoutubePlayerConfig, calls: Call[]) {
    this.element = element;
    this.config = config;
    this.calls = calls;
  }

  mute = (): void => this.record("mute");
  unMute = (): void => this.record("unMute");
  playVideo = (): void => this.record("playVideo");
  pauseVideo = (): void => this.record("pauseVideo");
  stopVideo = (): void => this.record("stopVideo");
  seekTo = (seconds: unknown): void => this.record("seekTo", seconds);

  private record(method: string, ...args: unknown[]): void {
    this.calls.push([method, ...args]);
  }
}

export interface YoutubePlayerConfig {
  events: {
    onReady: (event: { target: FakeYoutubePlayer }) => void;
    onStateChange: (event: { data: number; target: FakeYoutubePlayer }) => void;
  };
}

const ENDED = 0;

export function installYoutubeApi(): FakeYoutube {
  const players: FakeYoutubePlayer[] = [];
  const calls: Call[] = [];

  class Player extends FakeYoutubePlayer {
    constructor(element: Element, config: YoutubePlayerConfig) {
      super(element, config, calls);
      players.push(this);
    }
  }

  Object.defineProperty(window, "YT", {
    configurable: true,
    writable: true,
    value: { Player, PlayerState: { ENDED, PLAYING: 1 } }
  });

  return {
    players,
    calls,
    ready: (): void => window.onYouTubeIframeAPIReady?.(),
    scripts: (): HTMLScriptElement[] => [
      ...document.querySelectorAll<HTMLScriptElement>(
        "script[src='https://www.youtube.com/iframe_api']"
      )
    ]
  };
}

export function restoreYoutubeApi(): void {
  Reflect.deleteProperty(window, "YT");
  // The plugin only installs its handler when the global is still undefined, so a leftover from
  // an earlier case would silently disable the whole handshake.
  Reflect.deleteProperty(window, "onYouTubeIframeAPIReady");
}

export interface FakeVimeo {
  messages: () => unknown[];
  send: (payload: Record<string, unknown>) => void;
}

// The plugin posts JSON strings into the iframe and listens for JSON strings on `window`.
export function installVimeo(iframe: HTMLIFrameElement): FakeVimeo {
  const posted: unknown[] = [];
  const contentWindow = iframe.contentWindow;

  if (contentWindow === null) {
    throw new Error("the fixture iframe must be attached to the document");
  }

  jest
    .spyOn(contentWindow, "postMessage")
    .mockImplementation((message: unknown) => {
      posted.push(message);
    });

  return {
    messages: (): unknown[] => posted,
    send: (payload: Record<string, unknown>): void => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://player.vimeo.com",
          data: JSON.stringify(payload)
        })
      );
    }
  };
}

export const vimeoMessage = (method: string, value?: unknown): string =>
  JSON.stringify({ method, value });
