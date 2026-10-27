import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ListaUsuarios } from '../frontend/src/ListaUsuarios.js';
for (const role of ['admin', 'invitado', undefined, 'desconocido']) {
  test('React: botones para rol ' + role, () => {
    const html = renderToStaticMarkup(createElement(ListaUsuarios, {
      usuarios:[{id:1,nombre:'Prueba',correo:'prueba@example.test'}],
      sesion:role ? {role} : null, eliminar:() => {},
    }));
    assert.equal(html.includes('<button'), role === 'admin');
    assert.ok(html.includes('Prueba'));
  });
}
