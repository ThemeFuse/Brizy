const rgx = /\.[^.]+$/;

export const getExtension = (src: string): string | undefined => {
  const result = rgx.exec(src);

  if (result && result.length) {
    const [ext] = result; // .ext
    return ext.replace(".", "").toLowerCase();
  }

  return undefined;
};
