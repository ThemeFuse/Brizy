import { Choice } from "visual/component/Options/types/dev/Select/types";
import { getCollectionItems, getCollectionTypes } from "visual/utils/api";

export type GetSourceTypeChoices = () => Promise<Choice[]>;
export type GetSourceIdChoices = (id: string) => Promise<Choice[]>;

export const getSourceTypeChoices: GetSourceTypeChoices = async () => {
  try {
    const items = await getCollectionTypes();
    const newItems = [{ id: "", title: "Auto" }, ...items];

    return newItems.map(el => ({
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

export const getSourceIdChoices: GetSourceIdChoices = async (id: string) => {
  try {
    const data = await getCollectionItems(id);
    return data.collection.map(({ id, title }) => ({
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
