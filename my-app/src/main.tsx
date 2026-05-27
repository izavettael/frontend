import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Уберите .tsx расширение
import './index.css';

import { getPresentation, addEditorChangeHandler } from './presentationFunctions.ts';

function renderApp(presentation = getPresentation()) {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App presentation={presentation} />
    </React.StrictMode>
  );
}

renderApp();

addEditorChangeHandler((presentation: any) => { 
  console.log('Модель презентации обновлена:', presentation);
  renderApp(presentation);
});

console.log('=== Тестовые данные презентации ===');
console.log(getPresentation());