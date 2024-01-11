import { useState } from 'react';

import './App.css';
import LibraryIcon from './assets/library.svg';
import PanelIcon from './assets/panel.svg';
import Library from './components/Library';
import MessageLog from './components/MessageLog';
import Panel from './components/Panel';
import Ports from './components/Ports';


export default function App() {
  const [page, setPage] = useState('panel');

  return (
    <div className='App'>
      <div className='section-nav'>
        <button
          type='button'
          className={page === 'panel' ? 'active' : undefined}
          onClick={() => setPage('panel')}
        >
          <PanelIcon />
          Panel
        </button>
        <button
          type='button'
          className={page === 'library' ? 'active' : undefined}
          onClick={() => setPage('library')}
        >
          <LibraryIcon />
          Library
        </button>
      </div>

      {page === 'panel' && <Panel />}
      {page === 'library' && <Library />}

      <div className='status'>
        <Ports />
        <MessageLog />
      </div>
    </div>
  );
}
