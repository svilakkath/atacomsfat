export const formatText = (text: string, charLimit: number | undefined) => {
  if (!charLimit) {
    return text;
  }
  if (text.length <= charLimit) {
    return text;
  }
  return text.substring(0, charLimit) + '...';
};
