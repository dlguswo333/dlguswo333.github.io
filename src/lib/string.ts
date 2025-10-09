export const removeXSSCharacters = (str: string) => (
  str.replaceAll('&', '')
    .replaceAll('<', '')
    .replaceAll('"', '')
    .replaceAll('\'', '')
);

export const getClasses = (defaultClasses: string, optionalClasses: Record<string, unknown>) => (
  (
    defaultClasses + ' ' +
    Object.entries(optionalClasses).map(([k, v]) => v ? k : '').join(' ')
  ).trim()
);

export const getHtmlAttributes = (properties: Record<string, unknown>) => {
  return Object.entries(properties)
    .map(
      ([k, v]) => `${removeXSSCharacters(k)}="${removeXSSCharacters(typeof v === 'string' ? v : '')}"`
    )
    .join(' ');
};
