import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole,
  stopClicksAt,
  trackClickListeners
} from "../../../../../jest-utils/exportRuntime";

// The published Video, initialised the way a page does it: the free bootstrap
// receives `init.dom` for `document.body` and loads this export (and the popup
// exports when a popup is on the page). Every test starts from a fresh runtime,
// as a fresh page would.

type Attrs = Record<string, string>;

const elementSchema = z.instanceof(HTMLElement);
const iframeSchema = z.instanceof(HTMLIFrameElement);
const windowSchema = z.custom<Window>(
  (v) => typeof v === "object" && v !== null && "postMessage" in v
);

const VIMEO_SRC = "https://player.vimeo.com/video/111";
const YOUTUBE_SRC = "https://www.youtube.com/embed/abc";
const INSERTED = (src: string): string =>
  `<iframe class="brz-iframe intrinsic-ignore" allowfullscreen="true" allow="autoplay" title="video-export" src="${src}"></iframe>`;

function attrsHtml(attrs: Attrs): string {
  return Object.entries(attrs)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
}

interface ExternalVideo {
  type: "vimeo" | "youtube";
  data: Attrs;
  cover: boolean;
  iframe: boolean;
}

function externalHtml({ type, data, cover, iframe }: ExternalVideo): string {
  const src = type === "vimeo" ? VIMEO_SRC : YOUTUBE_SRC;
  const videoData = {
    "data-src": src,
    "data-controls": "true",
    "data-branding": "false",
    "data-intro": "false",
    "data-start": "0",
    "data-end": "0",
    "data-loop": "false",
    "data-autoplay": "off",
    ...data
  };
  return `<div class="brz-video brz-${type}-video">
    <div class="video-wrapper">
      <div class="brz-video-data brz-hidden" ${attrsHtml(videoData)}></div>
      ${iframe ? `<iframe class="intrinsic-ignore brz-iframe" title="video" src="${src}"></iframe>` : ""}
      ${cover ? `<div class="brz-video__cover"><div class="brz-video__cover-icon"></div></div>` : ""}
    </div>
  </div>`;
}

const vimeo = (data: Attrs, cover: boolean, iframe: boolean): string =>
  externalHtml({ type: "vimeo", data, cover, iframe });

const customHtml = `<div class="brz-video brz-custom-video">
  <div class="video-wrapper"><video class="brz-hidden intrinsic-ignore" src="clip.mp4"></video></div>
</div>`;

const embedHtml = `<div class="brz-embed-code"><iframe src="${YOUTUBE_SRC}" title="embed"></iframe></div>
<div class="brz-embed-code"><iframe src="https://maps.example.com/embed" title="map"></iframe></div>`;

function popup2Html(content: string): string {
  return `<a class="brz-a" ${makeAttr("link-type")}="popup" href="#p2">Open</a>
  <div class="brz brz-popup2" ${makeAttr("popup")}="p2" ${makeAttr("once-id")}="once-p2">
    <div class="brz-popup2__inner"><div class="brz-container__wrap">
      <div class="brz-popup2__close"><span class="close-icon">x</span></div>
      <div class="brz-container">${content}</div>
    </div></div>
  </div>`;
}

function popup1Html(content: string): string {
  return `<a class="brz-a" ${makeAttr("link-type")}="popup" href="#p1">Open</a>
  <div class="brz-popup" ${makeAttr("popup")}="p1">
    <div class="brz-popup__inner"><div class="brz-container">${content}</div></div>
  </div>`;
}

function query(root: ParentNode, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

function iframesOf(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll(".video-wrapper iframe")).map(
    (iframe) => iframe.outerHTML
  );
}

function contentWindowOf(iframe: Element): Window {
  return windowSchema.parse(iframeSchema.parse(iframe).contentWindow);
}

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function initPage(content: string): Promise<HTMLElement> {
  const root = mountRoot(content);
  await initFree([document.body]);
  return root;
}

const pause = jest.fn();
const lightboxOpen = jest.fn();
const openLightbox = jest.fn(() => ({
  open: lightboxOpen,
  close: jest.fn(),
  goTo: jest.fn()
}));
const emitted: string[] = [];

beforeAll(() => {
  silenceConsole();
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
    this: HTMLMediaElement
  ) {
    pause(this);
  });
  Object.defineProperty(window, "BrizyLibs", {
    configurable: true,
    writable: true,
    value: { openLightbox }
  });
});

beforeEach(async () => {
  await loadFreeRuntime({ kind: "real" });
  for (const id of [
    "elements.video.iframe.ready",
    "plugin.video.iframe.ready"
  ]) {
    window.Brz.on(id, () => emitted.push(id));
  }
});

afterEach(() => {
  jest.useRealTimers();
  // A fresh page has no handlers or globals left over from the previous test.
  Reflect.deleteProperty(window, "onYouTubeIframeAPIReady");
  Reflect.deleteProperty(window, "YT");
  // A new body drops the listeners earlier exports attached to the old one.
  document.body.replaceWith(document.createElement("body"));
  document.head.innerHTML = "";
  document.documentElement.className = "";
  localStorage.clear();
  pause.mockClear();
  openLightbox.mockClear();
  lightboxOpen.mockClear();
  emitted.length = 0;
});

afterAll(() => {
  Reflect.deleteProperty(window, "BrizyLibs");
  jest.restoreAllMocks();
});

describe("Video in popups on a published page", () => {
  it("inserts a player when a SectionPopup2 opens", async () => {
    const root = await initPage(popup2Html(vimeo({}, false, true)));
    const before = iframesOf(document.body);

    query(root, "a").click();
    await tick();

    expect(before).toHaveLength(1);
    expect(iframesOf(document.body)).toEqual([...before, INSERTED(VIMEO_SRC)]);
  });

  it("leaves covered players alone when a SectionPopup2 opens", async () => {
    const root = await initPage(popup2Html(vimeo({}, true, false)));

    query(root, "a").click();
    await tick();

    expect(iframesOf(document.body)).toEqual([]);
  });

  it("does not insert a player when a SectionPopup opens", async () => {
    const root = await initPage(popup1Html(vimeo({}, false, true)));
    const before = iframesOf(root);

    query(root, "a").click();
    await tick();

    expect(iframesOf(root)).toEqual(before);
  });

  it.each([
    {
      case: "a SectionPopup2 closes",
      html: popup2Html,
      close: (): void => query(document.body, ".close-icon").click()
    },
    {
      case: "a SectionPopup closes",
      html: popup1Html,
      close: (): void => query(document.body, ".brz-popup__inner").click()
    }
  ])("stops every player when $case", async ({ html, close }) => {
    const root = await initPage(
      html(`${vimeo({}, false, true)}${customHtml}${embedHtml}`)
    );
    query(root, "a").click();
    await tick();
    const [youtubeEmbed, mapEmbed] = Array.from(
      document.querySelectorAll(".brz-embed-code iframe")
    );
    const video = document.querySelector("video");

    close();

    const [youtubeAfter, mapAfter] = Array.from(
      document.querySelectorAll(".brz-embed-code iframe")
    );
    expect(iframesOf(document.body)).toEqual([]);
    expect(youtubeAfter).not.toBe(youtubeEmbed);
    expect(youtubeAfter.outerHTML).toBe(youtubeEmbed.outerHTML);
    expect(mapAfter).toBe(mapEmbed);
    expect(pause.mock.calls).toEqual([[video]]);
  });

  it("keeps its current behaviour after a second init.dom", async () => {
    const root = mountRoot(popup2Html(vimeo({}, false, true)));
    await initFree([document.body]);
    await initFree([document.body]);
    const before = iframesOf(document.body);

    query(root, "a").click();
    await tick();

    // Both runs bind the link, so the popup opens twice, and each opening
    // reaches the listeners of both runs.
    expect(iframesOf(document.body)).toEqual([
      ...before,
      ...Array.from({ length: 4 }, () => INSERTED(VIMEO_SRC))
    ]);
  });
});

describe("Video in tabs and menus on a published page", () => {
  it.each([
    { event: "elements.tabs.changed" },
    { event: "elements.accordion.changed" },
    { event: "elements.switcher.changed" }
  ])("swaps players on $event", async ({ event }) => {
    const root = await initPage(
      `<div class="tab hidden">${vimeo({}, false, true)}</div>
       <div class="tab active">${vimeo({}, false, false)}</div>`
    );
    const hidden = query(root, ".hidden");
    const active = query(root, ".active");

    window.Brz.emit(event, root, { tabs: [hidden, active], active });
    await tick();

    expect(iframesOf(hidden)).toEqual([]);
    expect(iframesOf(active)).toEqual([INSERTED(VIMEO_SRC)]);
  });

  it.each([
    { event: "elements.mmenu.open", shown: true },
    { event: "elements.mmenu.panel.opened", shown: true },
    { event: "elements.mmenu.close", shown: false },
    { event: "elements.mmenu.panel.closed", shown: false }
  ])("reacts to $event", async ({ event, shown }) => {
    const root = await initPage(vimeo({}, false, false));
    const panel = query(root, ".brz-video");
    const hidden = mountRoot(vimeo({}, false, true));

    window.Brz.emit(event, shown ? root : hidden);
    await tick();

    expect(iframesOf(root)).toEqual(shown ? [INSERTED(VIMEO_SRC)] : []);
    expect(iframesOf(hidden)).toHaveLength(shown ? 1 : 0);
    expect(panel.isConnected).toBe(true);
  });
});

describe("Vimeo on a published page", () => {
  it("replaces the cover with a player after a click", async () => {
    const root = await initPage(vimeo({}, true, false));

    query(root, ".brz-video__cover").click();
    await tick();

    expect(iframesOf(root)).toEqual([INSERTED(VIMEO_SRC)]);
    expect(root.querySelector(".brz-video__cover")).toBeNull();
  });

  it("replaces the cover after a click on its icon that the page around it stops", async () => {
    const root = await initPage(vimeo({}, true, false));
    const seen = stopClicksAt(root, () => iframesOf(root));

    query(root, ".brz-video__cover-icon").click();
    await tick();

    expect(seen).toEqual([[]]);
    expect(iframesOf(root)).toEqual([INSERTED(VIMEO_SRC)]);
    expect(root.querySelector(".brz-video__cover")).toBeNull();
  });

  it("inserts one player in a root initialised after the page", async () => {
    await initPage(vimeo({}, true, false));
    const late = mountRoot(vimeo({}, true, false));
    await initFree([late]);

    query(late, ".brz-video__cover").click();
    await tick();

    expect(iframesOf(late)).toEqual([INSERTED(VIMEO_SRC)]);
    expect(iframesOf(document.body)).toHaveLength(1);
  });

  it("listens for the covers and the lightboxes of every video with one listener on body", async () => {
    mountRoot(
      `${vimeo({}, true, false)}${vimeo({}, true, false)}${externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })}`
    );
    const listeners = trackClickListeners();
    await initFree([document.body]);
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });

  it("inserts a populated player on init", async () => {
    const root = await initPage(
      vimeo({ "data-population": "https://vimeo.com/222" }, false, false)
    );
    await tick();

    expect(iframesOf(root)).toHaveLength(1);
    expect(query(root, ".video-wrapper iframe").getAttribute("src")).toMatch(
      /^https:\/\/player\.vimeo\.com\/video\/222\?/
    );
  });

  it("restarts a looped player from its start time", async () => {
    const root = mountRoot(
      vimeo({ "data-loop": "true", "data-start": "5" }, false, true)
    );
    const player = contentWindowOf(query(root, "iframe"));
    const messages: unknown[] = [];
    jest.spyOn(player, "postMessage").mockImplementation((message: unknown) => {
      messages.push(JSON.parse(String(message)));
    });
    await initFree([document.body]);
    jest.useFakeTimers();

    for (const data of [
      { method: "ping" },
      { event: "ready" },
      { event: "finish" }
    ]) {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://player.vimeo.com",
          data: JSON.stringify(data)
        })
      );
    }
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://example.com",
        data: JSON.stringify({ event: "finish" })
      })
    );
    const beforePlay = messages.length;
    jest.advanceTimersByTime(260);

    expect(messages).toEqual([
      { method: "ping" },
      { method: "addEventListener", value: "finish" },
      { method: "addEventListener", value: "finish" },
      { method: "setCurrentTime", value: 5 },
      { method: "play" }
    ]);
    expect(beforePlay).toBe(4);
  });
});

describe("YouTube on a published page", () => {
  const PlayerState = { PLAYING: 1 };

  function installYT(): jest.Mock {
    const Player = jest.fn();
    Object.defineProperty(window, "YT", {
      configurable: true,
      writable: true,
      value: { Player, PlayerState }
    });
    return Player;
  }

  function apiReady(): void {
    const ready = z
      .custom<() => void>((v) => typeof v === "function")
      .parse(Reflect.get(window, "onYouTubeIframeAPIReady"));
    ready();
  }

  it("loads the iframe API once", async () => {
    mountRoot(
      externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })
    );
    await initFree([document.body]);
    await initFree([document.body]);

    const scripts = document.querySelectorAll(
      "script[src='https://www.youtube.com/iframe_api']"
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute(makeAttr("consent"))).toBe("marketing");
  });

  it.each([
    {
      case: "a plain page",
      background: false,
      events: ["elements.video.iframe.ready"]
    },
    {
      case: "a page with a YouTube background",
      background: true,
      events: ["plugin.video.iframe.ready", "elements.video.iframe.ready"]
    }
  ])("announces the API on $case", async ({ background, events }) => {
    installYT();
    await initPage(
      `${externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })}${
        background ? `<div class="brz-bg-video" data-type="youtube"></div>` : ""
      }`
    );

    apiReady();

    expect(emitted).toEqual(events);
  });

  it("binds the player to a rendered iframe", async () => {
    const Player = installYT();
    const root = await initPage(
      externalHtml({ type: "youtube", data: {}, cover: false, iframe: true })
    );

    apiReady();

    expect(Player.mock.calls).toEqual([
      [query(root, "iframe"), { events: expect.any(Object) }]
    ]);
  });

  it("replaces the cover with a bound player after a click", async () => {
    const Player = installYT();
    const root = await initPage(
      externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })
    );
    apiReady();

    query(root, ".brz-video__cover").click();
    await tick();

    expect(iframesOf(root)).toEqual([INSERTED(YOUTUBE_SRC)]);
    expect(root.querySelector(".brz-video__cover")).toBeNull();
    expect(Player.mock.calls).toEqual([
      [query(root, "iframe"), { events: expect.any(Object) }]
    ]);
  });

  it("has bound the player when the click on the cover reaches the page around it", async () => {
    const Player = installYT();
    const root = await initPage(
      externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })
    );
    apiReady();
    const seen = stopClicksAt(root, () => Player.mock.calls.length);

    query(root, ".brz-video__cover-icon").click();
    await tick();

    expect(seen).toEqual([1]);
    expect(iframesOf(root)).toEqual([INSERTED(YOUTUBE_SRC)]);
  });

  it("leaves the cover alone until the API is ready", async () => {
    installYT();
    const root = await initPage(
      externalHtml({ type: "youtube", data: {}, cover: true, iframe: false })
    );

    query(root, ".brz-video__cover").click();
    await tick();
    const before = {
      iframes: iframesOf(root),
      covers: root.querySelectorAll(".brz-video__cover").length
    };
    apiReady();
    query(root, ".brz-video__cover").click();
    await tick();

    expect(before).toEqual({ iframes: [], covers: 1 });
    expect(iframesOf(root)).toEqual([INSERTED(YOUTUBE_SRC)]);
  });
});

describe("Video in stories on a published page", () => {
  it("pauses every player of a slide that changes", async () => {
    const root = await initPage(
      `${vimeo({}, false, true)}${externalHtml({ type: "youtube", data: {}, cover: false, iframe: true })}${customHtml}`
    );
    const [vimeoFrame, youtubeFrame] = Array.from(
      root.querySelectorAll("iframe")
    );
    const sent: [string, unknown][] = [];
    for (const [name, frame] of [
      ["vimeo", vimeoFrame],
      ["youtube", youtubeFrame]
    ] as const) {
      jest
        .spyOn(contentWindowOf(frame), "postMessage")
        .mockImplementation((message: unknown) => {
          sent.push([name, JSON.parse(String(message))]);
        });
    }

    window.Brz.emit("elements.story.slide.changed", root);

    expect(sent).toEqual([
      ["vimeo", { method: "pause", value: "true" }],
      ["youtube", { event: "command", func: "pauseVideo" }]
    ]);
    expect(pause.mock.calls).toEqual([[root.querySelector("video")]]);
  });
});

describe("Video lightbox on a published page", () => {
  function lightboxHtml(attrs: Attrs): string {
    return `<div class="brz-video brz-vimeo-video"><div class="video-wrapper">
      <a class="brz-video__lightbox" href="#" ${attrsHtml(attrs)}><span class="inner"></span></a>
    </div></div>`;
  }

  it.each([
    {
      case: "a YouTube video",
      attrs: {
        [makeAttr("popup-type")]: "iframe",
        [makeAttr("muted")]: "on",
        [makeAttr("loop")]: "off",
        [makeAttr("start")]: "3",
        [makeAttr("end")]: "9",
        [makeAttr("src")]: "https://www.youtube.com/watch?v=abc"
      },
      calls: [
        [
          {
            kind: "global",
            options: {
              type: "iframe",
              src: "//www.youtube.com/embed/abc?playlist=abc&autoplay=1&mute=1&loop=0&start=3&end=9",
              closeOnContentClick: true,
              mainClass: "",
              callbacks: { open: undefined, close: undefined }
            }
          }
        ]
      ]
    },
    {
      case: "a Vimeo video",
      attrs: {
        [makeAttr("loop")]: "on",
        [makeAttr("src")]: "https://vimeo.com/333"
      },
      calls: [
        [
          {
            kind: "global",
            options: {
              type: "iframe",
              src: "//player.vimeo.com/video/333?autoplay=1&muted=0&loop=1#t=0",
              closeOnContentClick: true,
              mainClass: "",
              callbacks: { open: undefined, close: undefined }
            }
          }
        ]
      ]
    },
    {
      case: "a custom video",
      attrs: {
        [makeAttr("popup-type")]: "inline",
        [makeAttr("src")]: "#brz-custom-video-lightbox-1"
      },
      calls: [
        [
          {
            kind: "global",
            options: {
              type: "inline",
              src: "#brz-custom-video-lightbox-1",
              closeOnContentClick: false,
              mainClass: "",
              callbacks: {
                open: expect.any(Function),
                close: expect.any(Function)
              }
            }
          }
        ]
      ]
    },
    {
      case: "an unknown source",
      attrs: { [makeAttr("src")]: "https://example.com/clip" },
      calls: []
    }
  ])("opens $case", async ({ attrs, calls }) => {
    const root = await initPage(lightboxHtml(attrs));
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });

    query(root, ".inner").dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(openLightbox.mock.calls).toEqual(calls);
    expect(lightboxOpen).toHaveBeenCalledTimes(calls.length);
  });

  it("has opened when the click reaches the page around it", async () => {
    const root = await initPage(
      lightboxHtml({ [makeAttr("src")]: "https://vimeo.com/333" })
    );
    const seen = stopClicksAt(
      query(root, ".video-wrapper"),
      () => lightboxOpen.mock.calls.length
    );

    query(root, ".inner").click();

    expect(seen).toEqual([1]);
  });
});
