import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import type { Player, VideoSettings } from "./types";

// Vimeo is driven through the player's postMessage protocol rather than its SDK.
//
// Two things here are kept as they were and are not fixed by this rewrite (BRZ-1391): the window
// listener is never removed, so a re-initialised video leaves its predecessor listening, and the
// `ready` branch re-subscribes every time because the guard upstream read a data key that was
// never written.
const LOOP_RESTART_DELAY = 260;

// The payload arrives from another origin, so it is parsed rather than trusted. A ping carries
// only `method`, a player event only `event`; anything else is ignored, as it was before.
const messageSchema = z.object({
  method: z.string().optional(),
  event: z.string().optional()
});

export class Vimeo implements Player {
  private readonly iframe: HTMLIFrameElement | undefined;
  private loop: boolean | undefined;
  private start: number | string;
  private isFinished = false;
  private shouldPause = false;

  constructor(iframe: HTMLIFrameElement | undefined, settings: VideoSettings) {
    this.iframe = iframe;
    this.loop = settings.loop;
    this.start = settings.start || 0;

    window.addEventListener("message", this.onMessage, false);

    this.send("ping");
  }

  play(): void {
    if (!this.isFinished) {
      this.send("play");
    }
  }

  pause(): void {
    this.send("pause");
    this.shouldPause = true;
  }

  setLoop(value: boolean | undefined): void {
    this.play();
    this.loop = value;
  }

  seekTo(seconds: number | string | undefined): void {
    this.start = seconds ?? 0;
    this.send("setCurrentTime", this.start);
  }

  destroy(): void {
    this.send("unload");
    this.send("removeEventListener", "loaded");
    this.send("removeEventListener", "finish");
  }

  private readonly onMessage = (event: MessageEvent): void => {
    if (!event.origin.includes("vimeo")) {
      return;
    }

    const message = messageSchema.safeParse(JSON.parse(event.data));

    if (!message.success) {
      return;
    }

    const { method, event: playerEvent } = message.data;
    const readyAttr = makeAttr("ready");

    if (method === "ping" && !this.iframe?.getAttribute(readyAttr)) {
      this.iframe?.setAttribute(readyAttr, "true");
      this.subscribe();
    }

    switch (playerEvent) {
      case "ready": {
        this.iframe?.setAttribute(readyAttr, "true");
        this.subscribe();

        if (this.shouldPause) {
          this.send("pause");
        }

        break;
      }
      case "finish": {
        this.send("setCurrentTime", this.start);

        if (this.loop) {
          // The player ignores a `play` sent right after the rewind, so it goes out late.
          setTimeout(() => this.send("play"), LOOP_RESTART_DELAY);
        } else {
          this.isFinished = true;
        }

        break;
      }
      case "loaded": {
        this.send("setCurrentTime", this.start);
        this.send("setVolume", 0);

        if (!this.shouldPause) {
          this.send("play");
        }

        break;
      }
    }
  };

  private subscribe(): void {
    this.send("addEventListener", "loaded");
    this.send("addEventListener", "finish");
  }

  private send(method: string, value?: number | string): void {
    const contentWindow = this.iframe?.contentWindow;

    if (!contentWindow) {
      return;
    }

    contentWindow.postMessage(JSON.stringify({ method, value }), "*");
  }
}
