import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { crearApp } from '../backend/app.js';

async function escenario(t) {
  const server = crearApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  return (ruta, token, opciones = {}) => fetch('http://127.0.0.1:' + server.address().port + '/api' + ruta,
    { ...opciones, headers: { ...(token ? {Authorization: 'Bearer ' + token} : {}), ...opciones.headers } });
}
for (const rol of ['admin', 'invitado']) {
  test(rol + ' consulta usuarios y recibe su identidad del servidor', async t => {
    const pedir = await escenario(t);
    const sesion = await pedir('/sesion', 'demo-' + rol);
    assert.equal(sesion.status, 200); assert.equal((await sesion.json()).role, rol);
    const res = await pedir('/usuarios', 'demo-' + rol);
    assert.equal(res.status, 200); assert.equal((await res.json()).length, 3);
  });
}
test('admin elimina realmente; repetir devuelve 404', async t => {
  const pedir = await escenario(t);
  assert.equal((await pedir('/usuarios/1', 'demo-admin', { method: 'DELETE' })).status, 204);
  assert.deepEqual((await (await pedir('/usuarios', 'demo-admin')).json()).map(u => u.id), [2,3]);
  assert.equal((await pedir('/usuarios/1', 'demo-admin', { method: 'DELETE' })).status, 404);
});
for (const [nombre, token, status, sufijo, headers, body] of [
  ['invitado', 'demo-invitado', 403, '', {}, undefined],
  ['sin sesión', undefined, 401, '', {}, undefined],
  ['token inválido', 'inventado', 401, '', {}, undefined],
  ['petición manipulada', 'demo-invitado', 403, '?role=admin', {role:'admin','X-Role':'admin','Content-Type':'application/json'}, '{"role":"admin"}'],
]) {
  test(nombre + ': rechazo sin modificar datos', async t => {
    const pedir = await escenario(t);
    const antes = await (await pedir('/usuarios', 'demo-admin')).json();
    const res = await pedir('/usuarios/1' + sufijo, token, {method:'DELETE',headers,body});
    assert.equal(res.status, status);
    assert.deepEqual(await (await pedir('/usuarios', 'demo-admin')).json(), antes);
  });
}
test('consultas sin autenticación rechazadas e ID inválido no borra', async t => {
  const pedir = await escenario(t);
  for (const ruta of ['/sesion', '/usuarios']) assert.equal((await pedir(ruta)).status, 401);
  assert.equal((await pedir('/usuarios/abc', 'demo-admin', {method:'DELETE'})).status, 400);
  assert.equal((await (await pedir('/usuarios', 'demo-admin')).json()).length, 3);
});
