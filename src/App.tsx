import { useState } from 'react';

import './App.css';
import LibraryIcon from './assets/library.svg';
import PanelIcon from './assets/panel.svg';
import { useAppSelector } from './store';
import Library from './components/Library';
import MessageLog from './components/MessageLog';
import Panel from './components/Panel';
import Ports from './components/Ports';


export default function App() {
  const library = useAppSelector(({ library: l }) => l.library);

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
          Library ({library.programs.length})
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
