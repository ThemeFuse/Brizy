import { createSymbol, deleteSymbol, getSymbols, updateSymbol } from "@/api";
import { Symbols } from "@/types/Symbols";
import { t } from "@/utils/i18n";
import { Str } from "@brizy/readers";

export const symbols: Symbols = {
  get: async (res, rej) => {
    try {
      const symbols = await getSymbols();
      res(symbols);
    } catch (e) {
      const msg = Str.read(e) ?? t("Can't receive symbols");
      rej(msg);
    }
  },
  add: async (res, rej, data) => {
    try {
      const response = await createSymbol(data);
      res(response);
    } catch (e) {
      const msg = Str.read(e) ?? t("Can't create symbols");
      rej(msg);
    }
  },
  update: async (res, rej, data) => {
    try {
      const response = await updateSymbol(data);
      res(response);
    } catch (e) {
      const msg = Str.read(e) ?? t("Can't update symbols");
      rej(msg);
    }
  },
  delete: async (res, rej, data) => {
    try {
      const response = await deleteSymbol(data);
      res(response);
    } catch (e) {
      const msg = Str.read(e) ?? t("Can't delete symbols");
      rej(msg);
    }
  }
};
