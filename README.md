# 🎬 NotMubi

> Plataforma de streaming dedicada al **cine de culto, las joyas ocultas y las películas tan malas que se vuelven buenas**. Construida con una arquitectura de microservicios con Spring Boot.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-green?logo=springboot)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.3-blue?logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)

---

## 📖 Índice

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Arquitectura](#-arquitectura)
- [Stack tecnológico](#-stack-tecnológico)
- [Microservicios](#-microservicios)
- [Endpoints principales](#-endpoints-principales)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Decisiones técnicas destacadas](#-decisiones-técnicas-destacadas)
- [Estado del proyecto](#-estado-del-proyecto)
- [Aprendizajes](#-aprendizajes)
- [Declaración sobre el uso de IA](#-declaración-sobre-el-uso-de-ia)
- [Autor](#-autor)

---

## 🎥 Sobre el proyecto

**NotMubi** es una plataforma ficticia de streaming cuyo catálogo gira en torno al **cine de culto y las películas "tan malas que son buenas"**. El proyecto nace como práctica personal para dominar el desarrollo de **microservicios con Spring Boot y Spring Cloud**, partiendo de una base sólida en aplicaciones monolíticas MVC.

El objetivo no es solo tener endpoints funcionando, sino **entender y aplicar los patrones reales** de una arquitectura distribuida: service discovery, API Gateway, autenticación JWT centralizada, comunicación entre servicios, y despliegue con contenedores.

### Funcionalidades actuales

- 🔐 Registro y autenticación de usuarios con JWT.
- 🎬 Catálogo de películas de culto con niveles de "maldad legendaria".
- 💳 Planes de suscripción temáticos (*Cult Básico*, *Cult Fan*, *Cult Legend*).
- 📊 Gestión de suscripciones (crear, consultar, cancelar).
- 🖥️ Frontend en React que consume la API a través del Gateway.

---

## 🏛️ Arquitectura

NotMubi sigue una **arquitectura de microservicios** clásica, con los siguientes componentes:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE (React + Vite :5173)                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY :8080  (Spring Cloud Gateway)          │
│              - Enrutamiento dinámico vía Eureka                 │
│              - Validación de JWT                                │
│              - CORS centralizado                                │
└──────┬─────────────────┬──────────────────┬─────────────────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌────────────┐    ┌────────────┐    ┌──────────────────┐
│   AUTH     │    │  CATALOG   │    │  SUBSCRIPTION    │
│  :8081     │◄───│  :8082     │    │  :8083           │
│            │    │            │    │                  │
│ - Register │    │ - Pelis    │    │ - Planes         │
│ - Login    │    │ - CRUD     │    │ - Suscripciones  │
│ - JWT      │    │ - Feign ───┼───►│ - Feign a auth   │
└─────┬──────┘    └─────┬──────┘    └────────┬─────────┘
      │                 │                    │
      ▼                 ▼                    ▼
┌────────────┐    ┌────────────┐    ┌──────────────────┐
│ notmubi_   │    │ notmubi_   │    │ notmubi_         │
│ auth       │    │ catalog    │    │ subscription     │
└────────────┘    └────────────┘    └──────────────────┘
       ▲                 ▲                    ▲
       └─────────────────┴────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  DISCOVERY SERVER   │
              │  Eureka :8761       │
              └─────────────────────┘
```

**Reglas fundamentales respetadas:**

- ✅ Cada microservicio tiene su **propia base de datos**.
- ✅ No hay **foreign keys entre servicios** (solo referencias por ID).
- ✅ La comunicación entre servicios es vía **HTTP (Feign)** y **descubrimiento dinámico (Eureka)**.
- ✅ **No hay URLs hardcodeadas** entre servicios.
- ✅ La seguridad JWT se valida en el **Gateway**, no en cada servicio.
- ✅ El **contexto del usuario** (ID, username, rol) se propaga vía headers internos.

---

## 🛠️ Stack tecnológico

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.3.4 | Framework base |
| Spring Cloud | 2023.0.3 | Ecosistema de microservicios |
| Spring Cloud Gateway | (reactivo) | API Gateway |
| Netflix Eureka | (Spring Cloud) | Service Discovery |
| OpenFeign | (Spring Cloud) | Comunicación entre servicios |
| Spring Security | 6.x | Autenticación |
| JWT (jjwt) | 0.12.6 | Tokens JWT |
| Spring Data JPA | 3.x | Persistencia |
| Hibernate | 6.5.x | ORM |
| PostgreSQL | 16 | Base de datos |
| Lombok | 1.18.38 | Reducción de boilerplate |
| Maven | 3.9+ | Build multi-módulo |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18+ | UI |
| Vite | 8.x | Build tool |
| React Router | 6+ | Enrutamiento |
| Axios | 1.x | HTTP client |

### Infraestructura

| Tecnología | Uso |
|---|---|
| Docker | Contenedores |
| Docker Compose | Orquestación local |
| PgAdmin | Cliente web de PostgreSQL |

---

## 🧩 Microservicios

### `discovery-server` — Puerto 8761

Servidor Eureka. **Directorio de servicios**: cada microservicio se registra aquí al arrancar, y el Gateway consulta este registro para enrutar sin conocer direcciones físicas.

### `api-gateway` — Puerto 8080

Punto de entrada único. Responsabilidades:

- Enrutar peticiones a los microservicios correspondientes vía `lb://<service-name>`.
- Validar el JWT en cada petición (excepto rutas públicas).
- Extraer `userId`, `username` y `role` del token y propagarlos como headers internos (`X-User-Id`, `X-User-Username`, `X-User-Role`).
- Configurar CORS para el frontend.
- Devolver 401 limpio con JSON si el token es inválido.

### `auth-service` — Puerto 8081

Gestión de identidad:

- Registro de usuarios con hash BCrypt.
- Login con emisión de JWT firmado (HS512).
- Endpoints internos para consultar usuarios por ID o username (usados vía Feign por otros servicios).

**Base de datos:** `notmubi_auth` → tabla `users`.

### `catalog-service` — Puerto 8082

Catálogo de películas:

- CRUD completo de películas.
- Filtrado por nivel de culto (`LEGENDARY`, `SO_BAD_IT_IS_GOOD`, `HIDDEN_GEM`, `GUILTY_PLEASURE`).
- Búsqueda por título.
- Endpoint compuesto que combina datos de una peli con los datos del usuario (vía **Feign** a `auth-service`).

**Base de datos:** `notmubi_catalog` → tabla `movies`.

### `subscription-service` — Puerto 8083

Gestión de suscripciones:

- Listado público de planes (sin autenticación).
- Suscripción a un plan (validando usuario vía **Feign**).
- Consulta de la suscripción activa.
- Cancelación.

**Base de datos:** `notmubi_subscription` → tablas `plans` y `subscriptions`.

---

## 🔗 Endpoints principales

Todos los endpoints se consumen a través del Gateway: `http://localhost:8080`.

### Autenticación (público)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de usuario. Devuelve JWT. |
| `POST` | `/auth/login` | Login. Devuelve JWT. |

### Catálogo (requiere JWT)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/movies` | Lista todas las películas. |
| `GET` | `/api/movies/{id}` | Detalle de una película. |
| `GET` | `/api/movies/cult/{level}` | Filtra por nivel de culto. |
| `GET` | `/api/movies/search?title=...` | Búsqueda por título. |
| `POST` | `/api/movies` | Crea una película. |
| `PUT` | `/api/movies/{id}` | Actualiza una película. |
| `DELETE` | `/api/movies/{id}` | Elimina una película. |
| `GET` | `/api/movies/{id}/with-user/{userId}` | 🚀 Combina película + usuario (Feign). |

### Suscripciones

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/subscriptions/plans` | ❌ | Lista los planes disponibles (público). |
| `GET` | `/api/subscriptions/plans/{id}` | ❌ | Detalle de un plan. |
| `POST` | `/api/subscriptions/subscribe` | ✅ | Suscribirse a un plan. |
| `GET` | `/api/subscriptions/me` | ✅ | Ver suscripción activa. |
| `POST` | `/api/subscriptions/me/cancel` | ✅ | Cancelar suscripción activa. |

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos

- **Docker Desktop** instalado y corriendo.
- **JDK 21** instalado (`java --version`).
- **Maven 3.9+** (`mvn --version`).
- **Node.js 18+** y npm (`node --version`).

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd NotMubi
```

### 2. Levantar la infraestructura (Postgres + PgAdmin)

```bash
docker compose up -d
```

Esto arranca:
- PostgreSQL en `:5432` con 3 bases de datos creadas automáticamente.
- PgAdmin en `:5050` (acceso: `admin@notmubi.com` / `admin`).

### 3. Compilar el backend

Desde la raíz del proyecto:

```bash
mvn clean install -DskipTests
```

### 4. Arrancar los microservicios

**Importante:** respeta el orden.

```bash
# Terminal 1
mvn -pl backend/discovery-server spring-boot:run

# Terminal 2 (cuando Eureka esté lista)
mvn -pl backend/auth-service spring-boot:run

# Terminal 3
mvn -pl backend/catalog-service spring-boot:run

# Terminal 4
mvn -pl backend/subscription-service spring-boot:run

# Terminal 5 (el último, para que vea a todos en Eureka)
mvn -pl backend/api-gateway spring-boot:run
```

Verifica en `http://localhost:8761` que los 4 servicios aparecen como **UP**.

### 5. Arrancar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

### 6. Usuario de prueba

Regístrate desde el front, o usa:

```
Usuario: pau
Contraseña: secret123
```

---

## 🎯 Decisiones técnicas destacadas

Estas son las decisiones que considero más relevantes del proyecto, y que diferencian un CRUD básico de una arquitectura pensada:

### 1. **Cada microservicio tiene su propia base de datos**

Nada de compartir esquema entre servicios. `notmubi_auth`, `notmubi_catalog` y `notmubi_subscription` son BDs independientes. Esto respeta el principio de **bounded context** de Domain-Driven Design.

**Consecuencia:** no se pueden hacer JOIN entre tablas de distintos servicios. La comunicación es **siempre HTTP**.

### 2. **Sin foreign keys entre servicios**

En `subscriptions.user_id` **no hay FK a `users.id`** porque `users` vive en otra BD y otro servicio. Solo se guarda el ID como referencia. Si mañana el `auth-service` migra su BD, el `subscription-service` sigue funcionando sin saberlo.

### 3. **Service Discovery con Eureka**

Los servicios se registran en Eureka. **Ninguna URL interna está hardcodeada.** El Gateway enruta con `lb://catalog-service`, y Feign resuelve con `@FeignClient(name = "auth-service")`. Si mañana un servicio cambia de puerto, **no hay que tocar código**.

### 4. **Seguridad JWT centralizada en el Gateway**

El Gateway valida el JWT **una sola vez** por petición. Los servicios internos **confían** en el Gateway y leen el contexto del usuario desde los headers `X-User-Id`, `X-User-Username`, `X-User-Role`.

**Ventaja:** no hay que duplicar la lógica JWT en cada microservicio.

### 5. **Enrutamiento condicional según el tipo de ruta**

Algunas rutas son públicas (`/auth/register`, `/auth/login`, `/api/subscriptions/plans`) y otras privadas (`/api/**`). El `JwtAuthFilter` diferencia entre ambas y responde con 401 limpio cuando falta el token.

### 6. **Manejo correcto del CORS en Gateway reactivo**

Configurar CORS en Spring Cloud Gateway **no es trivial**. Usar `CorsWebFilter` como bean explícito es más fiable que `globalcors` en YAML, especialmente cuando convive con filtros personalizados.

### 7. **Comunicación síncrona con Feign + asíncrona futura**

Actualmente `catalog-service` y `subscription-service` llaman al `auth-service` vía Feign. Esto es comunicación **síncrona**. En el futuro está previsto integrar **Kafka** para eventos como `user.registered` o `subscription.created`.

### 8. **Carga inicial de datos con `data.sql`**

Los planes de suscripción y las películas se precargan con `data.sql` al arrancar. Esto facilita el desarrollo y las pruebas.

### 9. **Docker Compose para toda la infraestructura**

Un solo comando (`docker compose up -d`) levanta PostgreSQL con las 3 BDs, PgAdmin, y en el futuro Kafka, Redis, etc. Esto hace que cualquier persona pueda reproducir el entorno local en minutos.

---

## 📊 Estado del proyecto

### ✅ Completado

- [x] Arquitectura multi-módulo Maven con POM padre.
- [x] Service Discovery con Netflix Eureka.
- [x] API Gateway reactivo con enrutamiento dinámico.
- [x] Autenticación JWT (registro, login, validación).
- [x] Propagación de contexto de usuario vía headers internos.
- [x] CRUD completo del catálogo de películas.
- [x] Precarga automática de datos.
- [x] Comunicación entre servicios vía Feign.
- [x] Gestión de planes y suscripciones.
- [x] Manejo de CORS centralizado.
- [x] Docker Compose para Postgres + PgAdmin.
- [x] Frontend en React con Vite.
- [x] Pantallas: Login, Registro, Catálogo, Detalle, Planes, Mi Suscripción.

### 🚧 En progreso / Próximos pasos

- [ ] Servicio de notificaciones por email.
- [ ] Comunicación asíncrona con Kafka (eventos `user.registered`, `subscription.created`).
- [ ] Servicio de historial de visualización.
- [ ] Servicio de recomendaciones personalizadas.
- [ ] Rate limiting en el Gateway.
- [ ] Tracing distribuido con Zipkin.
- [ ] Tests unitarios e integración con Testcontainers.
- [ ] Documentación OpenAPI (Swagger UI).
- [ ] Despliegue en Kubernetes.

---

## 🎓 Aprendizajes

Este proyecto ha sido un salto importante desde el desarrollo monolítico MVC. Los conceptos que he tenido que entender y aplicar:

1. **Service Discovery:** cómo los servicios se encuentran dinámicamente sin URLs hardcodeadas.
2. **API Gateway:** centralizar seguridad, CORS y enrutamiento.
3. **JWT distribuido:** cómo propagar identidad entre servicios sin duplicar lógica.
4. **Comunicación síncrona entre microservicios** con Feign y Eureka.
5. **Consistencia eventual:** aceptar que dos servicios no pueden compartir transacciones ACID.
6. **Sin foreign keys entre servicios:** diseñar pensando en "contextos acotados".
7. **Docker Compose:** infraestructura reproducible en un comando.
8. **Multi-módulo Maven:** gestión de dependencias y versiones en un proyecto complejo.
9. **Depuración de sistemas distribuidos:** cuando algo falla, puede ser Eureka, el Gateway, el servicio destino o la BD.
10. **Manejo de CORS en arquitecturas distribuidas:** por qué no basta con `@CrossOrigin`.

---

## 🤖 Declaración sobre el uso de IA

Durante el desarrollo de este proyecto he utilizado **herramientas de inteligencia artificial generativa** como apoyo, principalmente para:

- **Resolver dudas puntuales** sobre sintaxis o configuración de Spring Cloud, Maven, Docker y React.
- **Depurar errores concretos** (por ejemplo, problemas de CORS, conflictos de puertos, errores de compilación con Lombok).
- **Revisar configuraciones** (POMs, `application.yml`, `docker-compose.yml`) para detectar posibles mejoras.
- **Aprender conceptos nuevos** con explicaciones adaptadas a mi nivel previo.

### Declaración explícita

> **La IA ha sido utilizada exclusivamente como herramienta de apoyo al aprendizaje y a la resolución de problemas técnicos. No ha sido la ideadora del proyecto, ni ha definido su arquitectura, ni ha tomado decisiones de diseño. Todas las decisiones arquitectónicas, la elección del dominio del proyecto, el modelo de datos, la organización del código y la dirección general del desarrollo han sido tomadas por mí.**
>
> La IA no ha generado el proyecto de principio a fin: ha sido un recurso de consulta, similar a la documentación oficial, Stack Overflow o cualquier otro material de referencia técnica. El código ha sido escrito, comprendido, modificado y probado por mí, entendiendo cada pieza en su contexto y siendo capaz de explicar y defender cada decisión técnica adoptada.

**En resumen:** la IA ha estado al lado del proyecto, no delante de él. Es una herramienta más del proceso de aprendizaje, igual que un IDE, un depurador o un manual técnico.

---

## 👤 Autor

**Pauline Fugit ** Desarrolladora de Software

Este proyecto forma parte de mi portafolio personal, orientado a demostrar dominio práctico de arquitecturas de microservicios con Spring Boot y Spring Cloud.

📧 Contacto: *(tu email)*
💼 LinkedIn: *(tu linkedin)*
🐙 GitHub: *(tu github)*

---

## 📝 Licencia

Proyecto de uso educativo y de portafolio personal. El contenido temático ("películas malas de culto") es una licencia creativa personal, no vinculada a ninguna plataforma real.

---

*"El cine malo bien hecho merece una plataforma bien hecha."* — NotMubi 