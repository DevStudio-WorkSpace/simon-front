# Reglas

1. Diseño aprobado: fondo blanco, logo de GO Service LATAM arriba a la izquierda, magenta como acento. No cambies contenido, distribución ni diseño. Si algo no se puede igual, anótalo en docs/preguntas.md.
2. No inventes reglas de negocio. No agregues funciones fuera de lo pedido.
3. Pantalla de 1920x1080. Textos de 28 px mínimo. Números principales de 80 px o más.
4. Ningún estado se indica solo con color: siempre color + palabra, o color + ícono.
5. Colores fijos (tokens en Tailwind): rojo = urgente; coral = alerta; azul = programado, en atención o anuncio; ámbar = espera o por mejorar; verde = logro, terminado o lista para revisión; morado = sin técnico; gris = neutro; magenta = acento de marca.
6. NUNCA mostrar: nombres de quienes llegaron tarde (solo gris con la cantidad, ej. "+2"), el último lugar del ranking (solo los 3 primeros), ni montos en soles.
7. Horario, tolerancia, segundos de rotación (10 por defecto), minutos de pausa y cualquier regla vienen de la configuración de la API, nunca del código.
8. La pantalla no calcula nada: todo llega calculado del backend.
9. Sin datos o sin conexión: mensaje claro y hora del último dato. Nunca pantalla en blanco.
10. Las teclas NO cambian la vista directamente: envían POST /pantallas/{codigo}/ordenes con la acción (anterior, siguiente, pausa, play, ir_a) y la vista cambia cuando llega el nuevo estado por tiempo real.
11. Comentarios del código: explican POR QUÉ, no QUÉ hace.
12. No subir .env, imágenes de prueba, capturas, PDF, videos ni datos reales. Solo el logo y los íconos. Datos de prueba: JSON pequeños con nombres ficticios.
13. Nunca trabajar en main. Una rama por tarea con tres commits identificados.
14. Antes de cada commit revisa con git ls-files que no haya .env, imágenes de prueba ni PDF.

# Stack

Next.js (App Router) + TypeScript estricto + Tailwind CSS + shadcn/ui. Dos partes: /pantalla/[codigo] (TV, solo lectura) y /admin (con login). Supabase (@supabase/supabase-js) para Auth y Realtime. ESLint, Prettier, Vitest + Testing Library. GitHub Actions (lint, tsc --noEmit, test, build en cada PR). Fuentes instaladas dentro del proyecto, sin descargar nada en el build. Estructura: src/app, src/components/{pantalla,admin,ui}, src/lib/{api,realtime}, src/mocks, src/types, docs.

# Capa de datos

Interfaz en src/lib/api/ con dos implementaciones por NEXT_PUBLIC_USE_MOCK=true|false:
- mock: lee JSON de src/mocks/ y simula estado y órdenes en memoria con un pequeño retraso, emitiendo el nuevo estado como lo haría Realtime.
- real: llama al backend (NEXT_PUBLIC_API_URL) y se suscribe a la tabla pantallas_estado de Supabase Realtime.
.env.example con NEXT_PUBLIC_USE_MOCK, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY sin valores reales. Tipos TypeScript de cada vista en src/types/. Nombres de campos en español y snake_case como el modelo de datos del SPRINT.md.

# Estructura de pantalla

De arriba hacia abajo, en 1920x1080, escalada para verse igual en cualquier navegador: cabecera (logo, "Soporte técnico", título, estado Reproduciendo o Pausado con ícono y palabra, número n/6, fecha y hora); línea de progreso; contenido central; franja inferior con mensajes importantes del día con etiqueta (Urgente, Alerta, Anuncio, Por mejorar, Logro), urgentes primero, sin repetir los indicadores de la vista. La vista 6 usa la franja para la actividad disponible para tomar.

# Vistas

1/6 Servicios de hoy: indicadores (servicios hoy, urgentes, atendiendo ahora, sin técnico, por llamar). Columnas: N°, Prioridad, Hora, Técnico, Cliente con ícono de modalidad (pin = visita, monitor = remoto, herramienta = taller), Servicio, Máquina, Estado. Orden: urgentes primero, luego por hora, terminados al final. Más de 9 servicios: páginas "Página 1/2" sin reducir la letra. Cerrados y anulados no se muestran.
2/6 Puntualidad de hoy: lista de quienes llegaron a tiempo en orden de llegada, tarde solo "+N", indicadores y gráfico.
3/6 Ranking del mes: solo 3 primeros.
4/6 Meta del mes: porcentaje grande y centrado, hito alcanzado, próximo hito y barra con marcas.
5/6 Anuncio de hoy: un solo anuncio protagonista.
6/6 Actividades internas: título "Qué avanzar cuando estás disponible", tabla y actividad disponible en franja.

# Teclas

ArrowLeft = anterior, ArrowRight = siguiente, Enter (OK) = pausa/play. También PageDown, PageUp, espacio, B y punto. keyCode Android TV 21 izquierda, 22 derecha, 23 centro. Antirrebote corto. Cada tecla solo llama a la API de órdenes.
