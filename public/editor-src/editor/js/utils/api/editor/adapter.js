export const parsePage = page => {
  const id = String(page.id);
  let data;

  if (!page.data) {
    data = {};
  } else {
    try {
      data = JSON.parse(page.data);
    } catch (e) {
      throw `Failed to parse page ${page.data}`;
    }
  }

  return { ...page, id, data };
};

export const stringifyPage = page => {
  let data = JSON.stringify(page.data);

  return { ...page, data };
};

export const parseGlobals = globals => {
  if (!globals) {
    return {};
  }

  try {
    return JSON.parse(globals);
  } catch (e) {
    throw `Failed to parse globals ${globals}`;
  }
};

export const stringifyGlobals = globals => JSON.stringify(globals);
