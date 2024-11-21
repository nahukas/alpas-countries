import './App.css';
import CountrySelector from './components/CountrySelector/CountrySelector';
import $Title from './components/Title/Title';

function App() {
  return (
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
  );
}

export default App;
