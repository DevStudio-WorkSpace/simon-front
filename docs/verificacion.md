# Verificacion de la base frontend

Esta verificacion cubre el frente de la Persona 1 sobre `main`. No declara terminadas las vistas ni el administrador.

## Entorno

- Sistema: Windows.
- Node.js: v24.18.0.
- npm: 11.16.0.
- CI: Node.js 20.x en GitHub Actions.

## Comandos ejecutados

Todos se ejecutaron dentro de `frontend/`, excepto la inspeccion de archivos versionados.

| Comando                       | Resultado                                                 |
| ----------------------------- | --------------------------------------------------------- |
| `npm ci --no-audit --no-fund` | Correcto. Instala 496 paquetes desde `package-lock.json`. |
| `npm run format:check`        | Correcto. Todos los archivos coinciden con Prettier.      |
| `npm run lint`                | Correcto. Cero errores y cero advertencias.               |
| `npm run typecheck`           | Correcto. `tsc --noEmit` sin errores.                     |
| `npm test`                    | Correcto. 3 archivos, 8 pruebas aprobadas.                |
| `npm run build`               | Correcto. Compila y genera 5 paginas estaticas/dinamicas. |

`npm ci` emite avisos informativos de paquetes deprecados y del script de instalacion de `esbuild`; ninguno cambia el estado de salida.

## Pruebas incluidas

- `src/lib/utils.test.ts`: combinacion de clases y descarte de valores falsy.
- `src/infrastructure/repositories/MockScreenRepository.test.ts`: contrato completo, ocultamiento de servicios cerrados o anulados, notificaciones y cancelacion de la suscripcion, actualizaciones del administrador.
- `src/infrastructure/repositories/HttpScreenRepository.test.ts`: filtrado de datos no visibles, envio de `PATCH` y reintento con retroceso exponencial.

## Comprobacion de archivos versionados

Antes de generar el bundle se verifica:

```bash
git ls-files
```

No deben aparecer `.env`, capturas, videos, `node_modules`, `.next`, `dist` ni el duplicado `frontend/src/icon.png`. El logo permitido permanece en `frontend/public/`.

## Tamano de entregables

Los entregables se generan desde `main` con:

```bash
git bundle create simon-front_AAAA-MM-DD.bundle --all
git archive --format=zip -o simon-front_AAAA-MM-DD.zip main
```

Limites: bundle menor que 5 MB y ZIP menor que 10 MB. Si se exceden, el bundle incluye artefactos generados que deben eliminarse.

## Revision de la arquitectura

La documentacion de `docs/arquitectura.md` se reviso contra el codigo de `frontend/src/domain` y `frontend/src/infrastructure`. Se comprobaron los puntos siguientes:

- `IScreenRepository` contiene `subscribeToScreenState` y `updateScreenData`.
- `ScreenState` y `ScreenAllData` contienen `lastDataAt`; `ScreenSyncStatus` contiene estado de conexion, ultimo error y reintentos.
- `ScreenTickerItem` contiene `startsAt` y `endsAt`; `ScreenAllData` contiene la lista `announcements`.
- `InternalActivitiesData.activityLog` contiene autor, accion, pendiente, motivo y siguiente paso.
- `ServiceItem` contiene `closed` y `cancelled`, y ambos repositorios filtran esos servicios antes de entregarlos.
- `HttpScreenRepository` usa retroceso exponencial acotado y permite cancelar la suscripcion.
- No se modifico la logica de rotacion ni las vistas aprobadas desde `main`.

La desviacion conocida sobre la confirmacion de ordenes queda registrada en el documento de arquitectura para que la Persona 2 la resuelva en su frente.
