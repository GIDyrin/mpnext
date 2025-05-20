export const truncateText = (text: string, length: number) => {
  if (text.length > length) {
    return (text.slice(0, length - 3) + "...").trim(); // Оставляем заданное количество символов и добавляем "..."
  }
  return text;
};