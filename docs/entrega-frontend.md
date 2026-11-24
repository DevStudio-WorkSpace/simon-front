# Entrega frontend

## SIMON-S1-T01

- Estado: terminado
- Commits: `89e6204` implementación; `605c2ca` pruebas
- Archivos principales: `package.json`, `src/app`, `public/logo-go-service.svg`, `.github/workflows/ci.yml`
- Verificación: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`
- Diferencias con el diseño: pendiente de confirmar la identidad visual oficial y el contenido del sprint.
- Preguntas abiertas: logo oficial, referencia local del sprint y contratos reales del backend.

## SIMON-S1-T03

- Estado: terminado
- Commits: `265c1f3` implementación; `66706f4` pruebas
- Archivos principales: `src/types/pantalla.ts`, `src/mocks/pantalla.json`, `src/lib/api/`
- Verificación: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`
- Diferencias con el diseño: los campos reales deben confirmarse con `referencia-local/SPRINT.md` y el backend.
- Preguntas abiertas: modelo exacto de `pantallas_estado`, nombres finales de campos y contrato de órdenes.

## SIMON-S1-T11

- Estado: terminado
- Commits: `f4860d5` implementación; `326c3e1` pruebas
- Archivos principales: `src/app/pantalla/[codigo]/page.tsx`, `src/components/pantalla/`, `src/lib/pantalla.ts`
- Verificación: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`
- Diferencias con el diseño: el contenido central continúa pendiente hasta T12-T14.
- Preguntas abiertas: hora real del último dato depende del campo confirmado por el backend.

## SIMON-S1-T12

- Estado: terminado
- Commits: `5828c9b` implementación; `33b8326` pruebas
- Archivos principales: `src/components/pantalla/VistaServicios.tsx`, `src/components/pantalla/VistaPuntualidad.tsx`
- Verificación: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`
- Diferencias con el diseño: la paginación cambia cada 9 registros y conserva tipografía.
- Preguntas abiertas: confirmar nombres y campos finales del modelo de puntualidad.

## SIMON-S1-T13

- Estado: terminado
- Commits: `e039c99` implementación; `5307c1b` pruebas
- Archivos principales: `src/components/pantalla/VistaRanking.tsx`, `src/components/pantalla/VistaMeta.tsx`
- Verificación: lint, typecheck, test y build sin errores.
- Diferencias con el diseño: solo tres posiciones, sin montos.
- Preguntas abiertas: confirmar datos reales calculados por el backend.

## SIMON-S1-T14

- Estado: terminado
- Commits: `07559c9` implementación; `f460e4` pruebas
- Archivos principales: `src/components/pantalla/VistaAnuncios.tsx`, `src/components/pantalla/VistaActividades.tsx`
- Verificación: lint, typecheck, test y build sin errores.
- Diferencias con el diseño: las validadas no se muestran.
- Preguntas abiertas: confirmar vigencia y responsables reales de anuncios.

## SIMON-S1-T15

- Estado: terminado
- Commits: `0595e86` implementación; `a7e8267` pruebas; `b2bbfbb` documentación
- Archivos principales: `src/app/admin/page.tsx`, `src/lib/api/`
- Verificación: lint, typecheck, test y build sin errores.
- Diferencias con el diseño: modo mock permite ingresar en pruebas.
- Preguntas abiertas: permisos de creación, asignación y validación.

## SIMON-S1-T16

- Estado: terminado
- Commits: `bd38671` implementación; `e75b5df` pruebas y guía
- Archivos principales: `docs/instalacion-tv.md`, `docs/pruebas/mvp.md`, modo memoria
- Verificación: lint, typecheck, test y build sin errores.
- Diferencias con el diseño: pruebas físicas pendientes.
- Preguntas abiertas: licencia de app de kiosco y modelo físico del Android TV.

