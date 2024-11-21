import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountrySelector } from './useCountrySelector';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

vi.stubGlobal('localStorage', localStorageMock);

describe('useCountrySelector', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should initialize with empty input', async () => {
    const { result } = renderHook(() => useCountrySelector());
    await act(async () => {
      expect(result.current.inputValue).toBe('');
    });
  });

  it('should load saved country from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('Argentina');
    const { result } = renderHook(() => useCountrySelector());
    await act(async () => {
      expect(result.current.inputValue).toBe('Argentina');
    });
  });

  it('should update suggestions when input changes', async () => {
    const { result } = renderHook(() => useCountrySelector());

    await act(async () => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.suggestions.length).toBeGreaterThan(0);
    expect(
      result.current.suggestions.some((country) =>
        country.name.toLowerCase().includes('united')
      )
    ).toBe(true);
  });

  it('should select a country and save to localStorage', async () => {
    const { result } = renderHook(() => useCountrySelector());

    await act(async () => {
      result.current.selectCountry({ name: 'Germany', code: 'DE' });
    });

    expect(result.current.inputValue).toBe('Germany');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCountry',
      'Germany'
    );
  });

  it('should handle arrow key navigation', async () => {
    const { result } = renderHook(() => useCountrySelector());

    await act(async () => {
      result.current.handleInputChange({
        target: { value: 'a' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(0);

    await act(async () => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.activeIndex).toBe(-1);
  });

  it('should select country on Enter key press', async () => {
    const { result } = renderHook(() => useCountrySelector());

    await act(async () => {
      result.current.handleInputChange({
        target: { value: 'united' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue).toMatch(/united/i);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
