import React from 'react';
import ReactDOM from 'react-dom';
import {ModalProvider} from 'react-modal-hook';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
