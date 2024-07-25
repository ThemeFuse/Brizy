import {
  getDefaultKits,
  getDefaultLayoutData,
  getDefaultLayouts,
  getDefaultLayoutsPages,
  getDefaultStories,
  getDefaultStory,
  getDefaultStoryPages,
  getKitData,
  getKitsList,
  getPopupData,
  getPopups
} from "@/api";
import {
  converterKit,
  converterPopup,
  convertLayoutPages,
  convertLayouts,
  convertStories,
  convertStoriesPages,
  convertToCategories
} from "@/defaultTemplates/utils";
import { Config } from "../config";
import {
  BlocksArray,
  CustomTemplatePage,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplateKits,
  DefaultTemplatePopup,
  KitItem,
  KitsWithThumbs,
  LayoutsDefaultTemplate,
  LayoutsPages,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  StoriesWithThumbs
} from "../types/DefaultTemplate";
import { t } from "../utils/i18n";

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
): LayoutsDefaultTemplate<
  StoriesWithThumbs,
  BlocksArray<DefaultBlock>,
  LayoutsPages
> => {
  const { storiesChunkUrl, storiesDataUrl, storiesPagesUrl } =
    config.api.templates;
  const { templatesImageUrl } = config.api;

  return {
    async getMeta(res, rej) {
      try {
        const { templates, categories } = await getDefaultStories(
          storiesChunkUrl
        );

        const data = {
          stories: convertStories(templates, templatesImageUrl),
          categories: convertToCategories(categories)
        };

        res(data);
      } catch (e) {
        rej(t("Failed to load Stories"));
      }
    },
    async getData(res, rej, { layoutId, id }) {
      try {
        const { blocks } = await getDefaultStory(storiesDataUrl, layoutId, id);

        res({ blocks });
      } catch (e) {
        rej(t("Failed to load resolves for selected DefaultTemplate"));
      }
    },
    async getPages(res, rej, id) {
      try {
        const { collections, styles } = await getDefaultStoryPages(
          storiesPagesUrl,
          id
        );

        const parsedData: CustomTemplatePage[] = convertStoriesPages(
          collections,
          templatesImageUrl,
          id
        );

        res({
          pages: parsedData,
          styles: [styles]
        });
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
