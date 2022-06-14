import { createRoot } from 'react-dom/client';

import './index.scss';
import App from './App';


const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App name='TypeScript App' />);
}
