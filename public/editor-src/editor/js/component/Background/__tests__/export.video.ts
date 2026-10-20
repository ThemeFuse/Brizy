import { z } from "zod";
import type { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import {
  type BackgroundEnv,
  installBackgroundEnv,
  restoreBackgroundEnv
} from "../__fixtures__/env";
import { bgVideoHtml } from "../__fixtures__/markup";
import {
  type FakeVimeo,
  type FakeYoutube,
  installVimeo,
  installYoutubeApi,
  restoreYoutubeApi,
  vimeoMessage
} from "../__fixtures__/players";

// Characterization suite for the background-video half of `component/Background/export.ts`,
// written against the jQuery plugin it is about to replace. Expectations describe today's
// behaviour, latent bugs included.

const element = z.instanceof(HTMLElement);
const iframeSchema = z.instanceof(HTMLIFrameElement);

const query = (root: ParentNode, selector: string): HTMLElement =>
  element.parse(root.querySelector(selector));

const queryIframe = (root: ParentNode): HTMLIFrameElement =>
  iframeSchema.parse(root.querySelector("iframe"));

let env: BackgroundEnv;
let youtube: FakeYoutube;
let initBackground: ExportFunction;

async function loadExport(): Promise<ExportFunction> {
  await loadFreeRuntime({ kind: "mocked", componentManifest: {} });
  const module: { default: ExportFunction } = await import(
    "visual/component/Background/export"
  );

  return module.default;
}

beforeEach(async () => {
  silenceConsole();
  env = installBackgroundEnv();
  youtube = installYoutubeApi();
  initBackground = await loadExport();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  document.body.innerHTML = "";
  restoreYoutubeApi();
  restoreBackgroundEnv();
  jest.restoreAllMocks();
});

describe("cover sizing", () => {
  it.each([
    {
      case: "a box narrower than 16:9",
      width: 320,
      height: 180,
      out: { width: "321px", height: "180px", left: "-0.5px", top: "0px" }
    },
    {
      case: "a box wider than 16:9",
      width: 400,
      height: 180,
      out: { width: "400px", height: "225px", left: "0px", top: "-22.5px" }
    }
  ])("fits the iframe over $case", ({ width, height, out }) => {
    const root = mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start: "0",
        width,
        height,
        media: "iframe"
      })
    );

    initBackground(root);

    const iframe = queryIframe(root);

    expect(iframe.style.width).toBe(out.width);
    expect(iframe.style.height).toBe(out.height);
    expect(iframe.style.left).toBe(out.left);
    expect(iframe.style.top).toBe(out.top);
  });

  it("hides the WordPress admin bar only while measuring", () => {
    const adminBar = document.createElement("div");
    adminBar.id = "wpadminbar";
    adminBar.style.display = "block";
    document.body.append(adminBar);

    const root = mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start: "0",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

    initBackground(root);

    // `removeProperty` drops the inline value rather than restoring what was there.
    expect(adminBar.style.display).toBe("");
  });

  it("refits on a window resize", () => {
    const root = mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start: "0",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

    initBackground(root);

    const video = query(root, ".brz-bg-video");
    video.style.width = "400px";
    window.dispatchEvent(new Event("resize"));

    // The plugin's own resize handler runs immediately; the export's debounced one would need
    // another 100ms and produces the same result.
    expect(queryIframe(root).style.height).toBe("225px");
  });
});

describe("the YouTube handshake", () => {
  const mountYoutube = (start: string): HTMLElement =>
    mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start,
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

  it("loads the API script once, consent-tagged, and waits for it", () => {
    const root = mountYoutube("0");

    initBackground(root);

    const scripts = youtube.scripts();

    expect(scripts).toHaveLength(1);
    expect(scripts[0].async).toBe(true);
    expect(scripts[0].getAttribute(makeAttr("consent"))).toBe("marketing");
    expect(youtube.players).toHaveLength(0);

    youtube.ready();

    expect(window.Brz.emittedEvents["plugin.video.iframe.ready"]).toHaveLength(
      1
    );
    expect(youtube.players).toHaveLength(1);
    expect(youtube.players[0].element).toBe(queryIframe(root));
  });

  it.each([
    {
      case: "an autoplaying video",
      pauseFirst: false,
      calls: [["mute"], ["seekTo", 10], ["playVideo"], ["playVideo"]]
    },
    {
      case: "a video asked to pause before the API was ready",
      pauseFirst: true,
      calls: [["mute"], ["seekTo", 10], ["playVideo"], ["pauseVideo"]]
    }
  ])("runs the ready sequence for $case", ({ pauseFirst, calls }) => {
    const root = mountYoutube("10");

    initBackground(root);

    if (pauseFirst) {
      // The section slider pauses every background video outside the active slide.
      const wrapper = document.createElement("div");
      const slick = document.createElement("div");
      const content = document.createElement("div");

      content.className = "brz-section__content";
      slick.append(content);
      wrapper.append(query(root, ".brz-bg-video"));

      window.Brz.emit("elements.slick.ready", { slick, wrapper });
    }

    youtube.ready();

    const player = youtube.players[0];

    player.config.events.onReady({ target: player });

    expect(youtube.calls).toEqual(calls);
  });
});

describe("settings read off the markup", () => {
  // `$().data()` coerces, and the coerced value is what reaches the player: `"10"` becomes the
  // number 10, `"010"` stays a string because it does not round-trip, and an empty or missing
  // attribute falls through `settings.start || 0`.
  it.each([
    { case: "a plain number", start: "10", seekTo: 10 },
    { case: "a fractional number", start: "1.5", seekTo: 1.5 },
    { case: "a number that does not round-trip", start: "010", seekTo: "010" },
    { case: "an empty attribute", start: "", seekTo: 0 },
    { case: "a missing attribute", start: undefined, seekTo: 0 }
  ])("passes the start of $case to the player", ({ start, seekTo }) => {
    const root = mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start,
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

    initBackground(root);
    youtube.ready();

    const player = youtube.players[0];

    player.config.events.onReady({ target: player });

    expect(youtube.calls[1]).toEqual(["seekTo", seekTo]);
  });
});

describe("reaching the end of the video", () => {
  const mount = (loop: string): HTMLElement =>
    mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop,
        start: "10",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

  it.each([
    {
      case: "a looping video restarts",
      loop: "true",
      afterEnd: [["seekTo", 10], ["playVideo"]],
      afterSlideIn: [["seekTo", 10], ["playVideo"], ["playVideo"]]
    },
    {
      case: "a one-shot video stays finished",
      loop: "false",
      afterEnd: [],
      afterSlideIn: []
    }
  ])("$case", ({ loop, afterEnd, afterSlideIn }) => {
    const root = mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop,
        start: "10",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

    initBackground(root);
    youtube.ready();

    const player = youtube.players[0];

    youtube.calls.length = 0;
    player.config.events.onStateChange({ data: 0, target: player });

    expect(youtube.calls).toEqual(afterEnd);

    const section = query(root, ".brz-section");

    window.Brz.emit("elements.section.slide.change", {
      node: section,
      slick: section
    });

    expect(youtube.calls).toEqual(afterSlideIn);
  });

  it("pauses when the section slider moves the video out of view", () => {
    const root = mount("true");

    initBackground(root);
    youtube.ready();

    const player = youtube.players[0];

    player.config.events.onReady({ target: player });
    youtube.calls.length = 0;

    window.Brz.emit("elements.section.slide.change", {
      node: query(root, ".brz-section"),
      slick: document.createElement("div")
    });

    expect(youtube.calls).toEqual([["pauseVideo"]]);
  });
});

describe("re-initialisation", () => {
  const mount = (): HTMLElement =>
    mountRoot(
      bgVideoHtml({
        type: "youtube",
        loop: "true",
        start: "10",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

  it("builds a second player on the same iframe when a story initialises", () => {
    const root = mount();

    initBackground(root);
    youtube.ready();

    window.Brz.emit("elements.story.init", query(root, ".brz-section"));

    // The old player is never torn down: `Youtube.destroy` only drops the reference.
    expect(youtube.players).toHaveLength(2);
    expect(youtube.players[1].element).toBe(youtube.players[0].element);
  });

  it("loses its own resize listener after a slider re-init", () => {
    const root = mount();

    initBackground(root);
    youtube.ready();

    const video = query(root, ".brz-bg-video");
    const iframe = queryIframe(root);

    // The section itself stands in for the slider: it already contains the video and carries no
    // `.brz-section__content`, which is what sends the export down the re-init branch. Moving the
    // node instead would reload the iframe and measure a detached element.
    window.Brz.emit("elements.slick.ready", {
      slick: query(root, ".brz-section")
    });

    video.style.width = "400px";
    window.dispatchEvent(new Event("resize"));

    // `reinit` destroys the instance, which detaches the plugin's own listener for good; nothing
    // re-attaches it. Only the export's debounced listener is left.
    expect(iframe.style.height).toBe("180px");

    jest.advanceTimersByTime(100);

    expect(iframe.style.height).toBe("225px");
  });
});

describe("the Vimeo protocol", () => {
  interface MountedVimeo {
    root: HTMLElement;
    vimeo: FakeVimeo;
  }

  const mountVimeo = (loop: string): MountedVimeo => {
    const root = mountRoot(
      bgVideoHtml({
        type: "vimeo",
        loop,
        start: "10",
        width: 320,
        height: 180,
        media: "iframe"
      })
    );

    // The spy has to exist before the plugin sends its first message.
    const vimeo = installVimeo(queryIframe(root));

    initBackground(root);

    return { root, vimeo };
  };

  it("pings the player and subscribes once the ping comes back", () => {
    const { root, vimeo } = mountVimeo("true");

    expect(vimeo.messages()).toEqual([vimeoMessage("ping")]);

    vimeo.send({ method: "ping" });

    expect(queryIframe(root).getAttribute(makeAttr("ready"))).toBe("true");
    expect(vimeo.messages()).toEqual([
      vimeoMessage("ping"),
      vimeoMessage("addEventListener", "loaded"),
      vimeoMessage("addEventListener", "finish")
    ]);
  });

  it("subscribes again on every ready event", () => {
    const { vimeo } = mountVimeo("true");

    vimeo.send({ method: "ping" });
    vimeo.send({ event: "ready" });

    // The guard reads `data-ready` while the attribute written is `data-brz-ready`, so it never
    // matches and the subscription is sent a second time.
    expect(vimeo.messages()).toEqual([
      vimeoMessage("ping"),
      vimeoMessage("addEventListener", "loaded"),
      vimeoMessage("addEventListener", "finish"),
      vimeoMessage("addEventListener", "loaded"),
      vimeoMessage("addEventListener", "finish")
    ]);
  });

  it("starts muted at the configured second once the video is loaded", () => {
    const { vimeo } = mountVimeo("true");

    vimeo.send({ event: "loaded" });

    expect(vimeo.messages()).toEqual([
      vimeoMessage("ping"),
      vimeoMessage("setCurrentTime", 10),
      vimeoMessage("setVolume", 0),
      vimeoMessage("play")
    ]);
  });

  it.each([
    {
      case: "a looping video restarts after a delay",
      loop: "true",
      afterFinish: [vimeoMessage("setCurrentTime", 10)],
      afterDelay: [vimeoMessage("setCurrentTime", 10), vimeoMessage("play")]
    },
    {
      case: "a one-shot video stays finished",
      loop: "false",
      afterFinish: [vimeoMessage("setCurrentTime", 10)],
      afterDelay: [vimeoMessage("setCurrentTime", 10)]
    }
  ])("$case", ({ loop, afterFinish, afterDelay }) => {
    const { root, vimeo } = mountVimeo(loop);

    vimeo.messages().length = 0;
    vimeo.send({ event: "finish" });

    expect(vimeo.messages()).toEqual(afterFinish);

    // The restart goes through a 260ms timeout rather than the player's own loop flag.
    jest.advanceTimersByTime(260);

    expect(vimeo.messages()).toEqual(afterDelay);

    const section = query(root, ".brz-section");

    vimeo.messages().length = 0;
    window.Brz.emit("elements.section.slide.change", {
      node: section,
      slick: section
    });

    expect(vimeo.messages()).toEqual(
      loop === "true" ? [vimeoMessage("play")] : []
    );
  });

  it("ignores messages from another origin", () => {
    const { vimeo } = mountVimeo("true");

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://example.com",
        data: JSON.stringify({ event: "loaded" })
      })
    );

    expect(vimeo.messages()).toEqual([vimeoMessage("ping")]);
  });

  it("keeps the listener of a destroyed player alive after a slider re-init", () => {
    const { root, vimeo } = mountVimeo("true");

    window.Brz.emit("elements.slick.ready", {
      slick: query(root, ".brz-section")
    });

    vimeo.messages().length = 0;
    vimeo.send({ event: "finish" });

    // Two instances are listening on `window`: `destroy` never removes the first one's handler.
    expect(vimeo.messages()).toEqual([
      vimeoMessage("setCurrentTime", 10),
      vimeoMessage("setCurrentTime", 10)
    ]);
  });
});

describe("a custom video element", () => {
  const mountCustom = (settings: {
    type: string;
    loop: string;
    media: "video" | "none";
  }): HTMLElement =>
    mountRoot(
      bgVideoHtml({
        type: settings.type,
        loop: settings.loop,
        start: "10",
        width: 320,
        height: 180,
        media: settings.media
      })
    );

  const videoSchema = z.instanceof(HTMLVideoElement);

  it.each([
    { case: "an uploaded file", type: "bgVideoCustom" },
    { case: "an external url", type: "url" },
    { case: "no type at all", type: "undefined" }
  ])("plays $case muted from the configured second", ({ type }) => {
    const root = mountCustom({ type, loop: "true", media: "video" });

    initBackground(root);

    const video = videoSchema.parse(root.querySelector("video"));

    expect(video.getAttribute("muted")).toBe("true");
    expect(video.currentTime).toBe(10);
    expect(env.play).toHaveBeenCalledTimes(1);
  });

  it.each([
    { case: "a looping video restarts", loop: "true", plays: 2 },
    { case: "a one-shot video stays finished", loop: "false", plays: 1 }
  ])("$case", ({ loop, plays }) => {
    const root = mountCustom({ type: "url", loop, media: "video" });

    initBackground(root);

    const video = videoSchema.parse(root.querySelector("video"));

    video.dispatchEvent(new Event("ended"));

    expect(env.play).toHaveBeenCalledTimes(plays);

    const section = query(root, ".brz-section");

    window.Brz.emit("elements.section.slide.change", {
      node: section,
      slick: section
    });

    expect(env.play).toHaveBeenCalledTimes(plays === 2 ? 3 : 1);
  });

  it("does nothing when the markup has no video element", () => {
    const root = mountCustom({ type: "url", loop: "true", media: "none" });

    expect(() => initBackground(root)).not.toThrow();
    expect(env.play).not.toHaveBeenCalled();
  });
});
