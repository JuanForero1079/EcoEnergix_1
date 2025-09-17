# Git Workflow - EcoEnergix

## Flujo de ramas
- **main**: rama estable, solo recibe merges aprobados desde `develop`.
- **develop**: rama de integración, donde se consolidan las nuevas funcionalidades antes de pasar a producción.
- **feature/***: ramas de desarrollo de nuevas funcionalidades, creadas desde `develop` y mergeadas a `develop` mediante Pull Request.

## Convención de commits
- `feat: descripción` → para nuevas funcionalidades.
- `fix: descripción` → para corrección de errores.
- `docs: descripción` → para cambios en documentación.
- `style: descripción` → para cambios de formato/estilo sin afectar lógica.
- `refactor: descripción` → para reestructurar código sin cambiar funcionalidad.
- `test: descripción` → para añadir o modificar pruebas.
- `chore: descripción` → para tareas de mantenimiento.

Ejemplo:  
`feat: agregar formulario de registro en el frontend`

## Frecuencia de push/pull
- **push**: después de completar una tarea pequeña o avance significativo (mínimo 1 vez al día).  
- **pull**: siempre antes de empezar a trabajar, para mantener sincronizada la rama local con remoto.

## Política de pull requests
1. Todas las `feature/*` deben abrir un **Pull Request hacia `develop`**.  
2. El PR debe incluir descripción clara de los cambios y referencia a la HU (si aplica).  
3. Al menos 1 revisor debe aprobar el PR antes del merge.  
4. Solo se mergea `develop` en `main` cuando se cierra un ciclo de entregables estables.
