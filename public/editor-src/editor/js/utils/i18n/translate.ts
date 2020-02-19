type Translate = (
  dictionary: {
    [key: string]: undefined | string;
  },
  key: string
) => string;

export const translate: Translate = (dictionary, key) => dictionary[key] || key;
