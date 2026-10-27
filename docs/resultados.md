# Resultados reales - 26 de octubre de 2026

Entorno: Windows, Node.js 22.16.0, npm 10.9.2. React y React DOM 19.3.1; Express 5.3.0; Vite 8.3.5. Versiones exactas y lockfile raíz con workspaces.

- npm install --ignore-scripts: instalación inicial correcta.
- npm ci --ignore-scripts: reinstalación reproducible correcta (85 paquetes instalados, 88 auditados según npm).
- npm test: 12/12 pruebas correctas, 0 fallos; detalle en pruebas-ejecutadas.txt.
- npm run build: compilación correcta; detalle en compilacion.txt.
- npm audit: 0 vulnerabilidades conocidas en la consulta; auditoria-npm.json. No es garantía de seguridad total.
- Revisión de package.json instalados: ningún script preinstall/install/postinstall encontrado; scripts-dependencias.json contiene []. Scripts propios: node server.js, vite, vite build y node --test; sin comandos remotos.
- Chromium headless: siete comprobaciones de integración correctas; evidencias/navegador.json e imágenes admin.png e invitado.png. Herramienta del entorno de verificación, sin dependencia añadida al proyecto.

## Cobertura
Admin e invitado consultan y reciben identidad correcta. Admin elimina realmente (204) y repetir da 404. Invitado da 403, token ausente o desconocido da 401. Petición con role=admin en query, cuerpo y encabezados da 403 para el token invitado. Todos los rechazos comparan datos antes/después. ID inválido devuelve 400. React renderiza botones solo para admin, también ante rol desconocido o sin sesión.

El navegador prueba solicitudes reales a través del proxy Vite → Express, borrado, actualización de lista y ausencia de botones. Interceptar únicamente el token en tránsito permitió comprobar que React maneja respuestas reales 401 y 403 de Express.

## Alcance y limitaciones
Resultados registrados en la fecha indicada; no se afirma una ejecución nueva de las pruebas en esta actualización documental. Tokens públicos sin caducidad, sin autenticación real ni persistencia; solo uso local. No se han evaluado producción, navegadores adicionales o ataques fuera del alcance académico.

## Informe académico
pdfinfo confirmó cinco páginas A4. Las cinco páginas se renderizaron a PNG y se revisaron visualmente: sin recortes, superposiciones ni páginas extra. La portada requiere completar los diez nombres antes de entregar. Esta limpieza documental no modifica el contenido del informe ni atribuye revisiones a integrantes.
