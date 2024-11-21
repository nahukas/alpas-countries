import $Highlight from '../../components/Highlight/Highlight';

export const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text
    .split(regex)
    .map((part, index) =>
      regex.test(part) ? <$Highlight key={index}>{part}</$Highlight> : part
    );
};
