import './App.css';
import CountrySelector from './components/CountrySelector/CountrySelector';
import $Title from './components/Title/Title';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <$Title>Select a Country</$Title>
        <CountrySelector />
      </div>
    </QueryClientProvider>
  );
}

export default App;
