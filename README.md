# Gestión de Usuarios - Grupo 4
Demuestra mínimo privilegio, roles (RBAC) y autorización en Express. React oculta Eliminar Usuario al invitado; el servidor también impide el DELETE manual.

## Preparación en Windows
Instala Node.js LTS compatible (22.12 o superior). En PowerShell:

```powershell
node --version
npm.cmd --version
cd "C:\Users\guiss\Documents\Seguridad_sistemas_digitales\Taller-Seguridad-RBAC-Grupo4"
npm.cmd ci --ignore-scripts
```

El proyecto usa npm workspaces: una instalación y un package-lock.json raíz fijan las dependencias de ambos paquetes.

## Ejecutar
Primera terminal, desde la raíz:
```powershell
npm.cmd run backend
```
Segunda terminal, desde la misma raíz:
```powershell
npm.cmd run frontend
```
Abre http://127.0.0.1:5173. Selecciona Invitado o Administrador. El selector usa tokens públicos de prueba; Express asocia cada uno a su rol. Ambos consultan; solo admin ve botones y elimina. Cierra sesión en el selector. Detén cada servidor con Ctrl+C. Reiniciar el Backend restaura los datos.

## Verificar
```powershell
npm.cmd test
npm.cmd run build
npm.cmd audit
curl.exe -i -X DELETE "http://127.0.0.1:3001/api/usuarios/1?role=admin" -H "Authorization: Bearer demo-invitado" -H "X-Role: admin" -H "Content-Type: application/json" --data '{"role":"admin"}'
```
La petición manipulada debe responder 403. Sin Authorization debe dar 401. Un DELETE con demo-admin devuelve 204 si existe el usuario y 404 si ya fue borrado. No se modifica información con 401 o 403. La compilación en frontend/dist valida el cliente; para la demostración usa los dos servidores indicados (Vite reenvía /api a Express).

## Material
- docs/Informe-Grupo4.pdf: informe de cinco páginas; completa diez nombres antes de entregar.
- docs/arquitectura.mmd y arquitectura.svg: mismo flujo de eliminación.
- docs/investigacion.md: conceptos y referencias bibliográficas.
- docs/resultados.md y evidencias/: resultados técnicos y capturas de la aplicación.

## Límites
No es autenticación real: cualquiera que conozca el token público admin puede seleccionarlo. Manipular campos role usando el token invitado no cambia su rol. No hay contraseñas, expiración, base de datos ni persistencia. Tokens solo en memoria del navegador. No usar en producción ni exponer a red; ambos servidores escuchan únicamente en 127.0.0.1.
