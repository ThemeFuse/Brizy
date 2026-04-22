// Matches formats like "012345678901234567890:abcdefghij" or "139f44bdc32d14236"
const ENGINE_ID_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_:-]{5,}$/;

export function isValidEngineId(id: string | null | undefined): boolean {
  if (!id) {
    return false;
  }

  return ENGINE_ID_REGEX.test(id);
}

// Cleans up Google Custom Search related params from the current URL
// so that on page refresh we only see the search bar and not the
// previous search results (removes gsc.* from query and hash).
export const clearGoogleSearchParams = () => {
  const { location, history } = window;
  let urlChanged = false;

  try {
    const urlObj = new URL(location.href);

    // Remove any google search params from the query string (e.g. ?gsc.q=...)
    Array.from(urlObj.searchParams.keys()).forEach((key) => {
      if (key.startsWith("gsc.")) {
        urlObj.searchParams.delete(key);
        urlChanged = true;
      }
    });

    // Remove google search params from the hash fragment (e.g. #gsc.tab=0&gsc.q=aa)
    if (urlObj.hash) {
      const hashWithoutHash = urlObj.hash.slice(1);
      const filteredParts = hashWithoutHash
        .split("&")
        .filter((part) => part && !part.startsWith("gsc."));

      const newHash = filteredParts.length ? `#${filteredParts.join("&")}` : "";

      if (newHash !== urlObj.hash) {
        urlObj.hash = newHash;
        urlChanged = true;
      }
    }

    if (urlChanged) {
      history.replaceState(null, "", urlObj.toString());
    }
  } catch {
    const { href, hash } = location;

    if (hash && hash.includes("gsc.")) {
      const newHref = href.replace(hash, "");
      history.replaceState(null, "", newHref);
    }
  }
};
