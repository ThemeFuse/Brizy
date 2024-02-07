import { Config } from "../config";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  DefaultTemplateKits,
  DefaultTemplatePopup,
  KitItem,
  KitsWithThumbs,
  Layouts,
  LayoutsWithThumbs,
  Popups,
  PopupsWithThumbs,
  Stories,
  StoriesWithThumbs
} from "../types/DefaultTemplate";
import { t } from "../utils/i18n";
import { converterKit, convertToCategories, fetchAllLayouts1 } from "./utils";

const defaultKits = (
  config: Config
): DefaultTemplateKits<KitsWithThumbs, DefaultBlock, Array<KitItem>> => {
  // @ts-expect-error temporary err, wait config
  const { kitsUrl } = config.api.templates;
  const apiKitUrl = "https://j6dfq8pl41.b-cdn.net/api";
  const apiLayoutsUrl1 =
    "https://phplaravel-1109775-4184176.cloudwaysapps.com/api";
  const apiImageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";

  return {
    async getMeta(res, rej, kit) {
      try {
        const data = await fetchAllLayouts1(
          `${apiLayoutsUrl1}/get-kit-collections-chunk`,
          kit.id
        );

        const { types, blocks } = converterKit(
          data.blocks,
          apiImageUrl,
          kit.id
        );

        res({
          id: kit.id,
          blocks,
          categories: convertToCategories(data.categories),
          types,
          name: kit.title,
          styles: [data.styles]
        });
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, kit) {
      try {
        const data = await fetch(
          `${apiKitUrl}/get-item?project_id=${kit.kitId}&page_slug=${kit.id}`
        )
          .then((r) => r.json())
          .then((data) => data.collection.pop())
          .then((d) => JSON.parse(d.pageData).items.pop());

        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getKits(res, rej) {
      try {
        const kits = await fetch(`${apiKitUrl}/get-kits`)
          .then((r) => r.json())
          .then((data) => data.list);

        res(kits);
      } catch (e) {
        rej(t("Failed to load Kits"));
      }
    }
  };
};

const defaultPopups = (
  config: Config
): DefaultTemplatePopup<PopupsWithThumbs, DefaultBlockWithID> => {
  const { popupsUrl } = config.api.templates;
  // const apiKitUrl = "https://b8dd-87-255-68-163.ngrok-free.app/api";
  // const apiImageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";

  return {
    async getMeta(res, rej) {
      try {
        // region This is new logic
        // const _meta = await fetch(`${apiKitUrl}/get-popups`).then((r) =>
        //   r.json()
        // );
        //
        // const data = converterPopup(_meta.collections, apiImageUrl);
        // endregion

        // region This in temporary / this is new logic with old source
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
        // endregion

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, kit) {
      try {
        // region This is new logic
        // const data = await fetch(
        //   `${apiKitUrl}/get-popup-data?project_id=${kit.id}`
        // )
        //   .then((r) => r.json())
        //   .then((arr) => arr.pop())
        //   .then((d) => JSON.parse(d.pageData).items.pop());
        // endregion

        // region This in temporary / this is new logic with old source
        const data = await fetch(`${popupsUrl}/resolves/${kit.id}.json`).then(
          (r) => r.json()
        );
        // endregion

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
