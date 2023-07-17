import { assertExists } from '@blocksuite/global/utils';
import { createRoot } from 'react-dom/client';

import { App } from './app';

const root = document.getElementById('app');
assertExists(root);

createRoot(root).render(<App />);
