import { createRoot } from 'react-dom/client'
import App from './App';

// Render your React component instead
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);