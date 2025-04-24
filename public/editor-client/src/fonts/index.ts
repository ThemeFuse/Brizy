import { FontFile, UploadFont } from "@/types/Fonts";
import {
  addAdobeAccount,
  deleteFont,
  FontsData,
  getAdobeFont,
  getUploadedFonts,
  uploadFont
} from "../api";
import { AdobeFonts } from "../types/AdobeFonts";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";
import { convertDataToLocal, convertFilesToFormData } from "./utils";

export const adobeFont = (): AdobeFonts => {
  return {
    async get(res, rej) {
      try {
        const r = await getAdobeFont();
        res(convertDataToLocal(r));
      } catch (e) {
        rej(t("Failed to get AdobeFont"));
      }
    },
    async add(res, rej, extra) {
      try {
        const r = await addAdobeAccount(extra);
        res(r);
      } catch (e) {
        rej(t("Failed to add Adobe account"));
      }
    }
  };
};
export const uploadedFonts = {
  async get(res: Response<Array<FontsData>>, rej: Response<string>) {
    try {
      const r = await getUploadedFonts();
      res(r);
    } catch (e) {
      rej(`Fonts Error: ${e}`);
    }
  },
  async upload(
    res: Response<UploadFont>,
    rej: Response<string>,
    { files, name, id }: { files: FontFile; name: string; id: string }
  ) {
    try {
      const fontFormData = convertFilesToFormData(files);
      fontFormData.append("family", name);
      fontFormData.append("id", id);

      const fonts = await uploadFont(fontFormData);
      res(fonts);
    } catch {
      rej(t("Failed to upload font"));
    }
  },
  async delete(res: Response<string>, rej: Response<string>, fontId: string) {
    try {
      const success = await deleteFont(fontId);

      if (!success) {
        throw new Error(t("Failed to delete font"));
      }

      res(fontId);
    } catch {
      rej(t("Failed to delete font"));
    }
  }
};
