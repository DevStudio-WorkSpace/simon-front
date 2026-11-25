# SIMON - frontend

SIMON (Sistema Informativo y de Monitoreo) es la pantalla informativa del area de Soporte Tecnico de GO Service LATAM. Este repositorio contiene el frontend Next.js con dos superficies: la TV en `/pantalla/{codigo}` y el administrador en `/admin`.

## Alcance de esta entrega

La base correspondiente a la Persona 1 queda implementada y verificada: dependencias bloqueadas, TypeScript estricto, ESLint, Prettier, Vitest, CI, fuente local, inicializacion de shadcn/ui, contratos de dominio, repositorios y documentacion de verificacion.

Las vistas, la rotacion de la TV y el administrador se conservan desde `main`; su terminacion funcional pertenece a las otras personas del sprint. Este README no declara el MVP completo.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- No se necesita backend para ejecutar el modo `mock`.

## Instalacion desde cero

```bash
git clone <URL_DEL_REPOSITORIO> simon-front
cd simon-front/frontend
cp .env.example .env.local
npm ci
npm run dev
```

urls locales:

- TV: `http://localhost:3000/pantalla/TV-EJEMPLO-01`
- Administrador: `http://localhost:3000/admin`

No existe una credencial demo. El acceso al administrador debe provenir del backend y de las cuentas autorizadas del entorno.

## Variables de entorno

`.env.example` es una plantilla sin valores reales. `.env.local` esta ignorado por Git.

| Variable                             | Proposito                                             | Valor por defecto del ejemplo     |
| ------------------------------------ | ----------------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_DATA_SOURCE`            | Selecciona `mock` o `api`                             | `mock`                            |
| `NEXT_PUBLIC_API_BASE_URL`           | Base del backend cuando se usa `api`                  | `https://api.example.invalid/api` |
| `NEXT_PUBLIC_DEFAULT_SCREEN_CODE`    | Codigo de pantalla de prueba                          | `TV-EJEMPLO-01`                   |
| `NEXT_PUBLIC_SLIDE_DURATION_SECONDS` | Segundos por vista si la API no entrega configuracion | `10`                              |
| `NEXT_PUBLIC_AUTO_RESUME_MINUTES`    | Minutos de pausa antes de reanudar                    | `10`                              |
| `NEXT_PUBLIC_REALTIME_URL`           | Endpoint realtime cuando el backend lo expone         | `wss://realtime.example.invalid`  |

## Scripts

Todos los comandos se ejecutan dentro de `frontend/`.

| Comando                | Que hace                                    |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Levanta el servidor de desarrollo.          |
| `npm run build`        | Genera la compilacion de produccion.        |
| `npm start`            | Sirve la compilacion de produccion.         |
| `npm run lint`         | Ejecuta ESLint sobre el proyecto.           |
| `npm run lint:fix`     | Aplica correcciones automaticas de ESLint.  |
| `npm run format`       | Formatea el proyecto con Prettier.          |
| `npm run format:check` | Verifica el formato sin modificar archivos. |
| `npm run typecheck`    | Ejecuta `tsc --noEmit`.                     |
| `npm test`             | Ejecuta las pruebas una vez.                |
| `npm run test:watch`   | Ejecuta las pruebas en modo observacion.    |

La misma secuencia se ejecuta en GitHub Actions en cada pull request: `npm ci`, `format:check`, `lint`, `typecheck`, `test` y `build`.

## Estructura

```text
frontend/
  src/app/                 rutas Next.js y fuente local Montserrat
  src/application/         hooks y stores de Zustand
  src/domain/models/       contratos de dominio
  src/domain/repositories/ interfaz IScreenRepository
  src/infrastructure/      mocks, repositorios HTTP/Mock y factory
  src/lib/                 utilidades compartidas de shadcn/ui
  src/presentation/        componentes de la interfaz
  components.json          configuracion de shadcn/ui
  vitest.config.ts         configuracion de pruebas
docs/                      arquitectura, verificacion y entrega
```

## Contratos de la pantalla

`IScreenRepository` expone lectura de datos, estado y sincronizacion, envio de ordenes, suscripcion al estado y actualizacion de datos del administrador.

- `subscribeToScreenState(...)` devuelve una funcion de cancelacion. La implementacion HTTP sondea el estado y reintenta con retroceso exponencial; la implementacion Mock notifica cambios locales y entre pestanas.
- `updateScreenData(...)` aplica cambios del administrador sin recargar la TV.
- `ScreenState.lastDataAt` y `ScreenAllData.lastDataAt` indican la hora del ultimo dato.
- `ScreenSyncStatus` expone `connection`, `lastErrorAt` y `retryCount`.
- La marquesina incluye `startsAt`, `endsAt`, `origin` y `active`.
- `ScreenAllData.announcements` es la lista de anuncios; `announcement` mantiene el protagonista para la vista 5.
- `InternalActivitiesData.activityLog` contiene la bitácora con autor, accion, pendiente, motivo y siguiente paso.
- `ServiceItem.closed` y `ServiceItem.cancelled` permiten ocultar servicios cerrados o anulados antes de pintar la vista 1.

## Reglas visibles

- No se muestran nombres de tardanzas, ultimo lugar del ranking ni montos en soles.
- Ningun estado se indica solo con color.
- Sin datos o sin conexion, la interfaz debe mostrar un mensaje claro y la hora del ultimo dato.
- No se versionan `.env`, capturas, videos ni datos reales. Solo se conservan el logo y los iconos de la interfaz.

## Fuente tipografica y shadcn/ui

Montserrat variable esta incluida en `src/app/fonts/` con su licencia OFL. `next/font/local` la carga desde el proyecto, por lo que el build no descarga fuentes.

`components.json` y `src/lib/utils.ts` dejan inicializado shadcn/ui. El helper `cn` combina `clsx` y `tailwind-merge`.

## Verificacion y entrega

Los resultados de las comprobaciones locales estan en `docs/verificacion.md`. La arquitectura y los flujos estan en `docs/arquitectura.md`.

Los entregables se generan desde `main`, nunca comprimiendo la carpeta a mano:

```bash
git bundle create simon-front_AAAA-MM-DD.bundle --all
git archive --format=zip -o simon-front_AAAA-MM-DD.zip main
git bundle verify simon-front_AAAA-MM-DD.bundle
```
