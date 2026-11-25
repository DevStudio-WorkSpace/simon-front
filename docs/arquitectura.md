# Arquitectura del frontend SIMON

## Alcance

Este documento describe la arquitectura dejada por la Persona 1 sobre `main` y los contratos que las demas personas deben usar. No describe vistas terminadas ni funcionalidad de backend fuera de este repositorio.

## Componentes

| Capa            | Ubicacion                     | Responsabilidad                                                                                |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Rutas           | `frontend/src/app`            | Exponer `/pantalla/[codigo]`, `/`, `/admin`, metadatos, tema inicial y fuente local.           |
| Aplicacion      | `frontend/src/application`    | Hooks de fecha y teclado, stores de Zustand para reproductor, tema y sesion.                   |
| Dominio         | `frontend/src/domain`         | Modelos TypeScript puros e interface `IScreenRepository`. No depende de React ni de Next.      |
| Infraestructura | `frontend/src/infrastructure` | Mocks, repositorio HTTP, repositorio Mock y factory que elige segun `NEXT_PUBLIC_DATA_SOURCE`. |
| Presentacion    | `frontend/src/presentation`   | Componentes de cabecera, marquesina, controles y seis vistas.                                  |
| Transversal     | `frontend/`                   | ESLint, Prettier, Vitest, TypeScript estricto, shadcn/ui, CI y fuente local.                   |

La dependencia apunta hacia el dominio: la interfaz `IScreenRepository` define los contratos y las implementaciones concretas los cumplen. `ScreenRepositoryFactory` es el unico punto que decide cual implementacion se usa.

## Flujo de una orden del control remoto

1. El teclado o el control remoto emite una tecla: flechas, Av Pag, Re Pag, espacio, OK, B o punto.
2. `useRemoteControlKeyboard` traduce la tecla a una accion del store: `anterior`, `siguiente`, `pausa`, `play` o `ir_a`.
3. El store llama a `sendOrder(codigo, accion, vista)` en el repositorio.
4. La implementacion HTTP envia `POST /pantallas/{codigo}/ordenes` con `{ accion, vista }`. El backend persiste el estado y la orden.
5. La suscripcion `subscribeToScreenState(...)` recibe el nuevo `ScreenState`.
6. El store actualiza la vista y la cabecera con el estado confirmado.

El contrato exige que la TV no cambie de vista solo por la pulsacion: el cambio llega cuando el backend confirma el nuevo estado. El store actual heredado de `main` aplica el cambio de forma optimista antes de recibir la confirmacion; ese punto queda pendiente de la Persona 2 y se registra como desviacion conocida.

## Flujo de sincronizacion de datos

- Modo HTTP: `subscribeToScreenState` consulta `GET /pantallas/{codigo}/estado`. Tras un éxito espera `pollIntervalMs`. Tras un fallo incrementa `retryCount`, informa al callback de error y aplica retroceso exponencial hasta `maxRetryDelayMs` o `maxRetries`.
- Modo Mock: `subscribeToScreenState` entrega el estado actual una vez y notifica cambios producidos por `sendOrder` y `updateScreenData`. `localStorage` replica el estado entre pestanas.
- `ScreenState.lastDataAt` y `ScreenAllData.lastDataAt` identifican el ultimo dato recibido. `ScreenSyncStatus` expone conexion, ultimo error y cantidad de reintentos.
- Ante ausencia de datos o conexion, la vista debe mostrar un mensaje y la hora del ultimo dato, nunca una pantalla en blanco.

El sondeo se uso porque el backend realtime todavia no esta disponible en este repositorio. La interface no depende del mecanismo: cuando exista WebSocket o SSE, se puede sustituir la implementacion sin tocar el dominio ni la UI.

## Contrato HTTP

| Metodo  | Ruta                                            | Uso                                       |
| ------- | ----------------------------------------------- | ----------------------------------------- |
| `GET`   | `/pantallas/{codigo}/datos`                     | Paquete completo de la pantalla.          |
| `GET`   | `/pantallas/{codigo}/estado`                    | Estado actual para la suscripcion.        |
| `GET`   | `/pantallas/{codigo}/sincronizacion`            | Estado de conexion y reintentos.          |
| `GET`   | `/pantallas/{codigo}/vistas/servicios`          | Metricas y servicios visibles.            |
| `GET`   | `/pantallas/{codigo}/vistas/puntualidad`        | Datos de puntualidad.                     |
| `GET`   | `/pantallas/{codigo}/vistas/ranking`            | Top 3 del mes.                            |
| `GET`   | `/pantallas/{codigo}/vistas/meta`               | Porcentaje e hitos.                       |
| `GET`   | `/pantallas/{codigo}/anuncios`                  | Lista de anuncios vigentes.               |
| `GET`   | `/pantallas/{codigo}/vistas/actividades`        | Actividades y bitacora resumida.          |
| `GET`   | `/pantallas/{codigo}/actividades/bitacora`      | Bitacora completa.                        |
| `GET`   | `/pantallas/{codigo}/actividades/{id}/bitacora` | Bitacora de una actividad.                |
| `GET`   | `/pantallas/{codigo}/marquesina`                | Mensajes vigentes.                        |
| `POST`  | `/pantallas/{codigo}/ordenes`                   | Orden del control remoto o administrador. |
| `PATCH` | `/pantallas/{codigo}/datos`                     | Actualizacion del administrador.          |

Las rutas son las que consume `HttpScreenRepository`. El backend debe confirmar los nombres definitivos antes de la integracion; cualquier cambio se absorbe en ese unico adaptador.

## Decisiones

| Decision                                                 | Por que                                                                                   |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Repositorios Mock y HTTP detras de una interface         | Permite ejecutar CI y la TV sin backend y cambiar de origen por configuracion.            |
| Suscripcion con funcion de cancelacion                   | Evita fugas de temporizadores al desmontar la pantalla o cambiar de codigo.               |
| Retroceso exponencial acotado                            | Recupera la conexion sin saturar la API cuando la red del televisor falla.                |
| Banderas `active`, `closed` y `cancelled` en el contrato | La TV no debe calcular reglas de negocio ni mostrar servicios anulados o cerrados.        |
| `startsAt` y `endsAt` en anuncios y marquesina           | El administrador controla vigencia sin tocar el codigo.                                   |
| Bitacora tipada dentro de `InternalActivitiesData`       | La vista 6 muestra el resumen y el administrador consulta el detalle con el mismo modelo. |
| Fuente Montserrat incluida en el repositorio             | El build no depende de Google Fonts ni de red.                                            |
| `cn` de shadcn/ui en `src/lib/utils.ts`                  | Centraliza la combinacion de clases y evita conflictos de Tailwind.                       |
| Sin capturas ni datos reales versionados                 | Cumple la regla del sprint y reduce el tamano del bundle.                                 |

## Pendientes de otras personas

- Confirmar que la pulsacion no altera la vista hasta recibir el estado del backend.
- Conectar el store con `subscribeToScreenState` y `updateScreenData`.
- Terminar las seis vistas segun el documento aprobado y el administrador con bitacora completa.
- Sustituir el sondeo por el canal realtime definitivo cuando el backend lo exponga.
