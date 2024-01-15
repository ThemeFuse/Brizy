import { Json } from "@brizy/readers";
import { Config } from "../config";
import {
  BlocksArray,
  CustomTemplatePage,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplateKits,
  DefaultTemplatePopup,
  KitItem,
  Kits,
  KitsWithThumbs,
  LayoutsDefaultTemplate,
  LayoutsPageAPI,
  LayoutsPages,
  LayoutsWithThumbs,
  Popups,
  PopupsWithThumbs,
  StoriesWithThumbs,
  StoryPages
} from "../types/DefaultTemplate";
import { t } from "../utils/i18n";
import { tempConverterKit } from "./tempConverters";
import {
  convertLayouts,
  convertStories,
  convertToCategories,
  fetchAllLayouts1,
  fetchAllStories1
} from "./utils";

const defaultKits = (
  config: Config
): DefaultTemplateKits<KitsWithThumbs, DefaultBlock, Array<KitItem>> => {
  const { kitsUrl } = config.api.templates;
  // const apiKitUrl = "https://b8dd-87-255-68-163.ngrok-free.app/api";
  // const apiImageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";

  return {
    async getMeta(res, rej, kit) {
      try {
        // region This is new logic
        // const allElements = await fetchAllElements<Kit>(
        //   `${apiKitUrl}/get-kit-collections`,
        //   kit.id,
        //   100
        // );
        //
        // const { types, blocks, categories } = converterKit(
        //   allElements,
        //   apiImageUrl,
        //   kit.id
        // );
        //
        // const customKit: KitsWithThumbs = {
        //   id: kit.id,
        //   blocks,
        //   categories,
        //   types,
        //   name: kit.title,
        //   styles: getStyles()
        // };
        // endregion

        // region This in temporary / this is new logic with old source
        const allElements = await fetch(`${kitsUrl}/meta.json`).then((r) =>
          r.json()
        );

        const tempAllElements = allElements.find(
          (item: Kits) => item.id === kit.id
        );

        const { types, blocks, categories } = tempConverterKit(
          tempAllElements,
          `${kitsUrl}/thumbs`,
          kit.id
        );

        const customKit: KitsWithThumbs = {
          id: kit.id,
          blocks,
          categories,
          types,
          name: kit.title,
          styles: tempAllElements.styles
        };
        // endregion

        res(customKit);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, kit) {
      try {
        // region This is new logic
        // const data = await fetch(
        //   `${apiKitUrl}/get-item?project_id=${kit.kitId}&page_slug=${kit.id}`
        // )
        //   .then((r) => r.json())
        //   .then((data) => data.pop())
        //   .then((d) => JSON.parse(d.pageData).items.pop());
        // endregion

        // region This in temporary / this is new logic with old source
        const data = await fetch(`${kitsUrl}/resolves/${kit.id}.json`).then(
          (r) => r.json()
        );
        // endregion

        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getKits(res, rej) {
      try {
        // region This is new logic
        // const kits = await fetch(`${apiKitUrl}/get-kits`)
        //   .then((r) => r.json())
        //   .then((data) => data.list);
        // endregion

        // region This in temporary / this is new logic with old source
        const kits = await fetch(`${kitsUrl}/meta.json`)
          .then((r) => r.json())
          .then((data) =>
            data.map((kit: { id: string; name: string }) => ({
              id: kit.id,
              title: kit.name
            }))
          );
        // endregion

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
): LayoutsDefaultTemplate<
  StoriesWithThumbs,
  BlocksArray<DefaultBlock>,
  LayoutsPages
> => {
  // @ts-expect-error: temporary solution, wait until new API will come via config
  const { storiesUrl } = config.api.templates;
  const apiLayoutsUrl =
    "https://phplaravel-1109775-4184176.cloudwaysapps.com/api";
  const imageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";

  return {
    async getMeta(res, rej) {
      try {
        const meta = await fetchAllStories1(`${apiLayoutsUrl}/get-story-chunk`);

        console.log("gegg");
        const data = {
          stories: convertStories(meta.templates, `${imageUrl}`),
          categories: convertToCategories(meta.categories)
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, kit) {
      try {
        const data = await fetch(
          `${apiLayoutsUrl}/get-story-page-data?project_id=${kit.layoutId}&page_slug=${kit.id}`
        ).then((r) => r.json());

        const pageData = Json.read(data.collection) as {
          blocks: DefaultBlock[];
        };

        res({ blocks: pageData.blocks });
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getPages(res, rej, id) {
      try {
        const data = await fetch(
          `${apiLayoutsUrl}/get-story-page?project_id=${id}}&per_page=20`
        ).then((r) => r.json());
        const parsedData: CustomTemplatePage[] = data.collections.map(
          ({
            slug,
            thumbnailHeight,
            thumbnailWidth,
            thumbnail
          }: StoryPages) => ({
            id: slug,
            title: slug,
            thumbnailWidth,
            thumbnailHeight,
            thumbnailSrc: `${imageUrl}${thumbnail}`,
            layoutId: id
          })
        );

        res({ pages: parsedData, styles: [data.styles] });
      } catch (e) {
        rej(t("Failed to load pages for selected Stories"));
      }
    }
  };
};

const defaultLayouts = (
  config: Config
): LayoutsDefaultTemplate<
  LayoutsWithThumbs,
  BlocksArray<DefaultBlockWithID>,
  LayoutsPages
> => {
  // @ts-expect-error: temporary solution, wait until new API will come via config
  const { layoutsUrl } = config.api.templates;
  const imageUrl = "https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/";
  const apiLayoutsUrl1 =
    "https://phplaravel-1109775-4184176.cloudwaysapps.com/api";
  const apiLayoutsUrl = "https://j6dfq8pl41.b-cdn.net/api";

  return {
    async getMeta(res, rej) {
      try {
        const meta = await fetchAllLayouts1(
          `${apiLayoutsUrl1}/get-layouts-chunk`
        );

        const data: LayoutsWithThumbs = {
          templates: convertLayouts(meta.templates, `${imageUrl}`),
          categories: convertToCategories(meta.categories)
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, { id, layoutId }) {
      try {
        const data = await fetch(
          `${apiLayoutsUrl}/get-layouts-page?project_id=${layoutId}&page_slug=${id}`
        ).then((r) => r.json());

        const pageData = Json.read(data[0].pageData) as {
          items: DefaultBlockWithID[];
        };

        const result: BlocksArray<DefaultBlockWithID> = {
          blocks: [...pageData.items]
        };

        res(result);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getPages(res, rej, id) {
      try {
        const data = await fetch(
          `${apiLayoutsUrl}/get-layouts-pages?project_id=${id}&per_page=20`
        ).then((r) => r.json());

        const parsedData: CustomTemplatePage[] = data.collections.map(
          ({
            slug,
            title,
            thumbnailHeight,
            thumbnailWidth,
            thumbs
          }: LayoutsPageAPI) => ({
            id: slug,
            title,
            thumbnailWidth,
            thumbnailHeight,
            thumbnailSrc: `${imageUrl}${thumbs}`,
            layoutId: id
          })
        );

        res({ pages: parsedData, styles: [data.styles] });
      } catch (e) {
        rej(t("Failed to load pages for selected Layout"));
      }
    }
  };
};

export { defaultKits, defaultStories, defaultLayouts, defaultPopups };
