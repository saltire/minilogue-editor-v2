import { useState } from 'react';

import './App.css';
import ConfigurationIcon from './assets/configuration.svg';
import LibraryIcon from './assets/library.svg';
import { useAppSelector } from './store';
import Library from './components/Library';
import MessageLog from './components/MessageLog';
import Modal from './components/Modal';
import Panel from './components/Panel';
import Ports from './components/Ports';
import Settings from './components/Settings';


export default function App() {
  const library = useAppSelector(({ library: l }) => l.library);

  const [popup, setPopup] = useState<string | null>(null);

  return (
    <div className='App'>
      <div className='section-nav'>
        <button type='button' onClick={() => setPopup('library')}>
          <LibraryIcon />
          Library ({library.programs.length})
        </button>

        <button type='button' onClick={() => setPopup('settings')}>
          <ConfigurationIcon />
          Settings
        </button>
      </div>

      <Panel />

      {popup && (
        <Modal onClose={() => setPopup(null)}>
          {popup === 'library' && <Library />}
          {popup === 'settings' && <Settings />}
        </Modal>
      )}

      <div className='status'>
        <Ports />
        <MessageLog />
      </div>
    </div>
  );
}
