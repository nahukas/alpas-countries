import { useQuery } from 'react-query';
import { fetchCountries } from '../api/countriesApi';
import { Country } from '../data/countries';

export const useCountries = () => {
  return useQuery<Country[], Error>('countries', fetchCountries);
};
