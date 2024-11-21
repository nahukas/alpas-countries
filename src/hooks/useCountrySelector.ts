import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { useCountries } from './useCountries';
import { Country } from '../data/countries';
import { debounce } from 'lodash';

export const useCountrySelector = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: countries, isLoading, error } = useCountries();

  const fuse = useMemo(() => {
    if (!countries) return null;
    return new Fuse(countries, {
      keys: ['name'],
      threshold: 0.3
    });
  }, [countries]);

  const updateSuggestions = useCallback(
    (value: string) => {
      if (value && fuse) {
        const results = fuse.search(value);
        setSuggestions(results.map((result) => result.item));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setActiveIndex(-1);
    },
    [fuse]
  );

  const debouncedUpdateSuggestions = useMemo(
    () => debounce(updateSuggestions, 300),
    [updateSuggestions]
  );

  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setInputValue(savedCountry);
      updateSuggestions(savedCountry);
    }
  }, [updateSuggestions]);

  useEffect(() => {
    debouncedUpdateSuggestions(inputValue);
    return () => {
      debouncedUpdateSuggestions.cancel();
    };
  }, [inputValue, debouncedUpdateSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectCountry(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
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
    setActiveIndex,
    isLoading,
    error
  };
};
