# NOA Propiedades - PropTech MVP

Plataforma moderna de gestión y comercialización inmobiliaria enfocada en el mercado del norte argentino (Salta y Jujuy). Desarrollada como Producto Mínimo Viable (MVP) para demostrar la implementación de arquitecturas web modernas aplicadas al sector PropTech.

## Tecnologías Utilizadas

Este proyecto fue construido utilizando herramientas de vanguardia para asegurar alto rendimiento, excelente SEO y una experiencia de usuario fluida:

*   **Framework:** [Next.js 16.2](https://nextjs.org/) (App Router)
*   **Lenguaje:** TypeScript
*   **Base de Datos y Autenticación:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Estilos:** Tailwind CSS
*   **Gestor de Paquetes:** pnpm
*   **Despliegue:** Vercel

## Características Principales

*   **Renderizado Híbrido (RSC & SSR):** Utilización de React Server Components para optimizar el envío de JavaScript al cliente y Server-Side Rendering para un SEO impecable del catálogo de propiedades.
*   **Búsqueda Dinámica por URL:** Filtro de propiedades utilizando `useSearchParams`, permitiendo compartir enlaces exactos con filtros pre-aplicados sin depender de estados locales (`useState`).
*   **Rutas Dinámicas:** Vistas detalladas para cada propiedad (`/propiedades/[id]`) generadas desde el servidor.
*   **Autenticación Segura:** Sistema de login implementado con `@supabase/ssr` y protegido mediante **Middleware** nativo de Next.js.
*   **Mutación de Datos sin APIs:** Creación de nuevas propiedades desde el panel de control utilizando **Server Actions**, eliminando la necesidad de crear endpoints intermedios y recargando la caché automáticamente con `revalidatePath`.
*   **Seguridad de Datos:** Políticas de seguridad a nivel de fila (Row Level Security - RLS) configuradas en PostgreSQL.

## Instalación y Configuración Local

Si deseas correr este proyecto en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/noa-propiedades.git](https://github.com/tu-usuario/noa-propiedades.git)
   cd noa-propiedades
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Esquema de Base de Datos

El proyecto utiliza dos tablas principales en PostgreSQL con relaciones directas:

*   `agents`: Almacena la información de los corredores inmobiliarios.
*   `properties`: Almacena el catálogo de inmuebles, vinculados a un agente mediante una clave foránea (`agent_id`).

## Autor

**Lautaro Zuleta** -
Desarrollador Full Stack