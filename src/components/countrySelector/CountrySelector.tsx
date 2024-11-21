import { FC, useEffect, useRef } from 'react';
import $Container from '../layout/container/Container';
import { highlightMatch } from '../../utils/highlightMatch/highlightMatch';
import { $Input } from '../Input/Input';
import $SuggestionList from '../SuggestionList/SuggestionList';
import $SuggestionItem from '../SuggestionItem/SuggestionItem';
import { useCountrySelector } from '../../hooks/useCountrySelector';

const CountrySelector: FC = () => {
  const {
    inputValue,
    suggestions,
    activeIndex,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    handleKeyDown,
    selectCountry,
    setActiveIndex
  } = useCountrySelector();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <$Container>
      <$Input
        ref={inputRef}
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder='Select a country'
      />
      {showSuggestions && suggestions.length > 0 && (
        <$SuggestionList ref={listRef}>
          {suggestions.map((country, index) => (
            <$SuggestionItem
              key={country.code}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectCountry(country)}
            >
              {highlightMatch(country.name, inputValue)}
            </$SuggestionItem>
          ))}
        </$SuggestionList>
      )}
    </$Container>
  );
};

export default CountrySelector;
