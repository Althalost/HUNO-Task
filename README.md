# HUNOTASK 🚀

> Kanban task manager built with Next.js, Supabase and Clerk
> Plataforma de gestión de tareas ágil, multi-idioma y de alta fluidez orientada a la experiencia de usuario (UX).

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)

![Drag and drop demo](https://private-user-images.githubusercontent.com/80772336/614813625-23f22323-c598-4df2-b22e-598c07a69b74.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODI3NjcwMDEsIm5iZiI6MTc4Mjc2NjcwMSwicGF0aCI6Ii84MDc3MjMzNi82MTQ4MTM2MjUtMjNmMjIzMjMtYzU5OC00ZGYyLWIyMmUtNTk4YzA3YTY5Yjc0LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjI5VDIwNTgyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJjM2QxYmI2YjEzODliY2JmNWQ4YTg4MGQ2YmM0NWMyMWNlN2Y0NzkzYTRhZTY2NTAyOGEzZTg5NTE2MDQ0NzcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRmdpZiJ9.Fbl80ttR3H7tt771z4vjydTxsQBf6WB5D3dFgQjO1f8)

Live Demo: https://hunotask.vercel.app

🛠️ Stack Tecnológico
Core: Next.js (App Router) + React

Autenticación: Clerk (con inyección de claims personalizados en JWT)

Base de Datos & Realtime: Supabase (PostgreSQL)

Gestión de Drag & Drop: @dnd-kit/core & @dnd-kit/sortable

Internacionalización: next-intl (Soporte nativo EN | PT)

UI & Estilos: Tailwind CSS + Shadcn UI + Lucide Icons

🏗️ Arquitectura de Base de Datos y Seguridad (RLS)
La base de datos está diseñada con un modelo relacional estricto en PostgreSQL (boards → columns → tasks), utilizando Row Level Security (RLS) activado en el 100% de las tablas para así garantizar el aislamiento de datos:

Inyección de Identidad: Mediante una función SQL requesting_user_id(), el motor extrae directamente el claim sub del token JWT proporcionado por Clerk.

Políticas de Acceso en Cascada: Se implementaron políticas EXISTS en las tablas hijas (columns y tasks) estas verifican la propiedad de la tabla padre (boards.user_id), impidiendo que un usuario malintencionado intente mutar o leer registros adyacentes mediante manipulación de IDs en las peticiones.

Mutaciones Atómicas en Lote: Para evitar el problema de las N+1 queries al reordenar tareas, se desarrolló la función update_tasks_order(p_tasks JSONB) con SECURITY DEFINER, permitiendo actualizar los índices sort_order y column_id de múltiples registros en una sola transacción de red.

💡 Retos Técnicos y Soluciones de Ingeniería
Más allá de implementar operaciones CRUD básicas, el desarrollo del proyecto se centró en resolver cuellos de botella de rendimiento y fricciones complejas de UX:

1. Motor de Drag & Drop con Optimistic Updates en Memoria
   El Problema: En un principio existia algo de retraso si esperamos la respuesta exitosa de la base de datos para Sincronizar cada movimiento de tarjeta durante el arrastre, esto generaba latencia visual, interrupciones en la interfaz y un consumo excesivo de red.

La Solución: Implementé un motor de reordenamiento puramente local dentro del evento handleDragOver. Mutando el estado de React con matrices bidimensionales y splice(),así el usuario percibe un movimiento instantáneo (Optimistic UI). La sincronización asíncrona con Supabase se posterga estratégicamente hasta el evento handleDragEnd, utilizando un useRef como puente transaccional en caso de requerir un rollback.

2. Resolución del Conflicto de Navegación Móvil (Scroll vs. Drag)
   El Problema: En cuanto revisé como iba la web en dispositivos móviles, fue fácil notar que existía una competencia constante entre el scroll nativo del navegador y el inicio del arrastre de las tarjetas.inicialmente intenté mover unos parametros de los sensores pero, o bien la interfaz no permitía hacer scroll, o las tareas no se capturaban con precisión.

La Solución: Combiné useSensors con un TouchSensor configurado con restricciones de activación (delay: 50ms, tolerance: 10px) y un punto clave fue que apliqué aislamiento CSS estricto mediante touch-none exclusivamente sobre el contenedor más próximo a la unidad del componente. Para resolver colisiones entre columnas vecinas, fue empleada una función customCollisionDetection, para una estrategia híbrida que evalúa el puntero directo (pointerWithin) como prioridad antes de recurrir a la proximidad de las esquinas (closestCorners).

3. Orquestación de Middleware: Autenticación (Clerk) e i18n (next-intl)
   El Problema: Dado que el proyecto no se concibió inicialmente con traducciones, Al integrar la internacionalización, el manejador de rutas hacía conflicto entre next-intl y clerk, esto generaba bucles de redirección y errores de página no encontrada (404) al intentar resolver los prefijos de localización (/en/_, /pt/_) junto a las rutas protegidas.

La Solución: Estructuré un matcher de rutas unificado en el Middleware de Next.js, logrando que el interceptor de Clerk evalúe el estado de la sesión respetando y propagando la reescritura dinámica del subdirectorio de idioma gestionado por next-intl, tal y como lo indica la documentación de Clerk de combineMiddleware.

4. Eliminación de Re-renders en Cascada (Supabase Provider)
   El Problema: La actualización automática de los tokens en segundo plano por parte de Clerk disparaba el cliente de Supabase, cancelando suscripciones en tiempo real y generando destellos visuales (UI flashing).

La Solución: Desacoplé la reactividad de la sesión encapsulando el token dentro de un useRef. Esto permitió mantener una instancia estática y persistente del cliente de Supabase, que recupera el token más reciente de forma asíncrona e inmutable, mejorando así el rendimiento y experiencia del usuario.

## 🗄️ Esquema de Base de Datos

![Supabase Schema](https://private-user-images.githubusercontent.com/80772336/614816234-125547f9-7463-47a6-85e5-5d9bc64d55cb.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODI3Njc0NTksIm5iZiI6MTc4Mjc2NzE1OSwicGF0aCI6Ii84MDc3MjMzNi82MTQ4MTYyMzQtMTI1NTQ3ZjktNzQ2My00N2E2LTg1ZTUtNWQ5YmM2NGQ1NWNiLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjI5VDIxMDU1OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWY5ZDc0MDNjMTg2MzAyYjFkNmQyMGExOTMyOTBhYzBmMjg0ZjEzYTFkYjE5N2M3NjE0NTAwYWQ1ODcxNDdkMDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.CcmFRnuDAj5BYw6SMc2WUrV9YYp-3tbf3o1g5j--jus)

## 💻 Instalación y Desarrollo Local

1. **Clonar el repositorio:**

```bash
git clone https://github.com/Althalost/HUNO-Task
cd hunotask
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhYmdjaW9p...
```

4. **Ejecutar el servidor de desarrollo:**

```bash
npm run dev
```

---
