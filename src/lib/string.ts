export const removeXSSCharacters = (str: string) => (
  str.replaceAll('&', '')
    .replaceAll('<', '')
    .replaceAll('"', '')
    .replaceAll('\'', '')
);
