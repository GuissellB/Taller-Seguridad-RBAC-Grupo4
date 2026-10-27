# Investigación
Autenticación: identificar quién realiza una petición. Autorización: determinar qué puede hacer esa identidad. Aquí un token público representa una identidad de prueba; no comprueba la identidad de una persona real.

RBAC (control de acceso basado en roles) asocia permisos a roles y roles a identidades. En Gestión de Usuarios, admin e invitado pueden consultar, pero solo admin puede eliminar. El servidor conserva la asociación y aplica el permiso en cada petición protegida.

1. Mínimo privilegio: el invitado recibe únicamente consulta; evita pérdidas por permisos innecesarios. OWASP recomienda otorgar solo el acceso necesario.
2. RBAC: el middleware compara el rol del servidor con admin. Un rol diferente se rechaza por defecto; no se autoriza usando datos role del navegador. OWASP recomienda políticas explícitas y denegación por defecto. RBAC sirve al caso pequeño; otras aplicaciones requieren atributos o relaciones adicionales.
3. Validación en servidor: autenticar protege las consultas y autorizar protege DELETE antes de modificar datos. OWASP pide validar permisos en cada petición. Ocultar botones solo organiza la interfaz: una herramienta HTTP puede omitir React.

Riesgo: un invitado envía DELETE con role=admin. Control: Express recupera el rol de su mapa de tokens y devuelve 403. Resultado: datos idénticos antes y después.

## Referencias verificadas el 26 de octubre de 2026
- OWASP Foundation. Authorization Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Foundation. Developer Guide: Enforce Access Controls. https://devguide.owasp.org/en/04-design/02-web-app-checklist/07-access-controls/
- React. Conditional Rendering. https://react.dev/learn/conditional-rendering
- Express. Using middleware. https://expressjs.com/en/guide/using-middleware/
- Vite. Getting Started. https://vite.dev/guide/
