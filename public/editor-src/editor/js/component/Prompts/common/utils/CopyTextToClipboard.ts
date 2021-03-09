export const copyTextToClipboard = (text: string): void => {
  const textarea = document.createElement("textarea");
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
