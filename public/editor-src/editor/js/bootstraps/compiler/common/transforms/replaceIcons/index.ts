interface Data {
  root: cheerio.Root;
  buildPath?: string;
}

export const replaceIcons = async (data: Data): Promise<void> => {
  const { root, buildPath } = data;

  switch (COMPILER_TYPE) {
    case "worker": {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { replace } = require("./worker");
      await replace(root);
      break;
    }
    case "node": {
      if (buildPath) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { replace } = require("./node");
        await replace(root, buildPath);
      }
      break;
    }
  }
};
