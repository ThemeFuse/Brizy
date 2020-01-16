const fallbackCopyTextToClipboard = text => {
  let textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    /* eslint-disable no-console */
    console.error("Fallback: Oops, unable to copy", err);
    /* eslint-enabled no-console */
  }

  document.body.removeChild(textarea);
};

export const copyTextToClipboard = text => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  } else {
    navigator.clipboard.writeText(text);
  }
};
