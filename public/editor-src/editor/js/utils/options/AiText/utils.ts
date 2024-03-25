interface OpeningAndClosingTags {
  openingTags: string;
  closingTags: string;
}

export const generateTags = (input: string): OpeningAndClosingTags => {
  const regex = /<[^>]+>/g;
  const openingTags = [];
  const closingTags = [];
  const closingTagStack = [];

  let lastIndex = 0;

  for (let match; (match = regex.exec(input)) !== null; ) {
    if (match.index > lastIndex) {
      break;
    }
    openingTags.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  for (let i = 0; i < openingTags.length; i++) {
    const tag = openingTags[i];

    if (tag.startsWith("</") && i > 0) {
      openingTags.splice(i - 1, 2);
      i -= 2;
    }
  }

  for (const openingTag of openingTags) {
    const matchResult = openingTag.match(/<\s*([^>\s]+)/);

    if (matchResult) {
      const tagName = matchResult[1];
      closingTags.push(`</${tagName}`);
      if (!tagName.endsWith("/")) {
        closingTagStack.push(tagName);
      }
    }
  }

  const reversedStack = closingTagStack.reverse().map((tag) => `</${tag}>`);

  return {
    openingTags: openingTags.join(""),
    closingTags: reversedStack.join("")
  };
};

export const purifyTextContent = (textToPurify: string): string => {
  const dummyTextElement = document.createElement("div");
  dummyTextElement.innerHTML = textToPurify;

  return dummyTextElement.innerText;
};
