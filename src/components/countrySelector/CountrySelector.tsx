import { FC, useEffect, useMemo, useRef, useState } from 'react';
import $Container from '../layout/container/Container';
import Fuse from 'fuse.js';
import { countries, Country } from '../../data/countries';
import { styled } from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  color: black;
  max-height: 200px;
  overflow-y: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: gray;
  z-index: 1;
`;

const SuggestionItem = styled.li<{ isActive: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#f0f0f0' : 'gray')};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const CountrySelector: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: ['name'],
        threshold: 0.3
      }),
    []
  );

  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setInputValue(savedCountry);
    }
  }, []);

  useEffect(() => {
    if (inputValue) {
      const results = fuse.search(inputValue);
      setSuggestions(results.map((result) => result.item));
    } else {
      setSuggestions([]);
    }
    setActiveIndex(-1);
  }, [inputValue, fuse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectCountry(suggestions[activeIndex]);
      }
    }
  };

  const selectCountry = (country: Country) => {
    setInputValue(country.name);
    setSuggestions([]);
    setShowSuggestions(false);
    localStorage.setItem('selectedCountry', country.name);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? <Highlight key={index}>{part}</Highlight> : part
      );
  };

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
      <Input
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
        <SuggestionList ref={listRef}>
          {suggestions.map((country, index) => (
            <SuggestionItem
              key={country.code}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectCountry(country)}
            >
              {highlightMatch(country.name, inputValue)}
            </SuggestionItem>
          ))}
        </SuggestionList>
      )}
    </$Container>
  );
};

export default CountrySelector;
