import { createElement as h } from 'react';

export function ListaUsuarios({ usuarios, sesion, eliminar, ocupado = false }) {
  return h('ul', { className: 'usuarios' }, usuarios.map(usuario =>
    h('li', { key: usuario.id },
      h('div', null, h('strong', null, usuario.nombre), h('small', null, usuario.correo)),
      // Ocultar mejora la interfaz; Express vuelve a comprobar el permiso.
      sesion?.role === 'admin' && h('button', {
        onClick: () => eliminar(usuario.id), disabled: ocupado,
        'aria-label': 'Eliminar Usuario: ' + usuario.nombre,
      }, 'Eliminar Usuario')
    )
  ));
}
