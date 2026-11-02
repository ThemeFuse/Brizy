import { noop } from "es-toolkit";
import type { Player, VideoSettings } from "./types";

export class CustomVideo implements Player {
  private readonly video: HTMLVideoElement | undefined;
  private readonly loop: boolean | undefined;
  private readonly start: number | string;
  private isFinished = false;

  constructor(element: HTMLElement, settings: VideoSettings) {
    this.video = element.querySelector("video") ?? undefined;
    this.loop = settings.loop;
    this.start = settings.start || 0;

    if (this.video) {
      this.video.addEventListener("ended", this.onEnded);
      // The content attribute, not the property: it only sets `defaultMuted`, which is what the
      // jQuery version wrote too.
      this.video.setAttribute("muted", "true");
      this.video.currentTime = Number(this.start);
      this.video.play();
    }
  }

  play(): void {
    if (this.isFinished) {
      return;
    }

    this.video?.play();
  }

  pause(): void {
    this.video?.pause();
  }

  // The value is ignored on purpose: this backend has always answered a loop change by dropping
  // its restart handler, and the editor rebuilds the player right after (BRZ-1391).
  setLoop(): void {
    this.video?.removeEventListener("ended", this.onEnded);
  }

  // A background video has no timeline to seek on: the start second is applied when the player
  // is built, and a change to it rebuilds the player.
  seekTo = noop;

  destroy(): void {
    if (this.video) {
      this.video.removeEventListener("ended", this.onEnded);
      this.video.currentTime = 0;
    }
  }

  private readonly onEnded = (): void => {
    if (this.isFinished || !this.video) {
      return;
    }

    if (!this.loop) {
      this.isFinished = true;

      return;
    }

    this.video.currentTime = Number(this.start);
    this.video.play();
  };
}
