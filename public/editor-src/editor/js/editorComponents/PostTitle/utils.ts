import { Choice } from "visual/component/Options/types/dev/Select/types";
import { getCollectionSourceTypes } from "visual/utils/api";

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
