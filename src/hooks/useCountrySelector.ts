import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { countries, Country } from '../data/countries';

export const useCountrySelector = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  return {
    inputValue,
    suggestions,
    activeIndex,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    handleKeyDown,
    selectCountry,
    setActiveIndex
  };
};
