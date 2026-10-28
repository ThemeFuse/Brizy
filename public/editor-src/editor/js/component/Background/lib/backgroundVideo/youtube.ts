import type { Player, VideoSettings } from "./types";
import {
  type YoutubePlayer,
  type YoutubeReadyEvent,
  type YoutubeStateEvent,
  youtubeLoadScript
} from "./youtubeLoader";

export class Youtube implements Player {
  private loop: boolean | undefined;
  private start: number | string;
  private shouldPause = false;
  private isFinished = false;
  private player: YoutubePlayer | undefined;

  constructor(iframe: HTMLIFrameElement | undefined, settings: VideoSettings) {
    this.loop = settings.loop;
    this.start = settings.start || 0;

    youtubeLoadScript(() => this.init(iframe));
  }

  play(): void {
    if (this.isFinished) {
      return;
    }

    this.player?.playVideo();
  }

  pause(): void {
    if (this.player) {
      this.player.pauseVideo();
    } else {
      this.shouldPause = true;
    }
  }

  setLoop(value: boolean | undefined): void {
    this.play();
    this.loop = value;
  }

  seekTo(seconds: number | string | undefined): void {
    this.start = seconds ?? 0;
    this.player?.seekTo(this.start);
  }

  destroy(): void {
    // The player's own `destroy()` was commented out upstream, so the iframe keeps whatever the
    // API put on it and a later type change builds a second player on the same node (BRZ-1391).
    this.player = undefined;
  }

  private init(iframe: HTMLIFrameElement | undefined): void {
    const api = window.YT;

    if (!iframe || !api) {
      return;
    }

    this.player = new api.Player(iframe, {
      events: {
        onReady: (event: YoutubeReadyEvent): void => {
          event.target.mute();
          event.target.seekTo(this.start);
          event.target.playVideo();

          if (this.shouldPause) {
            event.target.pauseVideo();
          } else {
            event.target.playVideo();
          }
        },
        onStateChange: (event: YoutubeStateEvent): void => {
          if (event.data !== api.PlayerState.ENDED) {
            return;
          }

          if (this.loop) {
            event.target.seekTo(this.start);
            event.target.playVideo();
          } else {
            this.isFinished = true;
          }
        }
      }
    });
  }
}
