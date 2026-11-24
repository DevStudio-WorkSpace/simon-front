# **SIMON: Sprint 1, MVP**

Asignación de tareas del equipo de desarrollo  
Empieza el lunes 23 de noviembre de 2026\. Entrega 1: martes 24 a las 18:00. Entrega 2: jueves 26 a las 18:00. Sprint review con el MVP en el televisor: viernes 27\.

## **Contexto**

SIMON es el sistema de pantallas informativas del área de Soporte Técnico de GO Service LATAM. Se muestra en un televisor de 42" con Android TV, en la sala principal donde el equipo da soporte remoto, se reúne y se capacita. Tiene seis vistas que rotan solas: Servicios de hoy, Puntualidad de hoy, Ranking del mes, Meta del mes, Anuncio de hoy y Actividades internas. En el MVP se controla con el control remoto del televisor; después, con una botonera Bluetooth de tres botones (anterior, pausa o play, siguiente).  
SIMON junta datos de otros sistemas y además gestiona datos propios. Los servicios vienen de RP-TECH; la asistencia, de SINOT (en desarrollo); las notas de capacitación, del Google Sheet "Registro de notas – Nivel 1". Las actividades internas con su bitácora, los anuncios, los mensajes de la marquesina y la meta comercial se cargan en el administrador de SIMON, que se abre con usuario y contraseña desde cualquier computadora.  
Las vistas ya están aprobadas por el cliente. El contenido, la distribución y el diseño (fondo blanco, logo de GO Service LATAM arriba a la izquierda, magenta como acento de marca) no se cambian. Los nombres, números y horas de los mockups son ejemplos. Referencia visual: [documento de vistas aprobadas](./SIMON_propuesta-vistas.md).

## **Un caso de ejemplo**

> * A las 9:10 la coordinadora asigna a Billy la actividad interna "Completar maletín 2" desde el administrador. Billy la inicia y queda En curso.  
> * A las 10:00 York empieza en RP-TECH un servicio urgente para la clienta Jazmín. En menos de un minuto aparece primero en Servicios de hoy, con barra roja, y la marquesina muestra "Urgente · OS-0152 · Jazmín · máquina parada · York atendiendo".  
> * A las 10:20 Billy debe salir a un servicio. Registra en la bitácora que terminó el inventario y faltan dos puntas. La actividad pasa a Pausada por servicio y conserva su siguiente paso: reponer puntas.  
> * El gerente entra a la sala y quiere ver las actividades. Con el control remoto pausa y avanza; la TV cambia en menos de un segundo y la cabecera muestra "Pausado". A los 10 minutos la rotación sigue sola.  
> * A las 12:30 Billy retoma la actividad y a las 13:00 la entrega para revisión. La coordinadora la valida. La bitácora guarda cada paso con quién lo hizo y cuándo.

Por qué importa: la pantalla solo sirve si los datos llegan solos y a tiempo, si cualquiera la puede controlar sin tocar una computadora y si una actividad interrumpida por un servicio se puede retomar sin perder lo avanzado.

## **Objetivo del sprint**

Tener el viernes 27 el MVP funcionando en el televisor de la sala: las seis vistas con el diseño aprobado, rotando y controlables con el control remoto; el administrador para anuncios, marquesina, meta, configuración y actividades internas con bitácora; los servicios leídos de RP-TECH; y el sistema publicado en el servidor. La asistencia y las notas usan datos de prueba con el formato acordado hasta conectarlas en el Sprint 2\.

## **Decisiones tomadas**

> * La TV muestra una página web de SIMON. No se desarrolla una app para televisores.  
> * Como el televisor es Android TV, se instala en él una app de kiosco que abre SIMON al encender, lo mantiene en pantalla completa, evita que la pantalla se apague y lo recarga si se cuelga. No se usa el navegador del televisor ni equipos adicionales.  
> * Cada pulsación del control remoto (y luego de la botonera) se envía al backend, que guarda el estado de la pantalla. Así el administrador también puede controlarla y cada uso queda registrado.  
> * SIMON solo lee RP-TECH, SINOT y el Sheet de notas; nunca escribe en ellos.  
> * Las actividades internas y su bitácora son datos propios de SIMON.  
> * El código y la base de datos van en las cuentas de la empresa (GitHub y Supabase) desde el primer día.  
> * Se publica en el servidor Hetzner, igual que RP-TECH.

## **Stack**

> * Backend: NestJS con TypeScript en modo estricto, en Docker.  
> * Frontend: Next.js con TypeScript, Tailwind CSS y shadcn/ui. Dos partes: /pantalla/{codigo} para la TV (solo lectura) y /admin (con login).  
> * Base de datos: Supabase (PostgreSQL, Auth, Realtime y RLS), con Supabase CLI y migraciones versionadas.  
> * Publicación: Hetzner con Docker y HTTPS.

Se reutilizan los patrones de RP-TECH y SIREP: estructura de proyectos, login, permisos con RLS y convenciones de nombres.

## **Equipo y roles**

| Rol | Conoce RP-TECH y SIREP | Área |
| :---- | :---- | :---- |
| Backend 1 (líder técnico) | Sí | Repositorios, base de datos, conector de RP-TECH, órdenes en tiempo real, despliegue, revisión de pull requests del backend e informe de cada entrega. |
| Backend 2 | No | Datos de prueba, API de las vistas, actividades internas con bitácora y reglas de puntos. |
| Frontend 1 | Sí | Estructura de la pantalla, rotación, tiempo real, control remoto, vistas 1 a 3, revisión de pull requests del frontend e instalación en el televisor. |
| Frontend 2 | No | Vistas 4 a 6 y administrador. |

Quien conoce RP-TECH y SIREP acompaña a su par de área: revisa sus pull requests y le explica los patrones que se reutilizan. Dentro de cada área, la pareja puede redistribuir las tareas; el cambio se anota en el informe de la entrega.

## **Reglas de este sprint**

> * Las vistas se construyen como están aprobadas. Si algo no se puede hacer igual, se pregunta antes de cambiarlo.  
> * No se inventan reglas de negocio. Lo que falte va como pregunta en el informe de la entrega.  
> * No se agregan funciones fuera de este documento. Una mejora se propone en el informe y se hace solo si se aprueba.  
> * Los datos de prueba usan nombres ficticios. No se suben al repositorio datos reales, imágenes de prueba, capturas ni videos; solo el logo y los íconos de la interfaz.  
> * Las reglas de puntos, el horario, la tolerancia y los tiempos van en tablas de configuración, no en el código.  
> * Nunca se muestran los nombres de quienes llegaron tarde, el último lugar del ranking ni montos en soles.  
> * Ningún estado se indica solo con color: siempre color y palabra, o color e ícono.  
> * Nadie sube cambios directo a main: cada tarea va en su rama y se integra con un pull request revisado.  
> * Los comentarios del código explican por qué se hizo algo, no qué hace.

## **Calendario**

| Día | Qué debe quedar |
| :---- | :---- |
| Lunes 23 | Lectura de este documento y preguntas. Repositorios, base de datos, datos de prueba y contratos (T01 a T04). Inicio de la estructura de la pantalla (T11). |
| Martes 24 | Entrega 1 a las 18:00: base completa y la pantalla rotando en el navegador, con la vista Servicios de hoy y datos de prueba. |
| Miércoles 25 | Vistas, administrador, actividades internas y conector de RP-TECH. |
| Jueves 26 | Entrega 2 a las 18:00: MVP completo publicado en el entorno de pruebas y funcionando en el televisor. |
| Viernes 27 | Sprint review con el MVP en el televisor. Correcciones del review y paso a producción con aprobación. |

## **Tareas**

### **A. Base (todo el equipo, lunes 23\)**

> * SIMON-S1-T01. Repositorios simon-back (NestJS) y simon-front (Next.js) en el GitHub de la empresa, con main protegida, tablero en GitHub Projects con una tarjeta por tarea, README con los pasos desde cero, .env.example sin valores reales, ESLint, Prettier, TypeScript estricto y GitHub Actions que corre lint, tsc, pruebas y build en cada pull request. Fuentes tipográficas instaladas en el proyecto, sin descarga durante el build.  
> * SIMON-S1-T02. Supabase en la cuenta de la empresa (proyecto de pruebas) con Supabase CLI y migraciones versionadas: tablas del modelo de datos inicial, RLS activo en todas y empresa\_id en todas.  
> * SIMON-S1-T03. Datos de prueba (npm run seed) para las seis vistas: 9 servicios del día con todos los estados y dos urgentes; marcaciones de 10 personas durante 3 semanas, con tardanzas y una falta; notas de 3 actividades de capacitación; puntos de un mes y del anterior; meta comercial; un anuncio; 5 mensajes de marquesina; 4 actividades internas en distintos estados, con su bitácora, y 1 disponible para tomar. Nombres ficticios y archivos JSON pequeños.  
> * SIMON-S1-T04. docs/arquitectura.md (componentes, flujo de una orden del control remoto, flujo de sincronización y decisiones con su porqué) y docs/contratos/ con un archivo por fuente: rp-tech.md, sinot.md y notas-sheet.md (campos, tipos, un ejemplo, frecuencia y qué pasa si la fuente falla). Backend 1 acuerda con el equipo de RP-TECH el acceso de solo lectura (vista o función, y clave) y con el equipo de SINOT el formato de las marcaciones. Acta en docs/decisiones/.

Criterios de aceptación: supabase db reset reconstruye la base y el seed la llena sin errores; un clon nuevo instala y levanta los dos proyectos siguiendo solo el README; GitHub Actions pasa en main; los tres contratos están escritos y el acta registra lo acordado y lo pendiente.

### **B. Backend**

> * SIMON-S1-T05. API de la pantalla: entrega los datos de cada vista ya calculados según la sección Reglas de las vistas, y los mensajes de la marquesina (manuales vigentes más automáticos de urgente y de servicio sin técnico). La pantalla no calcula nada. Pruebas automáticas con estos casos: 9:05 es a tiempo y 9:06 es tardanza; un servicio anulado no cuenta; un servicio sin técnico aparece como Sin técnico; la respuesta de puntualidad no contiene nombres de quienes llegaron tarde; el ranking devuelve solo tres personas.  
> * SIMON-S1-T06. API de órdenes: POST /pantallas/{codigo}/ordenes con la acción (anterior, siguiente, pausa, play o ir\_a), protegida con el código del dispositivo o con la sesión del administrador. Actualiza el estado de la pantalla en Supabase, registra la orden y levanta la pausa sola a los 10 minutos (configurable). Documentada en Swagger, que queda oculto en producción.  
> * SIMON-S1-T07. Actividades internas y bitácora: crear, asignar y cambiar de estado una actividad. Cada cambio de estado exige un registro en la bitácora con quién, cuándo, qué hizo, qué quedó pendiente, el motivo si se pausa o bloquea y el siguiente paso. Al pausar por servicio, la actividad conserva su responsable y su siguiente paso. Pruebas de los cambios de estado permitidos y prohibidos.  
> * SIMON-S1-T08. Conector de RP-TECH de solo lectura (servicios del día y servicios con posventa pendiente), con el mapeo de estados de la sección Reglas de las vistas. Copia local con hora de sincronización; si RP-TECH falla, se conserva la última copia. Si el acceso todavía no está, se trabaja contra los datos de prueba con el mismo contrato y se cambia por configuración. Conector de SINOT simulado con el formato del contrato.  
> * SIMON-S1-T09. Reglas de puntos configurables y cálculo mensual por persona y por componente (puntualidad, asistencia, capacitación y servicios), con subtotales de actitud y aptitud, el componente que más pesa y el que más creció frente al mes anterior. Cada punto queda registrado con su origen. Se usan las reglas provisionales de la sección Reglas de las vistas.  
> * SIMON-S1-T10. Publicación en Hetzner con Docker: backend y frontend, HTTPS, variables de entorno fuera del repositorio y entorno de pruebas. El paso a producción se hace el viernes con aprobación.

Criterios de aceptación: las pruebas de los casos indicados pasan; una orden con un código inválido se rechaza; una actividad no cambia de estado sin su registro en la bitácora; una sincronización fallida queda registrada y no borra la copia anterior; el sistema responde por HTTPS en el entorno de pruebas.

### **C. Frontend**

> * SIMON-S1-T11. Base de la pantalla /pantalla/{codigo} en 1920×1080 con la estructura compartida aprobada: cabecera (logo, "Soporte técnico", título, estado Reproduciendo o Pausado, número de vista n/6, fecha y hora), línea de progreso, contenido central y franja inferior. Rotación con el orden y los segundos de la configuración (10 por defecto), suscripción en tiempo real al estado de la pantalla y reconexión automática si se corta internet, mostrando la hora del último dato. Control con el control remoto: flecha izquierda, anterior; flecha derecha, siguiente; botón central (OK), pausa o play. También responde a las teclas que usará la botonera: flechas, Av Pág, Re Pág, espacio, B y punto. La tecla no cambia la vista directamente: envía la orden al backend y la vista cambia cuando llega el nuevo estado.  
> * SIMON-S1-T12. Vistas 1/6 Servicios de hoy y 2/6 Puntualidad de hoy, según el diseño aprobado.  
> * SIMON-S1-T13. Vistas 3/6 Ranking del mes y 4/6 Meta del mes, según el diseño aprobado.  
> * SIMON-S1-T14. Vistas 5/6 Anuncio de hoy y 6/6 Actividades internas, según el diseño aprobado.  
> * SIMON-S1-T15. Administrador con login: vistas activas, orden y segundos; anuncio del día; mensajes de la marquesina (tipo, texto, inicio y fin); meta del mes (porcentaje); actividades internas (crear, asignar, cambiar de estado con su registro y ver la bitácora completa); y control de la pantalla (anterior, pausa o play, siguiente, ir a una vista) con su estado actual.

Criterios de aceptación: las seis vistas se ven como en el documento de vistas aprobadas, con textos de 28 px como mínimo y números principales de 80 px o más; ningún estado se indica solo con color; con la pantalla abierta en dos navegadores, una orden en uno cambia los dos en menos de 1 segundo; un cambio en el administrador se ve en la pantalla sin recargarla.

### **D. Televisor y pruebas**

> * SIMON-S1-T16. Instalación en el televisor Android TV de la sala: app de kiosco configurada para abrir SIMON al encender, en pantalla completa, sin apagar la pantalla y con recarga si se cuelga. Verificar si las funciones necesarias de la app requieren licencia. Probar el control remoto con las seis vistas. Guía paso a paso en docs/instalacion-tv.md. Pruebas con resultados en docs/pruebas/mvp.md: la pantalla corre 4 horas seguidas sin recargar, con el consumo de memoria anotado al inicio y al final; se corta la red 1 minuto y la pantalla se recupera sola; se apaga y enciende el televisor y SIMON vuelve solo.

Criterio de aceptación: SIMON corre en el televisor de la sala sin intervención y las tres pruebas están documentadas con su resultado, aunque alguna falle.

## **Reglas de las vistas**

Resumen para el desarrollo. El diseño manda el documento de vistas aprobadas.

### **Comunes**

> * Colores con significado fijo: rojo, urgente; coral, alerta; azul, programado, en atención o anuncio; ámbar, espera o por mejorar; verde, logro, terminado o lista para revisión; morado, sin técnico; gris, neutro.  
> * La franja inferior de las vistas 1 a 5 muestra solo mensajes importantes del día, con etiqueta de tipo: Urgente, Alerta, Anuncio, Por mejorar o Logro. Los urgentes van primero. Los manuales tienen inicio y fin; los automáticos desaparecen cuando su causa se resuelve. No repite los indicadores de las vistas.  
> * Sin datos o sin conexión, la vista muestra un mensaje claro y la hora del último dato, nunca una pantalla en blanco.

### **1/6 Servicios de hoy**

> * Indicadores: servicios hoy, urgentes, atendiendo ahora, sin técnico y por llamar (seguimiento).  
> * Columnas: N°, Prioridad, Hora, Técnico, Cliente con ícono de modalidad (pin, visita; monitor, remoto; herramienta, taller), Servicio, Máquina y Estado.  
> * Orden: urgentes primero, luego por hora; terminados al final. Con más de 9 servicios, páginas identificadas (Página 1/2) sin reducir la letra.  
> * Estados a partir de RP-TECH: Por programar se muestra como Sin técnico; Programado, como Programado; En atención, como Atendiendo; En espera, como Espera con su motivo (por ejemplo, Espera repuesto); Atendido, como Terminado. Cerrados y anulados no se muestran.  
> * RP-TECH todavía no tiene campo de prioridad. Mientras no exista, todos los servicios se muestran como Programado.

### **2/6 Puntualidad de hoy**

> * Lista de quienes llegaron a tiempo, en orden de llegada, con posición, nombre y hora; oro, plata y bronce para los tres primeros.  
> * Quienes llegaron tarde no aparecen con nombre: se muestra una representación gris con la cantidad, por ejemplo "+2".  
> * Indicadores: a tiempo hoy (por ejemplo, 8 de 10\) y tardanzas hoy con los minutos sumados desde la hora de entrada.  
> * Gráfico de tardanzas del equipo de las últimas tres semanas, con la semana actual destacada; racha de puntualidad más larga; franja ámbar "Por mejorar" con la meta del día siguiente y el horario.  
> * Por ahora, a tiempo hasta las 9:05 y tardanza desde las 9:06 (Reglamento Interno v1). Hora y tolerancia configurables.

### **3/6 Ranking del mes**

> * Solo los tres primeros. Por cada uno: puesto con distintivo, nombre, total, barra apilada de cuatro componentes, subtotales de actitud (puntualidad y asistencia) y aptitud (capacitación y servicios), "Más pesa" y "Creció".  
> * Reglas provisionales, configurables: puntual \+10 por día; asistencia \+5 por día sin falta; examen con 16 o más \+50; servicio cerrado sin reapertura \+20. Las reglas finales y el desempate los define la empresa.

### **4/6 Meta del mes**

> * Porcentaje grande y centrado, hito alcanzado, próximo hito y barra con marcas en 25% (bronce), 50% (plata), 75% (oro) y 100% (meta). Sin montos. El porcentaje lo ingresa el administrador.

### **5/6 Anuncio de hoy**

> * Un solo anuncio protagonista: fecha u hora, título, descripción breve y responsables. Si hay varios vigentes, rotan dentro del tiempo de la vista.

### **6/6 Actividades internas**

> * Título "Qué avanzar cuando estás disponible". Indicadores: en curso, pausadas por servicio y listas para revisión.  
> * Tabla: Técnico, Actividad interna, Estado y Siguiente paso. No repite clientes, máquinas ni órdenes de servicio.  
> * Franja inferior: una actividad disponible para tomar, con la condición de nivel o autorización.  
> * Estados: Asignada, En curso, Pausada por servicio, Bloqueada, Lista para revisión y Validada. Las validadas salen de la TV y quedan en el historial.  
> * La TV muestra el resumen actual; la bitácora completa se ve en el administrador.

## **Modelo de datos inicial**

Nombres en español y snake\_case. Todas las tablas llevan id (uuid), empresa\_id, creado\_en y actualizado\_en, igual que en RP-TECH. El equipo puede ajustarlo y explica los cambios en el informe de la entrega.

| Tabla | Campos principales |
| :---- | :---- |
| personas | nombre\_mostrar, rol (técnico, coordinación, administrativo o gerencia), activo, rptech\_id, sinot\_id, nombre\_en\_notas |
| pantallas | codigo (único), nombre, ubicacion, activa |
| pantallas\_vistas | pantalla\_id, tipo (servicios, puntualidad, ranking, meta, anuncio o actividades), orden, segundos, activa |
| pantallas\_estado | pantalla\_id, vista\_actual, en\_pausa, pausa\_hasta |
| dispositivos | pantalla\_id, codigo\_hash, activo, ultimo\_uso |
| ordenes | pantalla\_id, vista, accion, origen (control remoto, botonera o administrador), dispositivo\_id o usuario\_id |
| servicios\_copia | numero\_orden, fecha, hora, prioridad, persona\_id del técnico, cliente, modalidad, tipo\_servicio, linea\_maquina, estado, motivo\_espera, posventa\_pendiente, sincronizado\_en |
| marcaciones\_copia | persona\_id, fecha, hora\_entrada, estado (a\_tiempo, tardanza o falta), minutos\_tardanza, sincronizado\_en |
| notas\_copia | persona\_id, actividad, fecha, nota, sincronizado\_en |
| reglas\_puntos | componente (puntualidad, asistencia, capacitacion o servicios), evento, puntos, provisional, vigente\_desde, vigente\_hasta |
| puntos | persona\_id, regla\_id, puntos, origen\_tipo, origen\_id, fecha |
| metas | mes, porcentaje |
| anuncios | titulo, descripcion, fecha\_hora, responsables, inicio, fin |
| marquesina | tipo (urgente, alerta, anuncio, por\_mejorar o logro), texto, origen (manual o automatico), inicio, fin, activa |
| actividades | titulo, responsable\_id (vacío si está disponible para tomar), estado, siguiente\_paso, condicion\_para\_tomar, creada\_por, validada\_por, validada\_en |
| actividad\_registros | actividad\_id, autor\_id, accion (inicio, avance, pausa, retoma, bloqueo, entrega o validación), que\_hizo, pendiente, motivo, siguiente\_paso |
| sincronizaciones | fuente, inicio, fin, resultado, filas, error |
| configuracion | clave, valor (hora de entrada, tolerancia, segundos por defecto, minutos de pausa) |

## **Entregas**

> * Entrega 1, martes 24 a las 18:00: T01 a T04 completas y T11 con la vista Servicios de hoy rotando en el navegador con datos de prueba.  
> * Entrega 2, jueves 26 a las 18:00: T05 a T16. MVP publicado en el entorno de pruebas y funcionando en el televisor.  
> * Viernes 27: sprint review; las correcciones del review van en commits con su identificador y en un informe breve al cierre del día.

## **Protocolo de entrega**

El historial de commits cumple la función del diario. No se piden reporte diario, informe semanal ni video. Cada entrega lleva el código y un informe pauteado.

### **Código**

> * Un git bundle de cada repositorio, generado desde main: git bundle create simon-back\_AAAA-MM-DD.bundle \--all, y lo mismo para simon-front.  
> * Si además se envía un ZIP, se genera con git archive \--format=zip \-o simon-back\_AAAA-MM-DD.zip main, nunca comprimiendo la carpeta a mano.

### **Informe para revisión**

Va en simon-back, en docs/entregas/AAAA-MM-DD.md, sin emojis ni porcentajes sin fuente, con estas secciones en este orden:

| Sección | Contenido |
| :---- | :---- |
| Versión entregada | Hash del último commit de cada repositorio (git rev-parse HEAD) y rama. |
| Tareas | Por tarea: identificador, estado (completada, en curso o no iniciada), hashes de los commits A, B y C, archivos principales y comando para verificarla. |
| Resultados | Salida resumida de npm ci, npm run lint, npx tsc \--noEmit, npm test (con el número de pruebas aprobadas) y npm run build, en los dos repositorios. |
| Base de datos | Migraciones nuevas y qué hacen, tablas con RLS y cambios al modelo de datos con su porqué. |
| API | Endpoints nuevos o modificados: método, ruta, quién puede llamarlo y un ejemplo. |
| Conectores | Estado de cada fuente (real o con datos de prueba) y última sincronización exitosa. |
| Vistas | Qué vistas están terminadas y qué diferencias tienen con el diseño aprobado, si las hay. |
| Desviaciones | Qué se hizo distinto a este documento, y por qué. |
| Problemas abiertos y bloqueos | Qué falta, qué lo detiene y qué se necesita, de quién. |
| Preguntas para decidir | Decisión, opciones y recomendación del equipo. |
| Archivos generados con IA | Ruta, herramienta usada y qué se revisó y probó a mano. |
| Autocomprobación | Cada punto de la lista siguiente, marcado. |

### **Autocomprobación antes de enviar**

Si algún punto falla, la entrega no se envía:

> * git bundle verify indica que cada bundle está completo.  
> * Al clonar el bundle en una carpeta nueva, npm ci, npm test y npm run build terminan sin errores.  
> * git ls-files no muestra .env, imágenes de prueba, PDF, videos ni datos reales. Solo se aceptan el logo y los íconos de la interfaz.  
> * Cada bundle pesa menos de 5 MB y cada ZIP menos de 10 MB. Si pesa más, se incluyó node\_modules, .next, dist, imágenes o datos.  
> * unzip \-l del ZIP no muestra node\_modules, .next, dist ni .env.  
> * El hash del informe coincide con git rev-parse HEAD.

Nunca se envían .env, node\_modules, .next, dist, capturas, videos ni datos reales.

### **Commits y pull requests**

> * Cada tarea va en su rama, por ejemplo feature/SIMON-S1-T07-actividades.  
> * Cada tarea tiene tres etapas y cada etapa termina con su propio commit, hecho por quien la realizó, con el identificador al inicio del mensaje. A, implementación: el cambio funciona (SIMON-S1-T07-A: descripción breve). B, verificación: pruebas automáticas o, si no aplica, evidencia escrita (SIMON-S1-T07-B). C, documentación: README, contrato o comentario del porqué (SIMON-S1-T07-C).  
> * En las tareas sin código (contratos, acuerdos e instalación en el televisor), A es el trabajo, B su revisión por otro integrante y C la nota en el informe.  
> * Un pull request por tarea, con el identificador en el título, qué cambia y cómo probarlo. Lo revisa el integrante del área que conoce RP-TECH y SIREP. Cuando se integra, la tarea cuenta como completada.

## **Requisitos que entrega el coordinador**

> * Acceso al GitHub y al Supabase de la empresa para los cuatro integrantes.  
> * Acceso al servidor Hetzner y la dirección (dominio o subdominio) donde se publica SIMON.  
> * Coordinación con el equipo de RP-TECH para el acceso de solo lectura y con el equipo de SINOT para el formato de las marcaciones.  
> * Logo de GO Service LATAM en buena calidad y el documento de vistas aprobadas.  
> * El televisor de la sala disponible para la instalación y las pruebas desde el jueves 26\.

## **Decisiones pendientes**

| Tema | Quién decide |
| :---- | :---- |
| Campo de prioridad en RP-TECH (hoy se atiende por orden de llegada) | Gerencia |
| Reglas finales de puntos y criterio de desempate | Gerencia y Coordinación |
| Horario y tolerancia definitivos para la vista de puntualidad | Gerencia, según el reglamento |
| Quién crea, asigna y valida las actividades internas | Coordinación |
| Si el gerente participa en el ranking | Gerencia |
| Formato de las marcaciones que entrega SINOT | Equipos de SINOT y de SIMON |

## **Definición de terminado del sprint**

> * Las 16 tareas cumplen sus criterios de aceptación y están integradas en main por pull request.  
> * Las seis vistas rotan en el televisor de la sala con el diseño aprobado y se controlan con el control remoto a través del backend.  
> * Las actividades internas se gestionan desde el administrador con su bitácora completa.  
> * Los servicios se leen de RP-TECH o, si el acceso no llegó, de los datos de prueba con el mismo contrato.  
> * Las dos entregas llegaron con su informe y pasaron la autocomprobación.

## **Ruta de desarrollo**

El proyecto avanza por etapas. Cada etapa termina cuando se cumple su criterio de salida, y la siguiente queda definida antes de que termine la anterior. Esta ruta se actualiza al cerrar cada etapa.

| Etapa | Contenido | Criterio de salida | Estado |
| :---- | :---- | :---- | :---- |
| 1\. Base (Entrega 1\) | Repositorios, base de datos, datos de prueba, contratos y estructura de la pantalla | La base se reconstruye desde cero y la vista de servicios rota en el navegador. Estimado: martes 24 de noviembre | En curso |
| 2\. MVP completo (Entrega 2\) | Seis vistas, administrador, actividades con bitácora, órdenes en tiempo real, conector de RP-TECH, publicación e instalación en el televisor | SIMON corre en el televisor de la sala y se controla con el control remoto. Estimado: jueves 26 de noviembre | Siguiente |
| 3\. Sprint review y producción | Revisión del MVP en el televisor y correcciones | MVP aprobado y publicado en producción. Estimado: viernes 27 de noviembre | Pendiente |
| 4\. Mejoras y datos reales (Sprint 2\) | Ajustes del review, conexión real con SINOT y el Sheet de notas, botonera Bluetooth, registro de avances de los técnicos desde el celular y reglas de puntos definitivas | Las seis vistas muestran datos reales y la botonera controla la pantalla. Estimado: viernes 4 de diciembre | Pendiente |
| 5\. Documentación y cierre | README, arquitectura, guía de despliegue, guía de instalación en el televisor y manual del administrador | El proyecto se instala, se prueba y se despliega desde cero siguiendo solo la documentación | Pendiente |

Estado actual: inicio de la etapa 1, con cierre estimado el martes 24 de noviembre.