import { generateNav } from './nav.js';
import { loadPage } from './pageLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  generateNav();
  loadPage(window.location.hash.slice(1) || 'home');
});

window.addEventListener('hashchange', () => {
  loadPage(window.location.hash.slice(1));
});
