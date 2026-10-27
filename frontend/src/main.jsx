import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ListaUsuarios } from './ListaUsuarios.js';
import './style.css';

function App() {
  const [token, setToken] = useState('');
  const [sesion, setSesion] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('Selecciona una identidad para comenzar.');
  const [ocupado, setOcupado] = useState(false);

  async function solicitar(ruta, tokenActual, opciones = {}) {
    const res = await fetch('/api' + ruta, { ...opciones,
      headers: { Authorization: 'Bearer ' + tokenActual } });
    if (res.status === 401) {
      setSesion(null); setToken(''); setUsuarios([]);
      throw new Error('401: selecciona una identidad válida.');
    }
    if (res.status === 403) throw new Error('403: tu rol no permite esta operación.');
    if (!res.ok) throw new Error((await res.json()).error || 'Error en la solicitud.');
    return res.status === 204 ? null : res.json();
  }

  async function seleccionar(valor) {
    setOcupado(true); setSesion(null); setUsuarios([]); setToken('');
    try {
      if (!valor) { setMensaje('Sesión cerrada.'); return; }
      // React obtiene el rol desde Express, no desde el selector.
      const identidad = await solicitar('/sesion', valor);
      const lista = await solicitar('/usuarios', valor);
      setToken(valor); setSesion(identidad); setUsuarios(lista); setMensaje('Lista consultada.');
    } catch (error) { setMensaje(error.message); }
    finally { setOcupado(false); }
  }

  async function eliminar(id) {
    setOcupado(true);
    try {
      await solicitar('/usuarios/' + id, token, { method: 'DELETE' });
      setUsuarios(await solicitar('/usuarios', token));
      setMensaje('Usuario eliminado con autorización del servidor.');
    } catch (error) { setMensaje(error.message); }
    finally { setOcupado(false); }
  }

  return <main>
    <p className="etiqueta">GRUPO 4 · CONTROL DE ACCESO</p>
    <h1>Gestión de Usuarios</h1>
    <p>Dos roles. Un permiso para consultar. Solo el administrador puede eliminar.</p>
    <section className="sesion">
      <label htmlFor="identidad">Identidad de prueba</label>
      <select id="identidad" value={token} disabled={ocupado} onChange={e => seleccionar(e.target.value)}>
        <option value="">Sin sesión</option>
        <option value="demo-invitado">Invitado de prueba</option>
        <option value="demo-admin">Administrador de prueba</option>
      </select>
      <p>{sesion ? <><strong>{sesion.nombre}</strong> · Rol: <b>{sesion.role}</b></> : 'Sin autenticación'}</p>
    </section>
    <p role="status" aria-live="polite">{ocupado ? 'Procesando…' : mensaje}</p>
    {sesion && <><h2>Usuarios ficticios <span>({usuarios.length})</span></h2>
      <ListaUsuarios usuarios={usuarios} sesion={sesion} eliminar={eliminar} ocupado={ocupado} />
      {usuarios.length === 0 && <p>No quedan usuarios. Reinicia el Backend para restaurarlos.</p>}</>}
    <footer>Demostración local: identidades públicas y datos en memoria. Sin autenticación apta para producción.</footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
