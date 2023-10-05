import { Choice } from "visual/component/Options/types/dev/Select/types";
import {
  getCollectionSourceItemsById,
  getCollectionSourceTypes
} from "visual/utils/api";

export type GetSourceTypeChoices = () => Promise<Choice[]>;
export type GetSourceIdChoices = (id: string) => Promise<Choice[]>;

export const getSourceTypeChoices: GetSourceTypeChoices = async () => {
  try {
    const items = await getCollectionSourceTypes();
    const newItems = [{ id: "", slug: "", title: "Auto" }, ...items];
    return newItems.map((el) => ({
      value: el.id,
      title: el.title
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    return [];
  }
};

export const getShopifySourceTypeChoices: GetSourceTypeChoices = async () => {
  try {
    const items = await getCollectionSourceTypes();
    const newItems = [{ id: "", slug: "", title: "Auto" }, ...items];
    return newItems.map((el) => ({
      value: el.slug ?? "",
      title: el.title
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    return [];
  }
};

export const getSourceIdChoices: GetSourceIdChoices = async (id: string) => {
  try {
    const data = await getCollectionSourceItemsById(id);
    return data.map(({ id, title }) => ({
      value: id,
      title: title
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    return [];
  }
};
