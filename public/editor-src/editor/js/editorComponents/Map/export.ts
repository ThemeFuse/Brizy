const LAZY_LOAD_THRESHOLD = "200px";
const LAZY_LOAD_MARKER = "data-map-lazy-init";
const LISTENER_MARKER = "data-map-listeners";

interface MapData {
  mapWrapper: HTMLElement;
  iframe: HTMLIFrameElement;
  lazySrc: string;
}

const maps: MapData[] = [];

const getMapLabel = (src: string | null): string => {
  if (!src) return "Embedded map";

  try {
    const url = new URL(src, window.location.origin);
    const address = url.searchParams.get("q")?.trim();

    return address ? `Map showing ${address}` : "Embedded map";
  } catch {
    return "Embedded map";
  }
};

const setMapAccessibilityAttributes = (
  mapWrapper: HTMLElement,
  iframe: HTMLIFrameElement
): void => {
  const src =
    iframe.getAttribute("src") ?? iframe.getAttribute("data-lazy-src") ?? "";
  const label = getMapLabel(src);

  mapWrapper.setAttribute("role", "region");
  mapWrapper.setAttribute("aria-label", label);
  iframe.setAttribute("title", label);
  iframe.setAttribute("aria-label", label);
};

const setParentListeners = (parent: HTMLElement): void => {
  // Prevent duplicate listener attachment
  if (parent.hasAttribute(LISTENER_MARKER)) return;

  const iframe = parent.querySelector("iframe");

  if (iframe) {
    parent.addEventListener("click", () => {
      iframe.style.pointerEvents = "auto";
    });

    parent.addEventListener("mouseleave", () => {
      iframe.style.pointerEvents = "none";
    });

    parent.setAttribute(LISTENER_MARKER, "true");
  }
};

const handleMapIntersection = (entries: IntersectionObserverEntry[]): void => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const mapWrapper = entry.target as HTMLElement;
      const index = maps.findIndex((m) => m.mapWrapper === mapWrapper);

      if (index !== -1) {
        const { iframe, lazySrc } = maps[index];

        try {
          iframe.addEventListener(
            "load",
            () => {
              setParentListeners(mapWrapper);
            },
            { once: true }
          );

          iframe.setAttribute("src", lazySrc);
          iframe.setAttribute("data-lazy-loaded", "true");
          iframe.removeAttribute("data-lazy-src");

          mapObserver.unobserve(mapWrapper);
          maps.splice(index, 1);
        } catch (error) {
          console.error("Error loading lazy map:", error);
        }
      }
    }
  });
};

const mapObserver = new IntersectionObserver(handleMapIntersection, {
  rootMargin: LAZY_LOAD_THRESHOLD
});

const lazyLoadMap = (mapWrapper: HTMLElement): void => {
  // Prevent multiple initializations
  if (mapWrapper.hasAttribute(LAZY_LOAD_MARKER)) return;
  mapWrapper.setAttribute(LAZY_LOAD_MARKER, "true");

  const iframe = mapWrapper.querySelector("iframe");

  if (!iframe) {
    console.error("Map iframe not found for lazy loading");
    return;
  }

  // Store the original src
  const originalSrc = iframe.getAttribute("src");
  if (!originalSrc) {
    console.error("Map iframe has no src attribute");
    return;
  }

  setMapAccessibilityAttributes(mapWrapper, iframe);

  // Remove src to prevent immediate loading (only for off-screen maps)
  iframe.setAttribute("data-lazy-src", originalSrc);
  iframe.removeAttribute("src");

  // Store map data and observe with the shared observer
  maps.push({
    mapWrapper,
    iframe,
    lazySrc: originalSrc
  });

  mapObserver.observe(mapWrapper);
};

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  node.querySelectorAll<HTMLElement>(".brz-map").forEach((item) => {
    const mapWrapper = item.querySelector<HTMLElement>(
      ".brz-ui-ed-map-content"
    );

    if (mapWrapper) {
      const iframe = mapWrapper.querySelector<HTMLIFrameElement>("iframe");

      if (iframe) {
        setMapAccessibilityAttributes(mapWrapper, iframe);
      }

      lazyLoadMap(mapWrapper);
    }
  });
}
