
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App.tsx';
import { getEditorState, addEditorUpdateListener, setEditorState } from './editor';
import { samplePresentation } from './testData';

setEditorState(samplePresentation);

function renderApplication() {
  const rootElement = ReactDOM.createRoot(document.getElementById('root')!);
  rootElement.render(<App />); 
}

addEditorUpdateListener(renderApplication);
renderApplication();