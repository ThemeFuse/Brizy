import {
  createSavedBlock,
  deleteSavedBlock,
  getSavedBlockById,
  getSavedBlocks,
  updateSavedBlock,
  uploadSaveBlocks
} from "../api";
import { SavedBlockMeta, SavedPopups } from "../types/SavedBlocks";
import { createUpload } from "../utils/createUpload";
import { t } from "../utils/i18n";

// Limitation API for getBlocks
const TOTAL_COUNT = 200;

export const savedPopups: SavedPopups = {
  async get(res, rej) {
    try {
      let blocks: Array<SavedBlockMeta> = [];

      // get savedBLocks with recursive pagination
      const get = async (page: number): Promise<void> => {
        const data = await getSavedBlocks({ page, count: TOTAL_COUNT });
        const popupBlocks = data.filter((item) => item.meta.type === "popup");

        blocks = [...blocks, ...popupBlocks];

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
      rej(t("Failed to get saved popups"));
    }
  },
  async getByUid(res, rej, { uid }) {
    try {
      const data = await getSavedBlockById(uid);

      res(data);
    } catch (e) {
      rej(t("Failed to get saved popup"));
    }
  },
  async create(res, rej, extra) {
    try {
      const data = await createSavedBlock(extra);

      res(data);
    } catch (e) {
      console.error("API Client savedPopups handlerCreate:", e);
      rej(t("Failed to create saved popup"));
    }
  },
  async update(res, rej, extra) {
    try {
      const data = await updateSavedBlock(extra);
      res(data);
    } catch (e) {
      console.error("API Client savedPopups handlerUpdate:", e);
      rej(t("Failed to update saved popup"));
    }
  },
  async delete(res, rej, extra) {
    try {
      await deleteSavedBlock(extra.uid);
      res(extra);
    } catch (e) {
      console.error("API Client savedPopups handlerDelete:", e);
      rej(t("Failed to delete saved popup"));
    }
  },
  async import(res, rej) {
    try {
      const file = await createUpload({
        accept:
          "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
      });
      const data = await uploadSaveBlocks([file]);

      res(data);
    } catch (e) {
      console.error("API Client savedPopups handlerImport:", e);
      rej(t("Failed to import saved popups"));
    }
  }
};
