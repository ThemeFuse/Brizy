import {
  getCollectionSourceItems,
  getCollectionSourceTypes
} from "visual/utils/api/index.wp";
import { GetSourceIdChoices, GetSourceTypeChoices } from "./utils";

export const getSourceTypeChoices: GetSourceTypeChoices = async () => {
  try {
    const items = await getCollectionSourceTypes();
    const newItems = [{ name: "", label: "Auto" }, ...items];

    return newItems.map(el => ({
      value: el.name,
      title: el.label
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
    const data = await getCollectionSourceItems(id);

    return data.posts.map(({ ID, title }) => ({ value: ID, title }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    return [];
  }
};
