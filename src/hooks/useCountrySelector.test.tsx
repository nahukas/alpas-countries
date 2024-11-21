import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCountrySelector } from './useCountrySelector';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the API
vi.mock('../api/countriesApi', () => ({
  fetchCountries: vi.fn().mockResolvedValue([
    { name: 'Argentina', code: 'AR' },
    { name: 'France', code: 'FR' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' }
  ])
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

vi.stubGlobal('localStorage', localStorageMock);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useCountrySelector', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should initialize with empty input', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.inputValue).toBe('');
  });

  it('should load saved country from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('France');
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.inputValue).toBe('France');
  });

  it('should update suggestions when input changes', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.suggestions.length).toBe(2);
      expect(
        result.current.suggestions.some((country) =>
          country.name.toLowerCase().includes('united')
        )
      ).toBe(true);
      expect(result.current.showSuggestions).toBe(true);
    });
  });

  it('should hide suggestions when input is cleared', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.showSuggestions).toBe(true);
    });

    act(() => {
      result.current.handleInputChange({
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.showSuggestions).toBe(false);
    });
  });

  it('should select a country and save to localStorage', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.selectCountry({ name: 'France', code: 'FR' });
    });

    expect(result.current.inputValue).toBe('France');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCountry',
      'France'
    );
    expect(result.current.showSuggestions).toBe(false);
  });

  it('should handle arrow key navigation', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.suggestions.length).toBe(2);
    });

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(1);
  });

  it('should select country on Enter key press', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.suggestions.length).toBe(2);
    });

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue).toBe('United States');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCountry',
      'United States'
    );
    expect(result.current.showSuggestions).toBe(false);
  });

  it('should close suggestions on Escape key press', async () => {
    const { result } = renderHook(() => useCountrySelector(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.showSuggestions).toBe(true);
    });

    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.showSuggestions).toBe(false);
  });
});
