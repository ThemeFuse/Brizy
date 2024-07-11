import {
  getDefaultKits,
  getDefaultLayoutData,
  getDefaultLayouts,
  getDefaultLayoutsPages,
  getKitData,
  getKitsList,
  getPopupData,
  getPopups
} from "@/api";
import {
  converterKit,
  convertLayoutPages,
  convertLayouts
} from "@/defaultTemplates/utils";
import { Config } from "../config";
import {
  BlocksArray,
  CustomTemplatePage,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  DefaultTemplateKits,
  DefaultTemplatePopup,
  KitItem,
  KitsWithThumbs,
  LayoutsDefaultTemplate,
  LayoutsPages,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  Stories,
  StoriesWithThumbs
} from "../types/DefaultTemplate";
import { t } from "../utils/i18n";
import { converterPopup, convertToCategories } from "./utils";

const defaultKits = (
  config: Config
): DefaultTemplateKits<KitsWithThumbs, DefaultBlock, Array<KitItem>> => {
  const { blocksDataUrl, blocksKitsUrl, blocksChunkUrl } = config.api.templates;
  const { templatesImageUrl } = config.api;

  return {
    async getMeta(res, rej, kit) {
      try {
        const data = await getDefaultKits(blocksChunkUrl, kit.id);

        const { types, blocks } = converterKit(
          data.blocks,
          templatesImageUrl,
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
    async getData(res, rej, { kitId, id }) {
      try {
        const data = await getKitData(blocksDataUrl, kitId, id);

        res(data);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getKits(res, rej) {
      try {
        const kits = await getKitsList(blocksKitsUrl);
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
  const { popupsChunkUrl, popupsDataUrl } = config.api.templates;
  const { templatesImageUrl } = config.api;

  return {
    async getMeta(res, rej) {
      try {
        const { blocks, categories } = await getPopups(popupsChunkUrl);
        const data = converterPopup(blocks, templatesImageUrl);

        const convertedCategories = convertToCategories(categories);

        res({ ...data, categories: convertedCategories });
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, kit) {
      try {
        const data = await getPopupData(popupsDataUrl, kit.id);

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
): LayoutsDefaultTemplate<
  LayoutsWithThumbs,
  BlocksArray<DefaultBlockWithID>,
  LayoutsPages
> => {
  const { layoutDataUrl, layoutsChunkUrl, layoutsPagesUrl } =
    config.api.templates;
  const { templatesImageUrl } = config.api;

  return {
    async getMeta(res, rej) {
      try {
        const { templates, categories } = await getDefaultLayouts(
          layoutsChunkUrl
        );

        const data: LayoutsWithThumbs = {
          templates: convertLayouts(templates, templatesImageUrl),
          categories: convertToCategories(categories)
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    },
    async getData(res, rej, { id, layoutId }) {
      try {
        const data = await getDefaultLayoutData(layoutDataUrl, layoutId, id);

        const result: BlocksArray<DefaultBlockWithID> = {
          blocks: data
        };

        res(result);
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getPages(res, rej, id) {
      try {
        const { collections, styles } = await getDefaultLayoutsPages(
          layoutsPagesUrl,
          id
        );

        const parsedData: CustomTemplatePage[] = convertLayoutPages(
          collections,
          templatesImageUrl,
          id
        );

        res({ pages: parsedData, styles: [styles] });
      } catch (e) {
        rej(t("Failed to load pages for selected Layout"));
      }
    }
  };
};

export { defaultKits, defaultStories, defaultLayouts, defaultPopups };
