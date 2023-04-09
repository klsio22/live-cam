import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      onStream={(stream) => console.log(stream)}
      onError={(error) => console.error(error)}
    />
  </React.StrictMode>
);
