import express from 'express';

// Tokens públicos de demostración: NO son credenciales de producción.
const identidades = new Map([
  ['demo-admin', Object.freeze({ nombre: 'Administrador de prueba', role: 'admin' })],
  ['demo-invitado', Object.freeze({ nombre: 'Invitado de prueba', role: 'invitado' })],
]);

export function autenticar(req, res, next) {
  const identidad = identidades.get(req.get('Authorization')?.replace(/^Bearer /, ''));
  if (!identidad) return res.status(401).json({ error: 'Autenticación inválida o ausente.' });
  // El rol procede de la asociación del servidor, nunca del cuerpo o la URL.
  req.usuario = identidad;
  next();
}

export function autorizar(rolPermitido) {
  return (req, res, next) => {
    // Denegación por defecto: solo pasa el rol explícitamente permitido.
    if (req.usuario?.role !== rolPermitido) {
      return res.status(403).json({ error: 'No tiene permiso para eliminar usuarios.' });
    }
    next();
  };
}

export function crearApp() {
  const app = express();
  app.disable('x-powered-by');
  let usuarios = [
    { id: 1, nombre: 'Ana Ejemplo', correo: 'ana@example.test' },
    { id: 2, nombre: 'Luis Ejemplo', correo: 'luis@example.test' },
    { id: 3, nombre: 'Sofía Ejemplo', correo: 'sofia@example.test' },
  ];
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  // Todos los endpoints API requieren identidad, incluso las consultas.
  app.use('/api', autenticar);
  app.get('/api/sesion', (req, res) => res.json(req.usuario));
  app.get('/api/usuarios', (_req, res) => res.json(usuarios));

  // Autenticación anterior + autorización antes de acceder a los datos.
  app.delete('/api/usuarios/:id', autorizar('admin'), (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ error: 'Identificador inválido.' });
    }
    const indice = usuarios.findIndex(u => u.id === Number(req.params.id));
    if (indice === -1) return res.status(404).json({ error: 'Usuario inexistente.' });
    usuarios.splice(indice, 1);
    res.status(204).end();
  });
  app.use((_req, res) => res.status(404).json({ error: 'Ruta inexistente.' }));
  return app;
}
