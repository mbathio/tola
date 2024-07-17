import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import AppMenu from './components/AppMenu';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <AppMenu />
  </BrowserRouter>,
  document.getElementById('root')
);
