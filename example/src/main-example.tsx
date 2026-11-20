import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ExamplePage } from './ExamplePage';
import { examples } from './examples';

import './index.css';

const root = document.getElementById('root')!;
const example = examples.find((e) => e.id === root.dataset.example);

if (!example) {
  throw new Error(`Unknown example: ${root.dataset.example}`);
}

createRoot(root).render(
  <StrictMode>
    <ExamplePage example={example} />
  </StrictMode>
);
