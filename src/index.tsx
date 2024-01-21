import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import { store } from './store';


const container = document.getElementById('root');
if (container) {
  Modal.setAppElement(container);

  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}
