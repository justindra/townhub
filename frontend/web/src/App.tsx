import logo from './logo.svg';
import './App.css';

import { Sample } from '@townhub/core';
import { Transite } from '@townhub/core/transit';

function App() {
  console.log(Sample.foo());
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. {Transite}
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
