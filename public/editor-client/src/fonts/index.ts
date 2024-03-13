import { FontsData, getUploadedFonts } from "../api";
import { Response } from "../types/Response";

export const uploadedFonts = {
  async get(res: Response<Array<FontsData>>, rej: Response<string>) {
    try {
      const r = await getUploadedFonts();
      res(r);
    } catch (e) {
      rej(`Fonts Error: ${e}`);
    }
  }
};
