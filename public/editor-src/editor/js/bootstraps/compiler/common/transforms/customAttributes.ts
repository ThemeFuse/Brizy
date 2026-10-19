import type { CheerioAPI } from "cheerio";
import {
  isSSREvent,
  type SupportSSREvents
} from "visual/utils/string/parseCustomAttributes";

const rgx = /data-brz-(.+)-/;

const events: Array<SupportSSREvents> = [
  "data-brz-onclick-event",
  "data-brz-onsubmit-event"
];

export const customAttributes = ($: CheerioAPI): void => {
  const eventsToSelector = events.map((d) => `[${d}]`).join(",");
  const $nodes = $(eventsToSelector);

  $nodes.each((_, el) => {
    const $node = $(el);
    const attributes = Object.entries($node.attr() ?? {}).filter((attr) => {
      const [name] = attr;
      return isSSREvent(name);
    });

    for (let i = 0; i < attributes.length; i++) {
      const [name, value] = attributes[i];
      const arr = rgx.exec(name);

      if (arr) {
        try {
          const [_, eventName] = arr;
          $node.attr(eventName, value);
          $node.removeAttr(name);
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            // biome-ignore lint/suspicious/noConsole: migrated from eslint
            console.log(e);
          }
        }
      }
    }
  });
};
