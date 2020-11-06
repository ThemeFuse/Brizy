import Config from "visual/global/Config";
import {
  getExternalStories,
  createExternalStory,
  getPages,
  getExternalPopups,
  getInternalPopup,
  createExternalPopup,
  createPage
} from "visual/utils/api/editor";
import { PageError } from "visual/utils/errors";
import {
  IS_PAGE,
  IS_EXTERNAL_POPUP,
  IS_INTERNAL_STORY,
  IS_EXTERNAL_STORY
} from "visual/utils/models";

export const getCurrentPage = async () => {
  const mode = Config.get("mode");
  const configPageId = Config.get(mode)?.id;

  if (IS_INTERNAL_STORY || IS_PAGE || TARGET === "WP") {
    const pages = await getPages();

    // create the index page when api returns no pages
    // this should never happen in WP,
    // the TARGET check is put here just in case
    if (pages.length === 0 && TARGET !== "WP") {
      const indexPageData = {
        project: Config.get("project").id,
        data: null,
        dataVersion: 1,
        is_index: true,
        status: "draft"
      };
      const meta = { is_autosave: 0 };
      let indexPage;

      try {
        indexPage = await createPage(indexPageData, meta);
        pages.push(indexPage);
      } catch (e) {
        throw new PageError(`Could not create index page ${e}`);
      }
    }

    return configPageId
      ? pages.find(page => page.id === Number(configPageId))
      : pages.find(page => page.is_index);
  }

  if (IS_EXTERNAL_POPUP) {
    const popups = await getExternalPopups();
    if (!popups.length) {
      const popupData = {
        project: Config.get("project").id,
        data: null,
        dataVersion: 1,
        status: "draft"
      };

      const meta = { is_autosave: 0 };

      try {
        const page = await createExternalPopup(popupData, meta);

        return page;
      } catch (e) {
        throw new PageError(`Could not create external popup ${e}`);
      }
    }

    return popups[0];
  }

  if (IS_EXTERNAL_STORY) {
    const stories = await getExternalStories();

    if (!stories.length) {
      const storyData = {
        project: Config.get("project").id,
        data: null,
        dataVersion: 1,
        status: "draft"
      };

      const meta = { is_autosave: 0 };

      try {
        const page = await createExternalStory(storyData, meta);

        return page;
      } catch (e) {
        throw new PageError(`Could not create external popup ${e}`);
      }
    }

    return stories[0];
  }

  return getInternalPopup(configPageId);
};
