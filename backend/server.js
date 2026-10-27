import { crearApp } from './app.js';
crearApp().listen(3001, '127.0.0.1', () => {
  console.log('Backend: http://127.0.0.1:3001 (solo demostración local)');
});
