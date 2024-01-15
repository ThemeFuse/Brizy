import { Config } from "../config";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  KitsWithThumbs,
  Layouts,
  LayoutsWithThumbs,
  Popups,
  PopupsWithThumbs,
  Stories,
  StoriesWithThumbs
} from "../types/DefaultTemplate";
import { t } from "../utils/i18n";
import {fetchAllElements, converterKit, getStyles} from "./utils"

export type Kit = {
  categories: string;
  pro: string;
  theme: string;
  slug: string;
  thumbs: string;
  keywords: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
};

export type KitType = {
  title: string;
  id: string;
  name: string;
  icon: string;
};

const defaultKits = (): DefaultTemplate<Array<KitsWithThumbs>, DefaultBlock> => {
  const apiKitUrl = "https://af9b-87-255-68-163.ngrok-free.app/api";
  const apiImageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";

  return {
    async getMeta(res, rej) {
      try {
        const allElements = await fetchAllElements<Kit>(
            `${apiKitUrl}/get-collection`,
            100
        );

        const { types, blocks, categories } = converterKit(
            allElements,
            apiImageUrl
        );

        const customKit: KitsWithThumbs = {
          id: "kit-1",
          blocks: blocks,
          categories: categories,
          types: types,
          name: "Kit #69",
          styles: getStyles(),
        };

        res([customKit]);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, id) {
      try {
        const data = await fetch(
            `${apiKitUrl}/get-item?slug=${id.replace("custom-kit-", "")}`
        )
            .then((r) => r.json())
            .then((data) => data.pop())
            .then((d) => JSON.parse(d.pageData).items.pop());

        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    }
  };
};

const defaultPopups = (
  config: Config
): DefaultTemplate<PopupsWithThumbs, DefaultBlockWithID> => {
  const { popupsUrl } = config.api.templates;

  return {
    async getMeta(res, rej) {
      try {
        const meta: Popups = await fetch(`${popupsUrl}/meta.json`).then((r) =>
          r.json()
        );

        const data = {
          ...meta,
          blocks: meta.blocks.map((item) => {
            return {
              ...item,
              thumbnailSrc: `${popupsUrl}/thumbs/${item.id}.jpg`
            };
          })
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, id) {
      try {
        const data = await fetch(`${popupsUrl}/resolves/${id}.json`).then((r) =>
          r.json()
        );
        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    }
  };
};

const defaultStories = (
  config: Config
): DefaultTemplate<StoriesWithThumbs, BlocksArray<DefaultBlock>> => {
  const { storiesUrl } = config.api.templates;

  return {
    async getMeta(res, rej) {
      try {
        const meta: Stories = await fetch(`${storiesUrl}/meta.json`).then((r) =>
          r.json()
        );

        const data = {
          ...meta,
          stories: meta.stories.map((story) => {
            return {
              ...story,
              thumbnailSrc: `${storiesUrl}/thumbs/${story.pages[0].id}.jpg`,
              pages: story.pages.map((page) => {
                return {
                  ...page,
                  thumbnailSrc: `${storiesUrl}/thumbs/${page.id}.jpg`
                };
              })
            };
          })
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, id) {
      try {
        const data = await fetch(`${storiesUrl}/resolves/${id}.json`).then(
          (r) => r.json()
        );
        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    }
  };
};

const defaultLayouts = (
  config: Config
): DefaultTemplate<LayoutsWithThumbs, BlocksArray<DefaultBlockWithID>> => {
  const { layoutsUrl } = config.api.templates;

  return {
    async getMeta(res, rej) {
      try {
        const meta: Layouts = await fetch(`${layoutsUrl}/meta.json`).then((r) =>
          r.json()
        );

        const data = {
          ...meta,
          templates: meta.templates.map((item) => {
            return {
              ...item,
              thumbnailSrc: `${layoutsUrl}/thumbs/${item.pages[0].id}.jpg`,
              pages: item.pages.map((page) => {
                return {
                  ...page,
                  thumbnailSrc: `${layoutsUrl}/thumbs/${page.id}.jpg`
                };
              })
            };
          })
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, id) {
      try {
        const data = await fetch(`${layoutsUrl}/resolves/${id}.json`).then(
          (r) => r.json()
        );

        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    }
  };
};

export { defaultKits, defaultStories, defaultLayouts, defaultPopups };
