# SIMON — Sistema Informativo y de Monitoreo
### GO Service LATAM — Área de Soporte Técnico

SIMON (**Sistema Informativo y de Monitoreo**) es una solución frontend integral diseñada para centralizar, visibilizar y dinamizar las operaciones del área de soporte técnico de **GO Service LATAM**.

El sistema opera en dos modalidades complementarias:
1. **Modo Kiosco / Pantalla TV (`/pantalla/[codigo]` o `/`):** Diseñado específicamente para pantallas de 42" Android TV (resolución base 1920×1080 16:9), optimizado para lectura a distancia (tipografía $\ge 28\text{px}$, KPIs $\ge 80\text{px}$), con navegación por control remoto físico y adaptabilidad responsiva completa hasta 320px (móviles y tablets).
2. **Panel de Administración (`/admin`):** Portal web con autenticación interactiva para coordinadores y administradores, permitiendo el control en vivo de la transmisión, gestión de anuncios, bitácora de actividades, marquesina y configuración de la secuencia y duración de las diapositivas.

---

## 🚀 Estado del Proyecto y Progreso de Avances (Sprint 1)

El proyecto cuenta con su arquitectura frontend desacoplada al 100%, operando con contratos TypeScript estrictos y repositorios Mock listos para conectarse con el backend (NestJS / Supabase) en fases posteriores sin reescribir la UI.

| Módulo / Vista | Estado | Descripción técnica |
|---|:---:|---|
| **Arquitectura Limpia & Repositorios** | ✅ Completado | Patrón Repository con Factory (`MockScreenRepository` y `HttpScreenRepository`), modelos de dominio puros y tipado TypeScript estricto. |
| **V1: Servicios de hoy** | ✅ Completado | Cola operativa con métricas en tiempo real (urgentes, en curso, sin asignar, seguimiento), filtros por modalidad (visita, remoto, taller) y estados visuales normalizados. |
| **V2: Puntualidad de hoy** | ✅ Completado | Podio de puntualidad, racha más larga, historial semanal con gráfico de barras detallado (ejes X/Y, líneas guía, scroll) y modal de tardanzas anónimas (`+2`) con revelado seguro para coordinación. |
| **V3: Ranking del mes** | ✅ Completado | Top 3 colaboradores con desglose Actitud (Puntualidad + Asistencia) y Aptitud (Capacitación + Servicios), factor dominante y destaque de crecimiento. *Cumple política ética: no muestra último lugar.* |
| **V4: Meta comercial del mes** | ✅ Completado | Termómetro de avance con hitos (Bronce, Plata, Oro, Meta). *Cumple política ética: solo porcentaje, sin cifras monetarias en soles en la pantalla pública.* |
| **V5: Anuncio de hoy** | ✅ Completado | Banner destacado con badge de tipo (Urgente, Capacitación, Noticia) y responsables designados. |
| **V6: Actividades internas** | ✅ Completado | Tablero de tareas con métricas de flujo (en curso, pausadas por servicio técnico, listas para revisión) y bolsa de tareas disponibles para toma voluntaria. |
| **Marquesina Inferior (Ticker)** | ✅ Completado | Cinta continua con categorización por colores según severidad (`urgente`, `alerta`, `anuncio`, `por_mejorar`, `logro`). |
| **Motor de Rotación & Controles** | ✅ Completado | Temporizador configurable, barra de progreso magenta, pausa/reanudación y atajos completos de teclado/control remoto (◄, ►, Espacio, Enter, B, 1-6). |
| **Tema Claro / Oscuro Persistente** | ✅ Completado | Detección automática de preferencia del sistema, alternador manual y persistencia en `localStorage` con script anti-parpadeo previo a la hidratación. |
| **Panel Administrador (`/admin`)** | ✅ Completado | Login animado con fondo bokeh/dot-grid y visibilidad de contraseña, control de TV en tiempo real y cierre de sesión seguro. |
| **Gestor de Secuencia con Drag & Drop** | ✅ Completado | Reordenamiento de tarjetas de vista mediante arrastre nativo (HTML5 Drag and Drop), activación/ocultación de vistas y ajuste global de duración (mínimo 3s). |
| **Navbar & Metadatos** | ✅ Completado | Acceso directo a `/admin` desde la barra de TV e integración de `icon.png` como favicon y metadato oficial del navegador. |

---

## 📐 Principios de Diseño y Reglas Éticas de SIMON

Para asegurar un entorno de trabajo colaborativo, respetuoso y alineado con los valores de **GO Service LATAM**, el frontend implementa estrictamente las siguientes reglas:

1. **Privacidad en Pantalla Pública (SIMON-S1-T05):** Las tardanzas del día se reflejan como un contador anónimo (ej. `+2`) en la TV. Los nombres individuales nunca se proyectan en la sala para evitar la exposición pública, reservándose únicamente para consulta privada del coordinador.
2. **Reconocimiento Positivo:** El ranking de desempeño mensual destaca únicamente a los 3 primeros puestos y su factor de crecimiento, omitiendo deliberadamente la visualización de los últimos lugares.
3. **Discreción Comercial:** La meta mensual se comunica exclusivamente en porcentaje de avance hacia los hitos del equipo, nunca en importes monetarios ni montos en soles.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15.5](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** [Tailwind CSS 3.4](https://tailwindcss.com/) + CSS Variables
- **Gestión de Estado:** [Zustand 5](https://github.com/pmndrs/zustand)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Fuente Tipográfica:** Inter / San Francisco (Display limpio para Android TV)

---

## 📁 Estructura del Proyecto

El código fuente en `frontend/src/` sigue los principios de Arquitectura Limpia (*Clean Architecture*):

```text
SIMON/
├── frontend/
│   ├── public/
│   │   ├── icon.png                 # Logo oficial / Favicon
│   │   └── logo-goservice.png       # Isotipo y branding
│   ├── src/
│   │   ├── app/                     # Rutas Next.js (App Router)
│   │   │   ├── admin/page.tsx       # Panel de administración
│   │   │   ├── pantalla/[codigo]/   # Modo Kiosco para TV
│   │   │   ├── globals.css          # Variables de tema y utilidades
│   │   │   └── layout.tsx           # Layout raíz con metadatos y script de tema
│   │   ├── domain/                  # Entidades puras y contratos
│   │   │   ├── models/index.ts      # Modelos de TypeScript (Servicios, Puntualidad, etc.)
│   │   │   └── repositories/        # Interfaces de ScreenRepository
│   │   ├── application/             # Lógica de aplicación y casos de uso
│   │   │   ├── hooks/               # useRemoteControlKeyboard, useCurrentDateTime
│   │   │   └── store/               # screenPlayerStore, themeStore, authStore
│   │   ├── infrastructure/          # Adaptadores externos y datos
│   │   │   ├── mocks/               # Datos simulados del Sprint 1
│   │   │   └── repositories/        # MockScreenRepository, HttpScreenRepository, Factory
│   │   └── presentation/            # Componentes de interfaz de usuario
│   │       ├── components/
│   │       │   ├── admin/           # AdminLogin y componentes del panel
│   │       │   ├── layout/          # ScreenHeader, ScreenTicker, ScreenControls
│   │       │   └── slides/          # Las 6 vistas rotativas de la TV
│   │       └── styles/              # Clases de apoyo neumórficas y tipográficas
│   ├── .env.example                 # Plantilla de variables de entorno
│   ├── .env.local                   # Configuración local de ejecución
│   └── package.json                 # Dependencias y scripts
├── requirements/                    # Documentación funcional y especificaciones
│   ├── SIMON_Sprint_1.md
│   └── SIMON_propuesta-vistas.md
└── README.md                        # Documentación general del repositorio
```

---

## 💻 Instalación y Ejecución Local

### 1. Prerrequisitos
- **Node.js:** Versión 18.18 o superior (recomendado 20.x LTS).
- **Gestor de paquetes:** `npm` (incluido con Node.js).

### 2. Clonar e ingresar al frontend
```bash
cd frontend
```

### 3. Configurar variables de entorno
Copiar la plantilla de entorno:
```bash
cp .env.example .env.local
```
Contenido por defecto de `.env.local`:
```env
NEXT_PUBLIC_DATA_SOURCE=mock
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_DEFAULT_SCREEN_CODE=TV-SALA-01
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```
El sistema estará disponible en:
- **Pantalla de Sala TV:** [http://localhost:3000/pantalla/TV-SALA-01](http://localhost:3000/pantalla/TV-SALA-01) (o en la raíz `/`)
- **Panel de Administrador:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - *Credenciales demo:* `coordinacion@goservice.pe` / `simon2026`

### 6. Compilación de producción y verificación de tipos
```bash
npx tsc --noEmit && npm run build
```

---

## 🎮 Controles y Navegación

### Control Remoto Físico y Teclado
| Tecla | Acción |
|---|---|
| `◄` o `RePág` | Retroceder a la diapositiva anterior |
| `►` o `AvPág` | Avanzar a la diapositiva siguiente |
| `Espacio` / `Enter` / `.` / `B` | Alternar entre Pausa y Reproducción |
| `1` a `6` | Salto directo a una diapositiva activa específica |

---

## 👥 Equipo y Créditos
- **Organización:** GO Service LATAM — Área de Soporte Técnico
- **Sistema:** SIMON (Sistema Informativo y de Monitoreo)
- **Versión:** 1.0.0 (Sprint 1 Frontend)

