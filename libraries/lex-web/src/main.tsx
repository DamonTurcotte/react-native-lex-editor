import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import './reset.css';

import Editor from './editor/editor';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <Editor />
  </StrictMode>,
);
