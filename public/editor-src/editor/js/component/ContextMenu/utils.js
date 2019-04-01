export function mergeItems(a, b) {
  const mergedItems = [...a];

  for (var i = 0; i < b.length; i++) {
    let foundMergeTarget = false;

    for (var j = 0; j < a.length; j++) {
      if (
        b[i].id === a[j].id &&
        b[i].type === a[j].type &&
        b[i].items &&
        a[j].items
      ) {
        foundMergeTarget = true;
        mergedItems[j] = {
          ...b[i],
          ...a[j],
          items: mergeItems(a[j].items, b[i].items)
        };
      }
    }

    if (!foundMergeTarget) {
      mergedItems.push(b[i]);
    }
  }

  return mergedItems;
}

export function concatItems(a, b) {
  return [...a, ...b];
}

export function filterItems(items, meta) {
  return items.filter((item, index) => {
    if (typeof item.disabled === "function") {
      return !item.disabled(item, {
        ...meta,
        isInSubMenu: !(meta.depth === 0 && index === 0)
      });
    }

    return !item.disabled;
  });
}
