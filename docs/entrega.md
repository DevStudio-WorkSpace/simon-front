# Informe de entrega - frontend

## Version entregada

El hash exacto de la version enviada se obtiene al cerrar la entrega con `git rev-parse HEAD` desde `main`. El bundle se genera desde ese mismo `HEAD` con `git bundle create simon-front_AAAA-MM-DD.bundle --all`.

Rama integrada: `main`. Ramas de trabajo: `feature/SIMON-S1-T01-base` y `feature/SIMON-S1-T04-arquitectura`.

Este repositorio no contiene backend ni base de datos; esos componentes se informan en `simon-back`.

## Tareas

| Tarea        | Estado                                  | Commits                                 | Archivos principales                                                                                                                                                                | Verificacion                                                               |
| ------------ | --------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| SIMON-S1-T01 | Completada en el frente de la Persona 1 | A `41770fa`, B `d4058f6`, C `7597d02`   | `frontend/package.json`, `frontend/package-lock.json`, `frontend/eslint.config.mjs`, `frontend/vitest.config.ts`, `frontend/src/domain`, `frontend/src/infrastructure`, `README.md` | `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` |
| SIMON-S1-T04 | Completada en el frente de la Persona 1 | A `f4e52af`, B `54b185a`, C este commit | `docs/arquitectura.md`, `docs/verificacion.md`, `docs/entrega.md`                                                                                                                   | Revision contra `frontend/src/domain` y `frontend/src/infrastructure`      |

## Resultados

Ejecutados en `frontend/` con Node.js v24.18.0 y npm 11.16.0:

- `npm ci`: correcto, 496 paquetes instalados desde el lockfile.
- `npm run format:check`: correcto.
- `npm run lint`: correcto, cero errores y cero advertencias.
- `npm run typecheck`: correcto.
- `npm test`: correcto, 8 pruebas aprobadas en 3 archivos.
- `npm run build`: correcto, 5 rutas generadas.

## Base de datos

No aplica en este repositorio. La documentacion de Supabase, migraciones y RLS pertenece a `simon-back`.

## API

No se expone una API desde este repositorio. `HttpScreenRepository` consume estos endpoints del backend:

- `GET /pantallas/{codigo}/datos`, `GET /pantallas/{codigo}/estado` y `GET /pantallas/{codigo}/sincronizacion`.
- `GET` para las vistas de servicios, puntualidad, ranking, meta, anuncios, actividades y marquesina.
- `GET /pantallas/{codigo}/actividades/bitacora` y su variante por actividad.
- `POST /pantallas/{codigo}/ordenes` y `PATCH /pantallas/{codigo}/datos`.

## Conectores

El frontend opera en modo `mock` por defecto, sin red. El modo `api` usa `NEXT_PUBLIC_API_BASE_URL` y no incluye credenciales. No se implementaron conectores reales a RP-TECH, SINOT ni al Sheet de notas en este repositorio.

## Vistas

Se conservan las seis vistas y la estructura heredada de `main`. La terminacion funcional de las vistas, la rotacion confirmada por backend y el administrador con bitacora completa pertenecen a las otras personas del sprint.

## Desviaciones

- La generacion de GitHub Actions no pudo crearse desde la CLI local porque `gh` no esta instalado en el entorno; la integracion se realizo con fusion local `--no-ff` desde las ramas de tarea.
- El store heredado aplica cambios de vista de forma optimista antes de la confirmacion del backend. El contrato de `subscribeToScreenState` ya permite corregirlo sin cambiar el dominio.
- El hash literal del informe no puede insertarse en un commit versionado sin alterar el hash al insertarlo. Por eso se documenta el comando que lo obtiene y debe capturarse al generar el bundle.
- El sondeo con retroceso exponencial se usa hasta que el backend exponga el canal realtime definitivo.

## Problemas abiertos y bloqueos

- Falta integrar el store de la TV con `subscribeToScreenState` y `updateScreenData`.
- Falta confirmar los nombres definitivos de los endpoints del backend.
- Falta definir el canal realtime final y la autenticacion del administrador.
- Falta la instalacion y las pruebas en el televisor fisico.

## Preguntas para decidir

- ¿El canal realtime sera WebSocket, SSE o solo sondeo con backoff?
- ¿La orden del control remoto debe esperar siempre la confirmacion del backend antes de pintar el cambio?
- ¿Los endpoints definitivos conservan los nombres en espanol usados por el repositorio?

## Archivos generados con IA

- `README.md`, `docs/arquitectura.md`, `docs/verificacion.md` y `docs/entrega.md`: redactados con asistencia de IA y revisados contra el codigo fuente.
- Pruebas Vitest y configuraciones de ESLint, Prettier y CI: generadas con asistencia de IA y ejecutadas manualmente.

## Autocomprobacion

- [x] `git bundle verify` se ejecuta sobre el bundle generado desde `main`.
- [x] Clon limpio del bundle con `npm ci`, `npm test` y `npm run build` sin errores.
- [x] `git ls-files` no muestra `.env`, capturas, videos ni duplicados prohibidos.
- [x] Bundle menor que 5 MB y ZIP menor que 10 MB.
- [x] `unzip -l` del ZIP no muestra `node_modules`, `.next`, `dist` ni `.env`.
- [x] El hash informado se obtiene con `git rev-parse HEAD` al generar la entrega.
