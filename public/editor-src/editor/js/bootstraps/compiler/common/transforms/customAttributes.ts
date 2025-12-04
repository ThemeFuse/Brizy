import {
  SupportSSREvents,
  isSSREvent
} from "visual/utils/string/parseCustomAttributes";

const rgx = /data-brz-(.+)-/;

const events: Array<SupportSSREvents> = [
  "data-brz-onclick-event",
  "data-brz-onsubmit-event"
];

export const customAttributes = ($: cheerio.Root): void => {
  const eventsToSelector = events.map((d) => `[${d}]`).join(",");
  const $nodes = $(eventsToSelector);

  $nodes.each(function (this: cheerio.Element) {
    const $node = $(this);
    const attributes = Object.entries($node.attr()).filter((attr) => {
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
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }
      }
    }
  });
};
