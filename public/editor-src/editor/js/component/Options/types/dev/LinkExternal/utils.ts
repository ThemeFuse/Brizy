export function formatLink(input: string): string {
  const value = input.trim();

  // Return as-is if already a tel: or mailto: link
  if (/^(tel:|mailto:)/i.test(value)) {
    return value;
  }

  const isPhone = /^\+?\d+$/.test(value);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (isPhone) {
    return `tel:${value}`;
  } else if (isEmail) {
    return `mailto:${value}`;
  }

  return value;
}
