import { ElementModel } from "visual/component/Elements/Types";
import { MigrationRichText } from "visual/editorComponents/RichText/migrations/types";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { mPipe } from "visual/utils/fp";
import * as Obj from "visual/utils/reader/object";
import { read } from "visual/utils/reader/string";

const haveBrackets = (s: string): boolean => {
  const regex = /^{{.*}}$/;
  return regex.test(s);
};

const replaceDataPopulation = (v: ElementModel): ElementModel => {
  let text = read(v.text);

  if (!text) {
    return v;
  }

  const regex = /data-population=(["'])(\S.*?)\1/g;
  const match = [...text.matchAll(regex)];

  match.forEach((item) => {
    const [population, , populationValue] = item;

    let dc = "";

    if (haveBrackets(populationValue)) {
      dc = makePlaceholder({ content: populationValue });
    } else {
      dc = makePlaceholder({ content: `{{${populationValue}}}` });
    }

    if (text) {
      text = text.replace(population, `data-population="${dc}"`);
    }
  });

  return { ...v, text };
};

const replaceDataImagePopulation = (v: ElementModel): ElementModel => {
  let text = read(v.text);

  if (!text) {
    return v;
  }

  const regex = /data-image_population=(["'])(\S.*?)\1/g;
  const match = [...text.matchAll(regex)];

  match.forEach((item) => {
    const [population, , populationValue] = item;

    const dc = makePlaceholder({ content: populationValue });

    if (text) {
      text = text.replace(population, `data-image_population="${dc}"`);
    }
  });

  return { ...v, text };
};

const replace = mPipe(replaceDataPopulation, replaceDataImagePopulation);

export const m2: MigrationRichText = {
  version: 2,
  cb({ v }) {
    const model = Obj.read(v);
    if (!model) {
      throw new Error(`RichText text migration failed ${v}`);
    }

    const vReplaced = replace(model);

    return { ...v, ...vReplaced };
  }
};
