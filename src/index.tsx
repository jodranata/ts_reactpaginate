import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import '../node_modules/bulma/css/bulma.min.css';
import './scss/customVar.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
