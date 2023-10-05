import {
  createSavedLayout,
  deleteSavedLayout,
  getSavedLayoutById,
  getSavedLayouts,
  updateSavedLayout,
  uploadSaveLayouts
} from "../api";
import { SavedLayoutMeta, SavedLayouts } from "../types/SavedBlocks";
import { createUpload } from "../utils/createUpload";
import { t } from "../utils/i18n";

// Limitation API for getBlocks
const TOTAL_COUNT = 200;

export const savedLayouts: SavedLayouts = {
  async get(res, rej) {
    try {
      let blocks: Array<SavedLayoutMeta> = [];

      // get savedBLocks with recursive pagination
      const get = async (page: number): Promise<void> => {
        const data = await getSavedLayouts({
          page,
          order: "ASC",
          count: TOTAL_COUNT
        });
        const normalBlocks = data.filter((item) => item.meta.type === "normal");

        blocks = [...blocks, ...normalBlocks];

        if (data.length >= TOTAL_COUNT) {
          await get(page + 1);
        }
      };

      try {
        await get(1);
      } catch (e) {
        rej(t("Something went wrong"));
      }

      res(blocks);
    } catch (e) {
      console.error("API Client savedLayout handler:", e);
      rej(t("Failed to get saved layouts"));
    }
  },
  async getByUid(res, rej, { uid }) {
    try {
      const data = await getSavedLayoutById(uid);

      res(data);
    } catch (e) {
      console.error("API Client Saved Blocks handlerByUid:", e);
      rej(t("Failed to get saved layout"));
    }
  },
  async create(res, rej, extra) {
    try {
      const data = await createSavedLayout(extra);
      res(data);
    } catch (e) {
      console.error("API Client savedLayout handlerCreate:", e);
      rej(t("Failed to create saved layout"));
    }
  },
  async update(res, rej, extra) {
    try {
      const data = await updateSavedLayout(extra);
      res(data);
    } catch (e) {
      console.error("API Client savedLayout handlerUpdate:", e);
      rej(t("Failed to update saved layout"));
    }
  },
  async delete(res, rej, extra) {
    try {
      await deleteSavedLayout(extra.uid);
      res(extra);
    } catch (e) {
      console.error("API Client savedLayout handlerDelete:", e);
      rej(t("Failed to delete saved layout"));
    }
  },
  async import(res, rej) {
    try {
      const file = await createUpload({
        accept:
          "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
      });
      const data = await uploadSaveLayouts([file]);

      res(data);
    } catch (e) {
      console.error("API Client savedLayout handlerImport:", e);
      rej(t("Failed to import saved layouts"));
    }
  }
};
